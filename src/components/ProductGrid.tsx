import { useEffect, useState } from 'react';
import { ProductCard } from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  categories?: {
    name: string;
  };
  view_count?: number;
}

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Get products with view counts
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          ),
          product_views (
            id
          )
        `)
        .eq('is_active', true)
        .gt('stock', 0)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Process products and add view counts
      const processedProducts = (data || []).map(product => ({
        ...product,
        view_count: product.product_views?.length || 0
      })).sort((a, b) => {
        // Sort by creation date first, then by view count
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        
        if (dateA !== dateB) {
          return dateB - dateA; // Newest first
        }
        
        return (b.view_count || 0) - (a.view_count || 0); // Most viewed first
      });

      setProducts(processedProducts);
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
    rating: 5, // Default rating - could be improved with actual ratings system
    image: product.image_url || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop",
    category: product.categories?.name || 'Sin categoría',
    inStock: product.stock > 0,
    maxStock: product.stock
  });

  if (loading) {
    return (
      <section id="productos" className="py-16 px-4 bg-accent/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Productos Destacados
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre los mejores platillos y bebidas de nuestra tradición culinaria
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Productos Destacados
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre los mejores platillos y bebidas de nuestra tradición culinaria
          </p>
        </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={transformProduct(product)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No hay productos disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </section>
  );
};