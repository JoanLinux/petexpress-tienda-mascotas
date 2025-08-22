import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
}

const gradientColors = [
  "bg-gradient-to-r from-orange-400 to-red-500",
  "bg-gradient-to-r from-green-400 to-blue-500", 
  "bg-gradient-to-r from-purple-400 to-pink-500"
];

const icons = [
  <Gift className="h-6 w-6" />,
  <Star className="h-6 w-6" />,
  <Clock className="h-6 w-6" />
];

export const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching promotions:', error);
        toast.error('Error al cargar las promociones');
        return;
      }

      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Error al cargar las promociones');
    } finally {
      setLoading(false);
    }
  };

  const formatDiscount = (promotion: Promotion) => {
    if (promotion.discount_percentage) {
      return `${promotion.discount_percentage}% OFF`;
    }
    if (promotion.discount_amount) {
      return `$${promotion.discount_amount} OFF`;
    }
    return "OFERTA";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Promociones Especiales
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-0 overflow-hidden">
                <div className="bg-muted animate-pulse h-48" />
                <CardContent className="p-6">
                  <div className="h-10 bg-muted animate-pulse rounded" />
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
            Promociones Especiales
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No te pierdas nuestras ofertas exclusivas y descuentos especiales 
            en nuestros deliciosos platillos y bebidas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {promotions.map((promo, index) => (
            <Card 
              key={promo.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 overflow-hidden"
            >
              <div className={`${gradientColors[index % gradientColors.length]} p-6 text-white relative`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    {icons[index % icons.length]}
                  </div>
                  <Badge className="bg-white text-gray-900 font-bold">
                    {formatDiscount(promo)}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {promo.title}
                </h3>
                
                <p className="text-white/90 text-sm mb-4">
                  {promo.description || "Oferta especial por tiempo limitado"}
                </p>
                
                <div className="flex items-center text-white/80 text-xs mb-4">
                  <Clock className="h-3 w-3 mr-1" />
                  Válido hasta: {formatDate(promo.end_date)}
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

        {promotions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay promociones activas en este momento</p>
          </div>
        )}
      </div>
    </section>
  );
};