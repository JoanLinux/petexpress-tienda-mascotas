-- Crear un usuario admin inicial para el sistema
-- NOTA: Este usuario debe ser creado manualmente en el ambiente de producción

-- Función para inicializar admin (solo para desarrollo)
CREATE OR REPLACE FUNCTION public.initialize_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Verificar si ya existe un admin
  SELECT user_id INTO admin_user_id
  FROM public.user_roles
  WHERE role = 'admin'
  LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    RAISE NOTICE 'Ya existe un usuario administrador en el sistema';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Para crear un usuario administrador inicial:';
  RAISE NOTICE '1. Crea un usuario en la interfaz de autenticación de Supabase';
  RAISE NOTICE '2. Ejecuta: INSERT INTO user_profiles (user_id, full_name, is_active) VALUES (''[USER_ID]'', ''Administrador'', true);';
  RAISE NOTICE '3. Ejecuta: INSERT INTO user_roles (user_id, role) VALUES (''[USER_ID]'', ''admin'');';
END;
$$;

-- Ejecutar la función
SELECT public.initialize_admin_user();