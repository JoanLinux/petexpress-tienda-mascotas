import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && !orderCreated) {
      processStripeOrder();
    } else {
      // For cash orders, generate a random order number
      setOrderNumber(`CB-${Date.now().toString().slice(-6)}`);
      setOrderCreated(true);
    }
  }, [sessionId, orderCreated]);

  const processStripeOrder = async () => {
    if (processing) return;
    
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-stripe-success', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data?.success) {
        setOrderCreated(true);
        setOrderNumber(`CB-STRIPE-${data.orderId?.slice(-6) || Date.now().toString().slice(-6)}`);
        toast({
          title: "¡Pedido confirmado!",
          description: "Tu pago se procesó correctamente y tu pedido ha sido confirmado.",
        });
        
        // Redirigir a order-tracking después de un pago de Stripe exitoso
        if (data.orderId) {
          setTimeout(() => {
            window.location.href = `/order-tracking?order=${data.orderId}`;
          }, 2000); // Esperar 2 segundos para mostrar la confirmación
        }
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu pedido. Por favor contacta soporte.",
        variant: "destructive"
      });
      // Show the page anyway with a fallback order number
      setOrderNumber(`CB-${Date.now().toString().slice(-6)}`);
      setOrderCreated(true);
    } finally {
      setProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            {processing ? (
              <div className="mb-6">
                <Loader2 className="h-24 w-24 text-primary mx-auto mb-6 animate-spin" />
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Procesando tu pedido...
                </h1>
                <p className="text-lg text-muted-foreground">
                  Confirmando tu pago y creando tu pedido. Esto tomará solo unos segundos.
                </p>
              </div>
            ) : (
              <>
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  ¡Pedido Confirmado!
                </h1>
                <p className="text-lg text-muted-foreground">
                  {sessionId ? 
                    "Tu pago se procesó exitosamente y tu pedido ha sido confirmado." :
                    "Gracias por tu compra. Hemos recibido tu pedido correctamente."
                  }
                </p>
              </>
            )}
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              {!processing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">
                      Número de pedido: #{orderNumber}
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
                       {sessionId ? 
                         "Tu pedido será redirigido automáticamente al seguimiento en tiempo real en unos segundos." :
                         "Si tu pedido es para delivery, recibirás un enlace por WhatsApp para seguir la ubicación de tu repartidor en tiempo real, igual que en Uber."
                       }
                     </p>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!processing && (
            <>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;