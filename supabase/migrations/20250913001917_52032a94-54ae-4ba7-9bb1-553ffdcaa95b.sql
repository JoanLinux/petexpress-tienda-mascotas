-- Fix security vulnerability: Remove public access to orders with sensitive customer data
-- Drop the existing problematic policy that allows public access to guest orders
DROP POLICY IF EXISTS "Users can view their own orders or guest orders" ON public.orders;

-- Create a secure policy that only allows:
-- 1. Authenticated users to view their own orders
-- 2. Admins to view all orders
-- 3. NO public access to any orders, including guest orders
CREATE POLICY "Secure order access - users and admins only" 
ON public.orders 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR is_admin()
);

-- For guest orders, we'll need to implement a different access mechanism
-- such as order confirmation codes or session-based access in the application layer
-- This ensures no sensitive customer data is publicly accessible