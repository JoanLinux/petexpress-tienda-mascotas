import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Comida",
    icon: "🍖",
    description: "Alimento premium para perros y gatos",
    color: "bg-orange-100 text-orange-600"
  },
  {
    name: "Juguetes", 
    icon: "🎾",
    description: "Diversión garantizada para tu mascota",
    color: "bg-green-100 text-green-600"
  },
  {
    name: "Camas",
    icon: "🛏️", 
    description: "Descanso cómodo y relajante",
    color: "bg-blue-100 text-blue-600"
  },
  {
    name: "Medicina",
    icon: "💊",
    description: "Cuidado y salud veterinaria",
    color: "bg-red-100 text-red-600"
  },
  {
    name: "Accesorios",
    icon: "🦴",
    description: "Collares, correas y más",
    color: "bg-purple-100 text-purple-600"
  },
  {
    name: "Higiene",
    icon: "🧼",
    description: "Productos de limpieza y cuidado",
    color: "bg-teal-100 text-teal-600"
  }
];

export const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

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
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-2 bg-gradient-card border-0"
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-2xl ${category.color} group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};