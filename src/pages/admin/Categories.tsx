import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las categorías.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado correctamente.",
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la categoría.",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(undefined);
    fetchCategories();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Categorías</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona las categorías de productos
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        {showForm && (
          <CategoryForm
            category={editingCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="p-3 sm:p-6">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base sm:text-lg truncate">{category.name}</CardTitle>
                  <div className="flex flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                {category.image_url && (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-24 sm:h-32 object-cover rounded-md mb-2 sm:mb-3"
                  />
                )}
                {category.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <Card>
            <CardContent className="py-6 sm:py-8 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                No hay categorías registradas. Crea la primera categoría.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;