import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Truck, MapPin, Navigation, Loader2 } from 'lucide-react';
import MapComponent from '@/components/MapComponent';

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  latitude?: number;
  longitude?: number;
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [orderType, setOrderType] = useState('delivery');
  const [showMap, setShowMap] = useState(false);
  const { latitude, longitude, loading: geoLoading, getCurrentPosition } = useGeolocation();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    latitude: undefined,
    longitude: undefined
  });

  // Update customer location when geolocation changes
  useEffect(() => {
    if (latitude && longitude) {
      setCustomerInfo(prev => ({
        ...prev,
        latitude,
        longitude
      }));
    }
  }, [latitude, longitude]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone'];
    
    // For delivery orders, address and city are required
    if (orderType === 'delivery') {
      required.push('address', 'city');
    }
    
    for (const field of required) {
      if (!customerInfo[field as keyof CustomerInfo]) {
        toast({
          title: "Campos requeridos",
          description: `Por favor completa el campo: ${field}`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleStripePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          customer: customerInfo
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error en el pago",
        description: "No se pudo procesar el pago. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleCashPayment = async () => {
    try {
      // Create the order first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerInfo.fullName,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          delivery_address: orderType === 'delivery' ? customerInfo.address : null,
          total_amount: totalPrice,
          status: 'pending',
          payment_status: 'pending',
          order_type: orderType,
          notes: customerInfo.notes,
          user_id: user?.id || null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create delivery tracking if it's a delivery order
      if (orderType === 'delivery') {
        const { error: trackingError } = await supabase
          .from('delivery_tracking')
          .insert({
            order_id: orderData.id,
            customer_latitude: customerInfo.latitude,
            customer_longitude: customerInfo.longitude,
            status: 'assigned'
          });

        if (trackingError) console.error('Error creating delivery tracking:', trackingError);
      }
      
      toast({
        title: "Pedido confirmado",
        description: "Tu pedido se ha registrado. Te contactaremos pronto.",
      });

      clearCart();
      
      // Redirect to order tracking if delivery, otherwise to success page
      if (orderType === 'delivery') {
        navigate(`/order-tracking?order=${orderData.id}`);
      } else {
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Error creating cash order:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el pedido. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      if (paymentMethod === 'stripe') {
        await handleStripePayment();
      } else {
        await handleCashPayment();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Finalizar Compra
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Tipo de Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={orderType} 
                      onValueChange={setOrderType}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <div className="flex-1">
                          <Label htmlFor="delivery" className="font-medium">
                            Delivery
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Entrega a domicilio
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <div className="flex-1">
                          <Label htmlFor="pickup" className="font-medium">
                            Recoger en tienda
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Recoge tu pedido en Casa Beatricita
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {orderType === 'delivery' ? 'Información de Entrega' : 'Información de Contacto'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Nombre Completo *</Label>
                        <Input
                          id="fullName"
                          value={customerInfo.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Tu número de teléfono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    {orderType === 'delivery' && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="address">Dirección *</Label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={getCurrentPosition}
                                disabled={geoLoading}
                              >
                                {geoLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Navigation className="h-4 w-4 mr-2" />
                                )}
                                Usar mi ubicación
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowMap(!showMap)}
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                {showMap ? 'Ocultar mapa' : 'Ver mapa'}
                              </Button>
                            </div>
                          </div>
                          <Input
                            id="address"
                            value={customerInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Calle, número, apartamento"
                            required={orderType === 'delivery'}
                          />
                          
                          {latitude && longitude && (
                            <p className="text-sm text-muted-foreground">
                              📍 Ubicación detectada: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </p>
                          )}
                        </div>

                        {showMap && (
                          <div className="mt-4">
                            <MapComponent
                              customerLocation={
                                customerInfo.latitude && customerInfo.longitude
                                  ? { lat: customerInfo.latitude, lng: customerInfo.longitude }
                                  : latitude && longitude
                                  ? { lat: latitude, lng: longitude }
                                  : undefined
                              }
                              onLocationUpdate={(location) => {
                                setCustomerInfo(prev => ({
                                  ...prev,
                                  latitude: location.lat,
                                  longitude: location.lng
                                }));
                              }}
                              height="300px"
                              showLocationInput={true}
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="city">Ciudad *</Label>
                          <Input
                            id="city"
                            value={customerInfo.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Tu ciudad"
                            required={orderType === 'delivery'}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="notes">Notas Adicionales</Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder={
                          orderType === 'delivery' 
                            ? "Instrucciones especiales para la entrega..."
                            : "Comentarios sobre tu pedido..."
                        }
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Método de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <div className="flex-1">
                          <Label htmlFor="stripe" className="font-medium">
                            Pago con Tarjeta (Stripe)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Pago seguro con tarjeta de crédito o débito
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cash" id="cash" />
                        <div className="flex-1">
                          <Label htmlFor="cash" className="font-medium">
                            Pago Contra Entrega
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Paga en efectivo cuando recibas tu pedido
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Resumen del Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Cantidad: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Envío</span>
                        <span className="text-green-600">Gratis</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="pet"
                      disabled={isProcessing}
                    >
                      {isProcessing 
                        ? 'Procesando...' 
                        : paymentMethod === 'stripe' 
                          ? 'Pagar con Tarjeta' 
                          : 'Confirmar Pedido'
                      }
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Al hacer clic en "{paymentMethod === 'stripe' ? 'Pagar con Tarjeta' : 'Confirmar Pedido'}" 
                      aceptas nuestros términos y condiciones.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;