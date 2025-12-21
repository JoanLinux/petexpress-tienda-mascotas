import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Package, Tags, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsResponse, categoriesResponse, activeProductsResponse] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
      ]);

      setStats({
        totalProducts: productsResponse.count || 0,
        totalCategories: categoriesResponse.count || 0,
        activeProducts: activeProductsResponse.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Resumen general del restaurante Casa Beatricita
          </p>
        </div>

        <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Productos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                productos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Productos Activos
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                disponibles para venta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Categorías
              </CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                categorías disponibles
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">
                • Gestionar productos desde la sección Productos
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                • Crear y editar categorías
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                • Los cambios se reflejan en tiempo real en la tienda
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Base de datos</span>
                <span className="text-xs sm:text-sm text-green-600">✓ Conectada</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Autenticación</span>
                <span className="text-xs sm:text-sm text-green-600">✓ Activa</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Almacenamiento</span>
                <span className="text-xs sm:text-sm text-green-600">✓ Disponible</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;