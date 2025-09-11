import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Navigation, MapPin, Clock, Phone } from 'lucide-react';
import MapComponent from '@/components/MapComponent';

interface DeliveryOrder {
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
  created_at: string;
  order: {
    id: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    total_amount: number;
    order_items: Array<{
      product_name: string;
      quantity: number;
    }>;
  };
}

const statusLabels = {
  assigned: 'Asignado',
  picked_up: 'Recogido',
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

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOrder | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeliveries();
    
    // Set up real-time subscription
    const deliveriesSubscription = supabase
      .channel('delivery-tracking-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'delivery_tracking'
      }, () => {
        fetchDeliveries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(deliveriesSubscription);
    };
  }, []);

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select(`
          *,
          order:orders (
            id,
            customer_name,
            customer_phone,
            delivery_address,
            total_amount,
            order_items (
              product_name,
              quantity
            )
          )
        `)
        .in('status', ['assigned', 'picked_up', 'on_route'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las entregas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      // If moving to delivered, set current time as delivery time
      if (newStatus === 'delivered') {
        updateData.estimated_arrival_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('delivery_tracking')
        .update(updateData)
        .eq('id', deliveryId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `Entrega marcada como ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
      });

      fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado de la entrega.",
      });
    }
  };

  const updateLocation = async (deliveryId: string, location: { lat: number; lng: number }) => {
    setUpdatingLocation(true);
    try {
      const { error } = await supabase
        .from('delivery_tracking')
        .update({
          current_latitude: location.lat,
          current_longitude: location.lng
        })
        .eq('id', deliveryId);

      if (error) throw error;

      setCurrentLocation(location);
      toast({
        title: "Ubicación actualizada",
        description: "Tu ubicación se ha actualizado correctamente.",
      });

      fetchDeliveries();
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la ubicación.",
      });
    } finally {
      setUpdatingLocation(false);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Panel de Entregas</h2>
          <p className="text-muted-foreground">
            Gestiona tus entregas y actualiza tu ubicación en tiempo real
          </p>
        </div>

        {deliveries.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay entregas asignadas en este momento</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de entregas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Entregas Activas</h3>
              {deliveries.map((delivery) => (
                <Card 
                  key={delivery.id} 
                  className={`cursor-pointer transition-all ${
                    selectedDelivery?.id === delivery.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Pedido #{delivery.order.id.slice(0, 8)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {delivery.order.customer_name}
                        </p>
                      </div>
                      <Badge className={statusColors[delivery.status as keyof typeof statusColors]}>
                        {statusLabels[delivery.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{delivery.order.delivery_address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{delivery.order.customer_phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{formatCurrency(delivery.order.total_amount)}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Productos:</p>
                      {delivery.order.order_items.map((item, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {item.quantity}x {item.product_name}
                        </p>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {delivery.status === 'assigned' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateDeliveryStatus(delivery.id, 'picked_up');
                          }}
                        >
                          Marcar Recogido
                        </Button>
                      )}
                      
                      {delivery.status === 'picked_up' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateDeliveryStatus(delivery.id, 'on_route');
                          }}
                        >
                          Iniciar Entrega
                        </Button>
                      )}
                      
                      {delivery.status === 'on_route' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateDeliveryStatus(delivery.id, 'delivered');
                          }}
                        >
                          Marcar Entregado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mapa */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ubicación y Mapa</h3>
              {selectedDelivery ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="h-5 w-5" />
                      Entrega Seleccionada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MapComponent
                      customerLocation={
                        selectedDelivery.customer_latitude && selectedDelivery.customer_longitude
                          ? {
                              lat: parseFloat(selectedDelivery.customer_latitude.toString()),
                              lng: parseFloat(selectedDelivery.customer_longitude.toString())
                            }
                          : undefined
                      }
                      deliveryLocation={
                        selectedDelivery.current_latitude && selectedDelivery.current_longitude
                          ? {
                              lat: parseFloat(selectedDelivery.current_latitude.toString()),
                              lng: parseFloat(selectedDelivery.current_longitude.toString())
                            }
                          : undefined
                      }
                      onLocationUpdate={(location) => updateLocation(selectedDelivery.id, location)}
                      height="500px"
                      showLocationInput={true}
                    />
                    
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Instrucciones:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Haz clic en el mapa para actualizar tu ubicación</li>
                        <li>• Usa el botón de GPS para usar tu ubicación actual</li>
                        <li>• El marcador rojo es la ubicación del cliente</li>
                        <li>• El marcador verde es tu ubicación actual</li>
                      </ul>
                    </div>

                    {updatingLocation && (
                      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Actualizando ubicación...
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      Selecciona una entrega para ver el mapa y actualizar tu ubicación
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeliveryDashboard;