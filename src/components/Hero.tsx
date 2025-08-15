import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Truck } from "lucide-react";
import heroImage from "@/assets/hero-pets.png";

export const Hero = () => {
  return (
    <section className="relative py-16 px-4 bg-gradient-hero overflow-hidden">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Todo para tu 
                <span className="text-primary"> mascota</span>
                <br />en un solo lugar
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md">
                Descubre la mejor selección de comida, juguetes, camas y medicina 
                para hacer feliz a tu compañero peludo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Ver Catálogo
              </Button>
              
              <Button variant="outline" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Lista de Deseos
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                Envío gratis desde $50
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-primary" />
                Productos de calidad
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card bg-gradient-card">
              <img 
                src={heroImage} 
                alt="Productos para mascotas" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-primary">
              ¡20% OFF!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};