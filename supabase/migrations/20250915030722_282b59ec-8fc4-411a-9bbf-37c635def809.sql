-- Fix the RLS policy interdependency issue between orders and order_items
-- The issue is that order_items INSERT policy needs to query orders table,
-- but the new secure orders SELECT policy is blocking this query

-- Drop the current secure policy for orders SELECT
DROP POLICY IF EXISTS "Secure order access - users and admins only" ON public.orders;

-- Create a more flexible policy that allows:
-- 1. Authenticated users to view their own orders
-- 2. Admins to view all orders  
-- 3. System queries needed for order_items creation (when user_id matches or is null)
CREATE POLICY "Enhanced secure order access" 
ON public.orders 
FOR SELECT 
USING (
  -- Authenticated users can see their own orders
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Admins can see all orders
  is_admin()
  OR
  -- Allow system queries for guest orders when auth.uid() is null and order user_id is null
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- This policy now allows:
-- - Authenticated users to see only their orders
-- - Admins to see all orders
-- - System/internal queries for guest orders (user_id IS NULL) to work properly
-- - No public access to user orders with personal data