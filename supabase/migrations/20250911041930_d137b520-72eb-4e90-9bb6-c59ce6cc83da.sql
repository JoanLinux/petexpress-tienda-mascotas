-- Crear función para procesar órdenes de Stripe exitosas
CREATE OR REPLACE FUNCTION public.create_stripe_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_delivery_address text,
  p_total_amount numeric,
  p_order_type text,
  p_notes text,
  p_user_id uuid,
  p_stripe_session_id text,
  p_items jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id uuid;
  item_record jsonb;
BEGIN
  -- Crear la orden
  INSERT INTO orders (
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    total_amount,
    status,
    payment_status,
    order_type,
    notes,
    user_id
  ) VALUES (
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_delivery_address,
    p_total_amount,
    'confirmed', -- Estado confirmado para pagos de Stripe
    'paid', -- Pago completado
    p_order_type,
    p_notes,
    p_user_id
  ) RETURNING id INTO new_order_id;

  -- Crear los items de la orden
  FOR item_record IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      product_price,
      quantity,
      subtotal
    ) VALUES (
      new_order_id,
      (item_record->>'id')::uuid,
      item_record->>'name',
      (item_record->>'price')::numeric,
      (item_record->>'quantity')::integer,
      (item_record->>'price')::numeric * (item_record->>'quantity')::integer
    );
  END LOOP;

  RETURN new_order_id;
END;
$$;