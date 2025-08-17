import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  categories?: {
    name: string;
  };
}

const ProductsByCategory = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when component mounts or category changes
    window.scrollTo(0, 0);
    
    if (categoryName) {
      fetchProductsByCategory();
    }
  }, [categoryName]);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      
      // First get the category ID
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      if (categoryError) throw categoryError;

      // Then get products for that category
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .eq('category_id', category.id)
        .gt('stock', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los productos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const transformProduct = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    rating: 5, // Default rating - could be improved with actual ratings
    image: product.image_url || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop",
    category: product.categories?.name || 'Sin categoría',
    inStock: product.stock > 0,
    maxStock: product.stock
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {categoryName}
            </h1>
            <p className="text-muted-foreground">
              Productos disponibles en la categoría {categoryName}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={transformProduct(product)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-muted-foreground mb-6">
                No se encontraron productos en la categoría {categoryName}
              </p>
              <Link to="/">
                <Button>
                  Ver todos los productos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsByCategory;