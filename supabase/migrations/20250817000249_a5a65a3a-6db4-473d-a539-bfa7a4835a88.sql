-- Insert a test admin user profile (you'll need to create the auth user separately)
-- This is just to set up the profile structure for when an admin user is created

-- You can create an admin user by going to Authentication > Users in Supabase dashboard
-- Then insert their user_id into this profiles table with role 'admin'

-- Example of how to create an admin profile (replace with actual user_id after creating user in auth)
-- INSERT INTO public.profiles (user_id, full_name, role)
-- VALUES ('YOUR_USER_ID_HERE', 'Administrador PerrioStore', 'admin');

-- For now, let's add some sample data to test the system
INSERT INTO public.categories (name, description, image_url) VALUES
('Comida para Perros', 'Alimentos nutritivos para perros de todas las edades', 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400'),
('Comida para Gatos', 'Alimentos especializados para gatos', 'https://images.unsplash.com/photo-1573824221130-9d187b3666b8?w=400'),
('Juguetes', 'Juguetes divertidos para mascotas', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'),
('Accesorios', 'Collares, correas y otros accesorios', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400');

INSERT INTO public.products (name, description, price, stock, category_id, image_url, is_active) 
SELECT 
  'Alimento Premium Adulto',
  'Alimento completo y balanceado para perros adultos',
  65000,
  50,
  c.id,
  'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
  true
FROM public.categories c WHERE c.name = 'Comida para Perros'
LIMIT 1;

INSERT INTO public.products (name, description, price, stock, category_id, image_url, is_active)
SELECT 
  'Pelota Interactiva',
  'Pelota resistente para ejercicio y diversión',
  25000,
  30,
  c.id,
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  true
FROM public.categories c WHERE c.name = 'Juguetes'
LIMIT 1;