-- Arreglar las políticas RLS para la tabla orders
-- Primero eliminar las políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;

-- Crear políticas RLS mejoradas que permitan órdenes de invitados
CREATE POLICY "Anyone can create orders" ON orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own orders or guest orders" ON orders
FOR SELECT
USING (
  -- Los usuarios pueden ver sus propias órdenes
  (auth.uid() = user_id) 
  OR 
  -- Los admins pueden ver todas
  is_admin()
  OR
  -- Órdenes de invitados (sin user_id) pueden ser vistas por cualquiera temporalmente
  (user_id IS NULL)
);

-- Crear política para que solo admins puedan actualizar órdenes
CREATE POLICY "Admins can update orders" ON orders
FOR UPDATE
USING (is_admin());