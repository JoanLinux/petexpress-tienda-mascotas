import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, MapPin, Clock, Phone, Truck } from 'lucide-react';
import MapComponent from '@/components/MapComponent';

interface OrderTracking {
  id: string;
  order_id: string;
  delivery_person_name: string;
  delivery_person_phone: string;
  current_latitude: number;
  current_longitude: number;
  customer_latitude: number;
  customer_longitude: number;
  estimated_arrival_time: string;
  status: string;
  order: {
    id: string;
    customer_name: string;
    total_amount: number;
    delivery_address: string;
    order_items: Array<{
      product_name: string;
      quantity: number;
      subtotal: number;
    }>;
  };
}

const statusLabels = {
  assigned: 'Asignado',
  picked_up: 'Pedido recogido',
  on_route: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
};

const statusColors = {
  assigned: 'bg-yellow-100 text-yellow-800',
  picked_up: 'bg-blue-100 text-blue-800',
  on_route: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) {
      setError('ID de pedido no encontrado');
      setLoading(false);
      return;
    }

    fetchTracking();
    
    // Set up real-time subscription
    const trackingSubscription = supabase
      .channel('order-tracking-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'delivery_tracking',
        filter: `order_id=eq.${orderId}`
      }, () => {
        fetchTracking();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(trackingSubscription);
    };
  }, [orderId]);

  const fetchTracking = async () => {
    if (!orderId) return;

    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select(`
          *,
          order:orders (
            id,
            customer_name,
            total_amount,
            delivery_address,
            order_items (
              product_name,
              quantity,
              subtotal
            )
          )
        `)
        .eq('order_id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('No se encontró información de seguimiento para este pedido');
        } else {
          throw error;
        }
      } else {
        setTracking(data);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching tracking:', error);
      setError('Error al cargar el seguimiento del pedido');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'Tu pedido ha sido asignado a un repartidor';
      case 'picked_up':
        return 'El repartidor ha recogido tu pedido';
      case 'on_route':
        return 'Tu pedido está en camino';
      case 'delivered':
        return '¡Tu pedido ha sido entregado!';
      case 'cancelled':
        return 'Tu pedido ha sido cancelado';
      default:
        return 'Estado desconocido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No se encontró información de seguimiento para este pedido
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Seguimiento de Pedido</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Info */}
          <div className="space-y-4">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Estado del Pedido
                  </CardTitle>
                  <Badge className={statusColors[tracking.status as keyof typeof statusColors]}>
                    {statusLabels[tracking.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {getStatusMessage(tracking.status)}
                </p>
                
                {tracking.estimated_arrival_time && tracking.status === 'on_route' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Tiempo estimado: {formatTime(tracking.estimated_arrival_time)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Person Info */}
            {tracking.delivery_person_name && (
              <Card>
                <CardHeader>
                  <CardTitle>Información del Repartidor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <strong>Nombre:</strong> {tracking.delivery_person_name}
                  </p>
                  {tracking.delivery_person_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{tracking.delivery_person_phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm">
                    <strong>Pedido #:</strong> {tracking.order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm">
                    <strong>Cliente:</strong> {tracking.order.customer_name}
                  </p>
                  <p className="text-sm">
                    <strong>Total:</strong> {formatCurrency(tracking.order.total_amount)}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Dirección de entrega:</p>
                    <p className="text-sm text-muted-foreground">
                      {tracking.order.delivery_address}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Productos:</p>
                  <div className="space-y-2">
                    {tracking.order.order_items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ubicación en Tiempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <MapComponent
                  customerLocation={
                    tracking.customer_latitude && tracking.customer_longitude
                      ? {
                          lat: parseFloat(tracking.customer_latitude.toString()),
                          lng: parseFloat(tracking.customer_longitude.toString())
                        }
                      : undefined
                  }
                  deliveryLocation={
                    tracking.current_latitude && tracking.current_longitude
                      ? {
                          lat: parseFloat(tracking.current_latitude.toString()),
                          lng: parseFloat(tracking.current_longitude.toString())
                        }
                      : undefined
                  }
                  height="500px"
                  showLocationInput={true}
                />
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Leyenda:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Tu ubicación (cliente)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Repartidor</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;