import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, Check, X, ChefHat, Truck } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  total_amount: number;
  status: string;
  order_type: string;
  notes: string;
  created_at: string;
  estimated_delivery_time: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  special_instructions: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800', 
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
};

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for orders
    const ordersSubscription = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_price,
            quantity,
            subtotal,
            special_instructions
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los pedidos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    
    try {
      const updateData: any = { status: newStatus };
      
      // Set estimated delivery time when status changes to preparing
      if (newStatus === 'preparing') {
        const estimatedTime = new Date();
        estimatedTime.setMinutes(estimatedTime.getMinutes() + 30); // 30 minutes from now
        updateData.estimated_delivery_time = estimatedTime.toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `Pedido marcado como ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
      });

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del pedido.",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <ChefHat className="h-4 w-4" />;
      case 'ready':
        return <Check className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
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
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Pedidos</h2>
          <p className="text-muted-foreground">
            Administra el flujo de pedidos de la cocina
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay pedidos en este momento</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className={`border-l-4 ${
                order.status === 'pending' ? 'border-l-yellow-500' :
                order.status === 'confirmed' ? 'border-l-blue-500' :
                order.status === 'preparing' ? 'border-l-orange-500' :
                order.status === 'ready' ? 'border-l-green-500' :
                order.status === 'delivered' ? 'border-l-gray-500' : 'border-l-red-500'
              }`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Pedido #{order.id.slice(0, 8)}
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {statusLabels[order.status as keyof typeof statusLabels]}
                          </div>
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(order.total_amount)}</p>
                      <Badge variant="outline">
                        {order.order_type === 'delivery' ? 'Delivery' : 'Recoger'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Cliente</h4>
                      <p className="text-sm">{order.customer_name}</p>
                      {order.customer_phone && (
                        <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                      )}
                      {order.customer_email && (
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      )}
                    </div>
                    {order.delivery_address && (
                      <div>
                        <h4 className="font-semibold mb-2">Dirección de Entrega</h4>
                        <p className="text-sm">{order.delivery_address}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Productos</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <div>
                            <span className="font-medium">{item.quantity}x {item.product_name}</span>
                            {item.special_instructions && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Instrucciones: {item.special_instructions}
                              </p>
                            )}
                          </div>
                          <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notas del Pedido</h4>
                      <p className="text-sm bg-muted p-2 rounded">{order.notes}</p>
                    </div>
                  )}

                  {order.estimated_delivery_time && order.status === 'preparing' && (
                    <div>
                      <h4 className="font-semibold mb-2">Tiempo Estimado</h4>
                      <p className="text-sm">{formatTime(order.estimated_delivery_time)}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <>
                        {getNextStatus(order.status) && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                            disabled={updatingStatus === order.id}
                            size="sm"
                          >
                            {updatingStatus === order.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            {order.status === 'pending' && 'Confirmar'}
                            {order.status === 'confirmed' && 'Iniciar Preparación'}
                            {order.status === 'preparing' && 'Marcar Listo'}
                            {order.status === 'ready' && 'Marcar Entregado'}
                          </Button>
                        )}
                        
                        {order.status === 'pending' && (
                          <Button
                            variant="destructive"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            disabled={updatingStatus === order.id}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        )}
                      </>
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

export default Orders;