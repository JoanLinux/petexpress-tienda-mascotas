import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

const categoryIcons = [
  "🍖", "🎾", "🛏️", "💊", "🦴", "🧼", "🐕", "🐱", "🏠", "🎀"
];

const categoryColors = [
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-600", 
  "bg-blue-100 text-blue-600",
  "bg-red-100 text-red-600",
  "bg-purple-100 text-purple-600",
  "bg-teal-100 text-teal-600",
  "bg-yellow-100 text-yellow-600",
  "bg-pink-100 text-pink-600",
  "bg-indigo-100 text-indigo-600",
  "bg-cyan-100 text-cyan-600"
];

export const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar las categorías');
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Categorías de Productos
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-gradient-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted animate-pulse mb-4 mx-auto" />
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Categorías de Productos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para el cuidado y felicidad de tu mascota 
            en nuestras categorías especializadas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card 
              key={category.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-2 bg-gradient-card border-0"
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-2xl ${categoryColors[index % categoryColors.length]} group-hover:scale-110 transition-transform`}>
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    categoryIcons[index % categoryIcons.length]
                  )}
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-xs text-muted-foreground">
                  {category.description || "Productos de calidad para tu mascota"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};