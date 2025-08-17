import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Truck } from "lucide-react";
import chugHeroImage from "@/assets/chug-hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Lighter Overlay */}
      <div className="absolute inset-0">
        <img 
          src={chugHeroImage} 
          alt="Beautiful CHUG dog" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
                Todo para tu 
                <span className="text-secondary drop-shadow-lg"> mascota</span>
                <br />en un solo lugar
              </h1>
              
              <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto font-light drop-shadow-lg">
                Descubre la mejor selección de comida, juguetes, camas y medicina 
                para hacer feliz a tu compañero peludo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="group px-8 py-4 text-lg font-semibold shadow-elegant hover:shadow-button transition-elegant"
              >
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Ver Catálogo
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-white/50 text-white hover:bg-white/20 backdrop-blur-sm transition-elegant"
              >
                <Heart className="mr-3 h-6 w-6" />
                Lista de Deseos
              </Button>
            </div>

            {/* Professional Features */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="flex items-center gap-3 text-white backdrop-blur-sm bg-white/20 rounded-full px-6 py-3 drop-shadow-lg">
                <Truck className="h-5 w-5 text-secondary" />
                <span className="font-medium">Envío gratis desde $50</span>
              </div>
              <div className="flex items-center gap-3 text-white backdrop-blur-sm bg-white/20 rounded-full px-6 py-3 drop-shadow-lg">
                <Heart className="h-5 w-5 text-secondary" />
                <span className="font-medium">Productos de calidad premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Professional Badge */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-elegant backdrop-blur-sm">
          ¡20% OFF!
        </div>
      </div>
    </section>
  );
};