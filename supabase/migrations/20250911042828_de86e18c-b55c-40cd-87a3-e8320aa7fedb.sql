-- Arreglar las políticas RLS para delivery_tracking
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admins can manage all delivery tracking" ON delivery_tracking;
DROP POLICY IF EXISTS "Customers can view tracking for their orders" ON delivery_tracking;
DROP POLICY IF EXISTS "Delivery persons can view and update their own deliveries" ON delivery_tracking;

-- Crear nuevas políticas que funcionen correctamente
CREATE POLICY "Anyone can create delivery tracking" ON delivery_tracking
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view delivery tracking" ON delivery_tracking
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage all delivery tracking" ON delivery_tracking
FOR ALL
USING (is_admin());

CREATE POLICY "System can update delivery tracking" ON delivery_tracking
FOR UPDATE
USING (true);