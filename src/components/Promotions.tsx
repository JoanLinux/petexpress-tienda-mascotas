import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, Star } from "lucide-react";

const promotions = [
  {
    title: "¡Super Oferta del Mes!",
    description: "20% de descuento en todos los alimentos premium",
    discount: "20% OFF",
    validUntil: "31 Dec 2024",
    bgColor: "bg-gradient-to-r from-orange-400 to-red-500",
    icon: <Gift className="h-6 w-6" />
  },
  {
    title: "Envío Gratis",
    description: "En compras mayores a $50 en toda la tienda",
    discount: "GRATIS",
    validUntil: "Oferta permanente",
    bgColor: "bg-gradient-to-r from-green-400 to-blue-500",
    icon: <Star className="h-6 w-6" />
  },
  {
    title: "Flash Sale",
    description: "Juguetes con hasta 40% de descuento por tiempo limitado",
    discount: "40% OFF",
    validUntil: "Hasta agotar stock",
    bgColor: "bg-gradient-to-r from-purple-400 to-pink-500",
    icon: <Clock className="h-6 w-6" />
  }
];

export const Promotions = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Promociones Especiales
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No te pierdas nuestras ofertas exclusivas y descuentos especiales 
            para el cuidado de tu mascota
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {promotions.map((promo, index) => (
            <Card 
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 overflow-hidden"
            >
              <div className={`${promo.bgColor} p-6 text-white relative`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    {promo.icon}
                  </div>
                  <Badge className="bg-white text-gray-900 font-bold">
                    {promo.discount}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {promo.title}
                </h3>
                
                <p className="text-white/90 text-sm mb-4">
                  {promo.description}
                </p>
                
                <div className="flex items-center text-white/80 text-xs mb-4">
                  <Clock className="h-3 w-3 mr-1" />
                  Válido hasta: {promo.validUntil}
                </div>
              </div>
              
              <CardContent className="p-6">
                <Button variant="hero" className="w-full">
                  Ver Oferta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};