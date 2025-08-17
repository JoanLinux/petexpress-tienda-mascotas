-- CRITICAL SECURITY FIXES

-- 1. Fix product_views access - remove public access, add admin-only policy
DROP POLICY IF EXISTS "Anyone can view product views for analytics" ON product_views;

CREATE POLICY "Admins can view product views for analytics" ON product_views
FOR SELECT 
USING (is_admin());

-- 2. Fix privilege escalation in profiles - prevent users from changing their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can update their own basic profile" ON profiles
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND role = (SELECT role FROM profiles WHERE user_id = auth.uid())
);

-- Add admin-only policy for role changes
CREATE POLICY "Admins can update any profile" ON profiles
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- 3. Fix database function security vulnerabilities
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$function$;

-- 4. Add role change audit log table
CREATE TABLE IF NOT EXISTS public.role_change_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id uuid NOT NULL,
  changed_by_user_id uuid NOT NULL,
  old_role text,
  new_role text,
  changed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.role_change_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role changes" ON role_change_log
FOR SELECT 
USING (is_admin());

-- 5. Create function to safely change user roles with logging
CREATE OR REPLACE FUNCTION public.change_user_role(
  target_user_id uuid,
  new_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  old_role text;
BEGIN
  -- Only admins can change roles
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  
  -- Get current role
  SELECT role INTO old_role FROM profiles WHERE user_id = target_user_id;
  
  -- Update role
  UPDATE profiles SET role = new_role WHERE user_id = target_user_id;
  
  -- Log the change
  INSERT INTO role_change_log (target_user_id, changed_by_user_id, old_role, new_role)
  VALUES (target_user_id, auth.uid(), old_role, new_role);
END;
$function$;