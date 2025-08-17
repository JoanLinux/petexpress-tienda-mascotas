import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Bath, 
  Gamepad2, 
  Stethoscope,
  Crown,
  PawPrint,
  Gift,
  Star
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

// Mapeo específico de iconos por nombre de categoría
const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    "Accesorios": Crown,
    "Comida para Gatos": Heart,
    "Comida para Perros": ShoppingBag,
    "Disfraces": Sparkles,
    "Higiene": Bath,
    "Juguetes": Gamepad2,
    "Salud": Stethoscope,
    // Fallbacks para otras categorías
    "Comida": ShoppingBag,
    "Medicamentos": Stethoscope,
    "Limpieza": Bath,
    "Entretenimiento": Gamepad2,
    "Ropa": Sparkles,
    "Complementos": Crown
  };
  
  return iconMap[categoryName] || PawPrint;
};

const categoryColors = [
  "bg-gradient-to-br from-pink-100 to-rose-200 text-pink-600 shadow-pink-100/50",
  "bg-gradient-to-br from-blue-100 to-sky-200 text-blue-600 shadow-blue-100/50", 
  "bg-gradient-to-br from-green-100 to-emerald-200 text-green-600 shadow-green-100/50",
  "bg-gradient-to-br from-purple-100 to-violet-200 text-purple-600 shadow-purple-100/50",
  "bg-gradient-to-br from-orange-100 to-amber-200 text-orange-600 shadow-orange-100/50",
  "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-600 shadow-teal-100/50",
  "bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-600 shadow-indigo-100/50",
  "bg-gradient-to-br from-red-100 to-pink-200 text-red-600 shadow-red-100/50",
  "bg-gradient-to-br from-yellow-100 to-orange-200 text-yellow-600 shadow-yellow-100/50",
  "bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-600 shadow-emerald-100/50"
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
              className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 bg-gradient-to-br from-white to-gray-50/50 border-0 backdrop-blur-sm"
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${categoryColors[index % categoryColors.length]} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    (() => {
                      const IconComponent = getCategoryIcon(category.name);
                      return <IconComponent className="w-8 h-8" strokeWidth={1.5} />;
                    })()
                  )}
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
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