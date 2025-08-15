import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import pawLogo from "@/assets/paw-logo.png";

export const Footer = () => {
  const handleWhatsAppContact = () => {
    const phoneNumber = "+1234567890"; // Reemplaza con tu número real
    const message = "¡Hola! Me interesa conocer más sobre los productos de PetExpress";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={pawLogo} alt="PetExpress" className="h-8 w-8 brightness-0 invert" />
              <h3 className="text-xl font-bold">PetExpress</h3>
            </div>
            <p className="text-background/80 text-sm">
              Tu tienda de confianza para el cuidado y felicidad de tu mascota. 
              Productos de calidad al mejor precio.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">Catálogo</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Promociones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mi Cuenta</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Historial de Pedidos</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Categorías</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">Comida</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Juguetes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Camas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Medicina</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-background/80">
                <MapPin className="h-4 w-4 text-primary" />
                Calle Principal 123, Ciudad
              </div>
              <div className="flex items-center gap-2 text-sm text-background/80">
                <Phone className="h-4 w-4 text-primary" />
                +1 (234) 567-8900
              </div>
              <div className="flex items-center gap-2 text-sm text-background/80">
                <Mail className="h-4 w-4 text-primary" />
                contacto@petexpress.com
              </div>
              <Button 
                onClick={handleWhatsAppContact}
                variant="hero" 
                size="sm" 
                className="w-full mt-4"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar por WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/80">
            <p>&copy; 2024 PetExpress. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
              <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};