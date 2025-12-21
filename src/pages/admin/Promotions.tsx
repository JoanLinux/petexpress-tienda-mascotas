import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PromotionForm } from '@/components/admin/PromotionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  discount_amount: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  banner_image_url: string | null;
  product_ids: string[];
  category_ids: string[];
  created_at: string;
}

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las promociones.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Promoción eliminada correctamente.",
      });

      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la promoción.",
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: `Promoción ${!isActive ? 'activada' : 'desactivada'} correctamente.`,
      });

      fetchPromotions();
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la promoción.",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPromotion(null);
    fetchPromotions();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPromotion(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);
    return promotion.is_active && now >= startDate && now <= endDate;
  };

  if (showForm) {
    return (
      <AdminLayout>
        <PromotionForm
          promotion={editingPromotion || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground">Promociones</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona las promociones especiales de tu tienda
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : promotions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-48 sm:h-64 p-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                No hay promociones
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Crea tu primera promoción especial para atraer más clientes
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Promoción
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {promotions.map((promotion) => (
              <Card key={promotion.id}>
                <CardHeader className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base sm:text-xl truncate">{promotion.title}</CardTitle>
                        <Badge variant={isPromotionActive(promotion) ? "default" : "secondary"} className="text-xs">
                          {isPromotionActive(promotion) ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      {promotion.description && (
                        <CardDescription className="text-xs sm:text-sm line-clamp-2">
                          {promotion.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={promotion.is_active}
                        onCheckedChange={() => toggleActive(promotion.id, promotion.is_active)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(promotion)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              Esta acción no se puede deshacer. Se eliminará permanentemente la promoción.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(promotion.id)} className="w-full sm:w-auto">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium text-xs sm:text-sm">Descuento:</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {promotion.discount_percentage 
                          ? `${promotion.discount_percentage}%` 
                          : `$${promotion.discount_amount}`
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-xs sm:text-sm">Fecha de inicio:</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatDate(promotion.start_date)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-xs sm:text-sm">Fecha de fin:</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatDate(promotion.end_date)}
                      </p>
                    </div>
                  </div>
                  
                  {(promotion.product_ids.length > 0 || promotion.category_ids.length > 0) && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                      <span className="font-medium text-xs sm:text-sm">Aplicable a:</span>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                        {promotion.product_ids.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {promotion.product_ids.length} producto(s)
                          </Badge>
                        )}
                        {promotion.category_ids.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {promotion.category_ids.length} categoría(s)
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Promotions;