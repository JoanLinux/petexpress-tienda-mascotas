import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  categories: { name: string } | null;
  product_views: { id: string }[];
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async (searchQuery: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(name),
          product_views(id)
        `)
        .eq("is_active", true)
        .gt("stock", 0)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error searching products:", error);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resultados de búsqueda</h1>
          {query && (
            <p className="text-muted-foreground">
              Mostrando resultados para: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Buscando productos...</span>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  {products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image_url || "/placeholder.svg",
                        category: product.categories?.name || "Sin categoría",
                        rating: Math.min(5, Math.max(1, Math.floor((product.product_views?.length || 0) / 10) + 1)),
                        inStock: product.stock > 0,
                        maxStock: product.stock
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-2">
                  No se encontraron productos
                </p>
                <p className="text-muted-foreground">
                  Intenta con otros términos de búsqueda o explora nuestras categorías
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;