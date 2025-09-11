import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-lg text-muted-foreground">
              Gracias por tu compra. Hemos recibido tu pedido correctamente.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-primary">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">
                    Número de pedido: #CB-{Date.now().toString().slice(-6)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Te enviaremos un email de confirmación con todos los detalles de tu pedido.
                </p>

                <div className="bg-accent/20 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    ¿Qué sigue?
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Procesaremos tu pedido inmediatamente</p>
                    <p>• Te contactaremos para confirmar los detalles</p>
                    <p>• Si es delivery, podrás seguir tu pedido en tiempo real</p>
                    <p>• El tiempo de entrega es de 30-45 minutos</p>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-center space-x-2 text-primary mb-2">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">Seguimiento en Tiempo Real</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Si tu pedido es para delivery, recibirás un enlace por WhatsApp para seguir 
                    la ubicación de tu repartidor en tiempo real, igual que en Uber.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Llámanos</h3>
                <p className="text-sm text-muted-foreground">
                  +52 55 1234 5678
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Escríbenos</h3>
                <p className="text-sm text-muted-foreground">
                  pedidos@casabeatricita.com
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Link to="/" className="block">
              <Button variant="pet" className="w-full md:w-auto">
                Continuar comprando
              </Button>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              ¿Tienes alguna pregunta sobre tu pedido?{' '}
              <a href="mailto:pedidos@casabeatricita.com" className="text-primary hover:underline">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;