import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'delivery_person' | 'customer' | 'cook';
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithDetails {
  id: string;
  email: string;
  created_at: string;
  profile: UserProfile | null;
  roles: UserRole[];
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Obtener perfiles de usuarios
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Obtener roles de usuarios
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combinar datos usando el email real almacenado en user_profiles
      const usersData: UserWithDetails[] = profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.email || 'email-no-disponible@ejemplo.com', // Usar email real del perfil
        created_at: profile.created_at,
        profile,
        roles: roles?.filter(role => role.user_id === profile.user_id) || []
      })) || [];

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los usuarios.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    address?: string;
    city?: string;
    notes?: string;
    roles: ('admin' | 'user' | 'delivery_person' | 'customer')[];
  }) => {
    try {
      // Llamar a la edge function para crear usuario
      const { data, error } = await supabase.functions.invoke('create-user-admin', {
        body: userData
      });

      if (error) {
        console.error('Edge function error:', error);
        // Handle specific error cases
        if (error.message?.includes('email_exists') || error.message?.includes('already been registered')) {
          throw new Error(`El email ${userData.email} ya está registrado en el sistema.`);
        }
        throw error;
      }

      toast({
        title: "Usuario creado",
        description: "El usuario se ha creado exitosamente.",
      });

      await fetchUsers();
      return data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      let errorMessage = "No se pudo crear el usuario.";
      
      // Handle different types of errors
      if (error.message?.includes('email_exists') || error.message?.includes('already been registered')) {
        errorMessage = `El email ${userData.email} ya está registrado en el sistema.`;
      } else if (error.message?.includes('Edge Function returned a non-2xx status code')) {
        errorMessage = "Error del servidor. Verifique que el email no esté duplicado.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error al crear usuario",
        description: errorMessage,
      });
      throw error;
    }
  };

  const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Los datos del usuario se han actualizado.",
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el perfil del usuario.",
      });
      throw error;
    }
  };

  const updateUserRoles = async (userId: string, newRoles: ('admin' | 'user' | 'delivery_person' | 'customer')[]) => {
    try {
      // Obtener el usuario actual
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // Eliminar roles actuales
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Agregar nuevos roles
      if (newRoles.length > 0) {
        const rolesData = newRoles.map(role => ({
          user_id: userId,
          role,
          created_by: currentUser?.id
        }));

        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(rolesData);

        if (insertError) throw insertError;
      }

      toast({
        title: "Roles actualizados",
        description: "Los roles del usuario se han actualizado.",
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating user roles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron actualizar los roles del usuario.",
      });
      throw error;
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateUserProfile(userId, { is_active: isActive });
      
      toast({
        title: isActive ? "Usuario activado" : "Usuario desactivado",
        description: `El usuario ha sido ${isActive ? 'activado' : 'desactivado'} exitosamente.`,
      });
    } catch (error) {
      // Error ya manejado en updateUserProfile
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Llamar a la edge function para eliminar usuario
      const { error } = await supabase.functions.invoke('delete-user-admin', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: "El usuario se ha eliminado exitosamente.",
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario.",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    createUser,
    updateUserProfile,
    updateUserRoles,
    toggleUserStatus,
    deleteUser,
    refetchUsers: fetchUsers
  };
};