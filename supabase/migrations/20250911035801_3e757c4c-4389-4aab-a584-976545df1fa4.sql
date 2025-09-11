-- Primero, agregar al usuario admin actual al nuevo sistema de roles
INSERT INTO user_roles (user_id, role, created_by) 
VALUES ('50c9c070-0859-4602-a7b1-9e2e0f8087fb', 'admin', '50c9c070-0859-4602-a7b1-9e2e0f8087fb')
ON CONFLICT (user_id, role) DO NOTHING;

-- Crear función actualizada que use el nuevo sistema de roles
CREATE OR REPLACE FUNCTION public.is_current_user_admin_new()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- Actualizar las políticas RLS de user_profiles para usar la nueva función
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON public.user_profiles;
CREATE POLICY "Admins can manage all user profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_current_user_admin_new());

-- Actualizar las políticas RLS de user_roles para usar la nueva función  
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL  
TO authenticated
USING (public.is_current_user_admin_new());

-- Crear perfil en user_profiles para el usuario admin actual si no existe
INSERT INTO user_profiles (user_id, full_name, is_active)
SELECT '50c9c070-0859-4602-a7b1-9e2e0f8087fb', 'Joan (Admin)', true
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = '50c9c070-0859-4602-a7b1-9e2e0f8087fb'
);