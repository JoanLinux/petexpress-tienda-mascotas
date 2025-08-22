import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Clock } from "lucide-react";
import casaBeatricitaHero from "@/assets/casa-beatricita-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src={casaBeatricitaHero} 
          alt="Casa Beatricita - Auténtica cocina mexicana" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay from dark at bottom to transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
                Casa
                <span className="text-accent drop-shadow-lg"> Beatricita</span>
                <br />
                <span className="text-3xl md:text-4xl font-light">Sabor y Tradición</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto font-light drop-shadow-lg">
                Deleitando paladares desde 1907 con auténtica cocina mexicana.
                Descubre nuestros platillos tradicionales y bebidas artesanales.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="group px-8 py-4 text-lg font-semibold shadow-elegant hover:shadow-button transition-elegant"
                onClick={() => window.location.href = '#productos'}
              >
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Ver Menú
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 border-white bg-white/20 text-white hover:bg-white hover:text-primary backdrop-blur-sm transition-elegant"
              >
                <Heart className="mr-3 h-6 w-6" />
                Favoritos
              </Button>
            </div>

            {/* Professional Features */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="flex items-center gap-3 text-white backdrop-blur-sm bg-white/20 rounded-full px-6 py-3 drop-shadow-lg">
                <Heart className="h-5 w-5 text-accent" />
                <span className="font-medium">Tradición desde 1907</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};