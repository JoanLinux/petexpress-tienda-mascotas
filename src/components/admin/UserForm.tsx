import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserWithDetails } from '@/hooks/useUsers';
import { User, Shield, Truck, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserFormProps {
  user?: UserWithDetails | null;
  onSubmit: (userData: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const roleConfig = {
  admin: { label: 'Administrador', icon: Shield, color: 'bg-red-100 text-red-800' },
  user: { label: 'Usuario', icon: User, color: 'bg-blue-100 text-blue-800' },
  delivery_person: { label: 'Repartidor', icon: Truck, color: 'bg-green-100 text-green-800' },
  customer: { label: 'Cliente', icon: Users, color: 'bg-purple-100 text-purple-800' }
};

export const UserForm = ({ user, onSubmit, onCancel, isLoading }: UserFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    roles: [] as string[],
    is_active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '', // No se pre-llena la contraseña
        full_name: user.profile?.full_name || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
        city: user.profile?.city || '',
        notes: user.profile?.notes || '',
        roles: user.roles.map(r => r.role),
        is_active: user.profile?.is_active ?? true
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El email es requerido.",
      });
      return;
    }
    
    if (!formData.full_name?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre es requerido.",
      });
      return;
    }
    
    // Validate required fields for new users
    if (!user && !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña es requerida para nuevos usuarios.",
      });
      return;
    }
    
    // Validate at least one role is selected
    if (formData.roles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe seleccionar al menos un rol para el usuario.",
      });
      return;
    }

    await onSubmit(formData);
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@ejemplo.com"
                required
                disabled={!!user} // No permitir cambiar email en edición
              />
            </div>

            {!user && (
              <div>
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Contraseña segura"
                  required={!user}
                  minLength={6}
                />
              </div>
            )}

            <div>
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Dirección completa"
              />
            </div>

            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Ciudad"
              />
            </div>
          </div>

          {/* Roles */}
          <div>
            <Label className="text-base font-medium">Roles del Usuario *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {Object.entries(roleConfig).map(([roleKey, config]) => {
                const Icon = config.icon;
                return (
                  <div key={roleKey} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={roleKey}
                      checked={formData.roles.includes(roleKey)}
                      onCheckedChange={(checked) => handleRoleChange(roleKey, checked as boolean)}
                    />
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <Label htmlFor={roleKey} className="cursor-pointer">
                        {config.label}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>
            {formData.roles.length > 0 && (
              <div className="flex gap-2 mt-2">
                {formData.roles.map(role => {
                  const config = roleConfig[role as keyof typeof roleConfig];
                  return (
                    <Badge key={role} className={config.color}>
                      {config.label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Estado */}
          {user && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
              />
              <Label htmlFor="is_active">Usuario activo</Label>
            </div>
          )}

          {/* Notas */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas adicionales sobre el usuario..."
              rows={3}
            />
          </div>

          {/* Acciones */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Guardando...' : user ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};