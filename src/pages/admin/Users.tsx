import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useUsers, UserWithDetails } from '@/hooks/useUsers';
import { UserForm } from '@/components/admin/UserForm';
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Search,
  User,
  Shield,
  Truck,
  Users as UsersIcon,
  Loader2,
  ChefHat
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const roleConfig = {
  admin: { label: 'Admin', icon: Shield, color: 'bg-red-100 text-red-800' },
  user: { label: 'Usuario', icon: User, color: 'bg-blue-100 text-blue-800' },
  delivery_person: { label: 'Repartidor', icon: Truck, color: 'bg-green-100 text-green-800' },
  customer: { label: 'Cliente', icon: UsersIcon, color: 'bg-purple-100 text-purple-800' },
  cook: { label: 'Cocinero', icon: ChefHat, color: 'bg-orange-100 text-orange-800' }
};

const Users = () => {
  const { users, loading, createUser, updateUserProfile, updateUserRoles, toggleUserStatus, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.phone?.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.roles.some(role => role.role === roleFilter);
    
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: UserWithDetails) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleSubmitUser = async (userData: any) => {
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        // Actualizar usuario existente
        await updateUserProfile(selectedUser.id, {
          full_name: userData.full_name,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          notes: userData.notes,
          is_active: userData.is_active
        });
        
        await updateUserRoles(selectedUser.id, userData.roles);
      } else {
        // Crear nuevo usuario
        await createUser(userData);
      }
      setShowUserForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error submitting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserWithDetails) => {
    await toggleUserStatus(user.id, !user.profile?.is_active);
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h2>
            <p className="text-muted-foreground">
              Administra clientes, usuarios, repartidores y administradores
            </p>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Usuario
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={roleFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('all')}
                >
                  Todos ({users.length})
                </Button>
                {Object.entries(roleConfig).map(([role, config]) => {
                  const count = users.filter(u => u.roles.some(r => r.role === role)).length;
                  return (
                    <Button
                      key={role}
                      variant={roleFilter === role ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRoleFilter(role)}
                    >
                      {config.label} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de usuarios */}
        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || roleFilter !== 'all' 
                    ? 'No se encontraron usuarios con los filtros aplicados'
                    : 'No hay usuarios registrados'
                  }
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className={`${!user.profile?.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {user.profile?.full_name || 'Sin nombre'}
                        </h3>
                        {!user.profile?.is_active && (
                          <Badge variant="secondary">Inactivo</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>📧 {user.email}</p>
                        {user.profile?.phone && <p>📱 {user.profile.phone}</p>}
                        {user.profile?.address && (
                          <p>📍 {user.profile.address}{user.profile.city && `, ${user.profile.city}`}</p>
                        )}
                        <p>📅 Creado: {formatDate(user.created_at)}</p>
                      </div>

                      <div className="flex gap-2 mt-3">
                        {user.roles.map((role) => {
                          const config = roleConfig[role.role as keyof typeof roleConfig];
                          const Icon = config.icon;
                          return (
                            <Badge key={role.id} className={config.color}>
                              <Icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                          );
                        })}
                      </div>

                      {user.profile?.notes && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <strong>Notas:</strong> {user.profile.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.profile?.is_active ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de 
                              {user.profile?.full_name || user.email} y todos sus datos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Formulario de usuario */}
        <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={selectedUser}
              onSubmit={handleSubmitUser}
              onCancel={() => {
                setShowUserForm(false);
                setSelectedUser(null);
              }}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Users;