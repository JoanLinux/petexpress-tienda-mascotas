import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Import hyperrealistic icons
import accesoriosIcon from "@/assets/icons/accesorios-icon.webp";
import comidaGatosIcon from "@/assets/icons/comida-gatos-icon.webp";
import comidaPerrosIcon from "@/assets/icons/comida-perros-icon.webp";
import disfracesIcon from "@/assets/icons/disfraces-icon.webp";
import higieneIcon from "@/assets/icons/higiene-icon.webp";
import juguetesIcon from "@/assets/icons/juguetes-icon.webp";
import saludIcon from "@/assets/icons/salud-icon.webp";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

// Mapeo específico de iconos hiperrealistas por nombre de categoría
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: { [key: string]: string } = {
    "Accesorios": accesoriosIcon,
    "Comida para Gatos": comidaGatosIcon,
    "Comida para Perros": comidaPerrosIcon,
    "Disfraces": disfracesIcon,
    "Higiene": higieneIcon,
    "Juguetes": juguetesIcon,
    "Salud": saludIcon,
    // Fallbacks para otras categorías
    "Comida": comidaPerrosIcon,
    "Medicamentos": saludIcon,
    "Limpieza": higieneIcon,
    "Entretenimiento": juguetesIcon,
    "Ropa": disfracesIcon,
    "Complementos": accesoriosIcon
  };
  
  return iconMap[categoryName] || accesoriosIcon;
};

const categoryColors = [
  "bg-gradient-to-br from-pink-50/80 to-rose-100/80 border border-pink-200/50 shadow-pink-200/30",
  "bg-gradient-to-br from-blue-50/80 to-sky-100/80 border border-blue-200/50 shadow-blue-200/30", 
  "bg-gradient-to-br from-green-50/80 to-emerald-100/80 border border-green-200/50 shadow-green-200/30",
  "bg-gradient-to-br from-purple-50/80 to-violet-100/80 border border-purple-200/50 shadow-purple-200/30",
  "bg-gradient-to-br from-orange-50/80 to-amber-100/80 border border-orange-200/50 shadow-orange-200/30",
  "bg-gradient-to-br from-teal-50/80 to-cyan-100/80 border border-teal-200/50 shadow-teal-200/30",
  "bg-gradient-to-br from-indigo-50/80 to-blue-100/80 border border-indigo-200/50 shadow-indigo-200/30",
  "bg-gradient-to-br from-red-50/80 to-pink-100/80 border border-red-200/50 shadow-red-200/30",
  "bg-gradient-to-br from-yellow-50/80 to-orange-100/80 border border-yellow-200/50 shadow-yellow-200/30",
  "bg-gradient-to-br from-emerald-50/80 to-teal-100/80 border border-emerald-200/50 shadow-emerald-200/30"
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
              className="group cursor-pointer transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-4 bg-gradient-to-br from-white/90 to-gray-50/30 border-0 backdrop-blur-md overflow-hidden"
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 backdrop-blur-sm ${categoryColors[index % categoryColors.length]} group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 shadow-2xl`}>
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-12 h-12 object-contain drop-shadow-lg"
                    />
                  ) : (
                    <img 
                      src={getCategoryIcon(category.name)}
                      alt={category.name}
                      className="w-12 h-12 object-contain drop-shadow-lg filter hover:brightness-110 transition-all duration-300"
                    />
                  )}
                </div>
                
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors text-sm">
                  {category.name}
                </h3>
                
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
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