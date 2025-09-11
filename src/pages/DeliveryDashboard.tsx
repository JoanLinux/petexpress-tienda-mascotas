import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Package, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/hooks/use-toast';

interface DeliveryOrder {
  id: string;
  order_id: string;
  delivery_person_name: string;
  delivery_person_phone: string;
  customer_latitude: number;
  customer_longitude: number;
  current_latitude: number;
  current_longitude: number;
  status: string;
  estimated_arrival_time: string;
  created_at: string;
  order: {
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

  useEffect(() => {
    fetchDeliveries();
    
    // Set up real-time subscription
    const deliverySubscription = supabase
      .channel('delivery-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'delivery_tracking'
      }, () => {
        fetchDeliveries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(deliverySubscription);
    };
  }, []);

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select(`
          *,
          order:orders (
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las entregas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('delivery_tracking')
        .update({ 
          status: newStatus,
          estimated_arrival_time: newStatus === 'on_route' 
            ? new Date(Date.now() + 30 * 60 * 1000).toISOString() 
            : null
        })
        .eq('id', deliveryId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `El estado de la entrega se actualizó a ${statusLabels[newStatus as keyof typeof statusLabels]}`,
      });

      fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la entrega",
        variant: "destructive"
      });
    }
  };

  const assignDeliveryPerson = async (deliveryId: string, name: string, phone: string) => {
    try {
      const { error } = await supabase
        .from('delivery_tracking')
        .update({ 
          delivery_person_name: name,
          delivery_person_phone: phone,
          status: 'assigned'
        })
        .eq('id', deliveryId);

      if (error) throw error;

      toast({
        title: "Repartidor asignado",
        description: `${name} ha sido asignado a esta entrega`,
      });

      fetchDeliveries();
    } catch (error) {
      console.error('Error assigning delivery person:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el repartidor",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel de Entregas</h1>
          <div className="text-sm text-muted-foreground">
            {deliveries.length} entregas en total
          </div>
        </div>

        {deliveries.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay entregas pendientes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Orden #{delivery.order_id.slice(-8)}
                    </CardTitle>
                    <Badge className={statusColors[delivery.status as keyof typeof statusColors]}>
                      {statusLabels[delivery.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{delivery.order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{delivery.order.customer_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{delivery.order.delivery_address}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium">
                        Total: {formatCurrency(delivery.order.total_amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {delivery.order.order_items.length} productos
                      </div>
                      {delivery.estimated_arrival_time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Estimado: {new Date(delivery.estimated_arrival_time).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Person Info */}
                  {delivery.delivery_person_name && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="font-medium">Repartidor asignado:</div>
                      <div className="text-sm">
                        {delivery.delivery_person_name} - {delivery.delivery_person_phone}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {delivery.status === 'assigned' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                        >
                          Marcar como Recogido
                        </Button>
                        {!delivery.delivery_person_name && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const name = prompt('Nombre del repartidor:');
                              const phone = prompt('Teléfono del repartidor:');
                              if (name && phone) {
                                assignDeliveryPerson(delivery.id, name, phone);
                              }
                            }}
                          >
                            Asignar Repartidor
                          </Button>
                        )}
                      </>
                    )}
                    
                    {delivery.status === 'picked_up' && (
                      <Button
                        size="sm"
                        onClick={() => updateDeliveryStatus(delivery.id, 'on_route')}
                      >
                        En Camino
                      </Button>
                    )}
                    
                    {delivery.status === 'on_route' && (
                      <Button
                        size="sm"
                        onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                      >
                        Marcar como Entregado
                      </Button>
                    )}
                    
                    {['assigned', 'picked_up', 'on_route'].includes(delivery.status) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateDeliveryStatus(delivery.id, 'cancelled')}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeliveryDashboard;