-- Crear tabla para el tracking de deliveries
CREATE TABLE public.delivery_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  delivery_person_id UUID REFERENCES profiles(user_id),
  delivery_person_name TEXT,
  delivery_person_phone TEXT,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  customer_latitude DECIMAL(10, 8),
  customer_longitude DECIMAL(11, 8),
  estimated_arrival_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'on_route', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Crear políticas para delivery tracking
CREATE POLICY "Admins can manage all delivery tracking" 
ON public.delivery_tracking 
FOR ALL 
USING (is_admin());

CREATE POLICY "Delivery persons can view and update their own deliveries" 
ON public.delivery_tracking 
FOR ALL 
USING (auth.uid() = delivery_person_id);

CREATE POLICY "Customers can view tracking for their orders" 
ON public.delivery_tracking 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = delivery_tracking.order_id 
  AND (orders.user_id = auth.uid() OR auth.uid() IS NULL)
));

-- Trigger para updated_at
CREATE TRIGGER update_delivery_tracking_updated_at
BEFORE UPDATE ON public.delivery_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para delivery tracking
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_tracking;