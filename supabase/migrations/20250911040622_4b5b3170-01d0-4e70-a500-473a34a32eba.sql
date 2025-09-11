-- Agregar campo email a la tabla user_profiles
ALTER TABLE public.user_profiles ADD COLUMN email text;

-- Actualizar los registros existentes con emails reales desde auth.users
-- Crear función para obtener emails de forma segura
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'auth', 'public'
AS $$
  SELECT email FROM auth.users WHERE id = user_uuid;
$$;

-- Actualizar los emails existentes
UPDATE public.user_profiles 
SET email = public.get_user_email(user_id)
WHERE email IS NULL;