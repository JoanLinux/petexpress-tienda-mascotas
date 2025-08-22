-- Update category images with proper food photography
UPDATE categories SET 
  image_url = '/src/assets/categories/especialidades.jpg'
WHERE name = 'Especialidades';

UPDATE categories SET 
  image_url = '/src/assets/categories/chilaquiles.jpg'
WHERE name = 'Chilaquiles';

UPDATE categories SET 
  image_url = '/src/assets/categories/bebidas.jpg'
WHERE name = 'Bebidas';

UPDATE categories SET 
  image_url = '/src/assets/categories/bebidas-alcohol.jpg'
WHERE name = 'Bebidas con Alcohol';

UPDATE categories SET 
  image_url = '/src/assets/categories/tequilas-mezcal.jpg'
WHERE name = 'Tequilas y Mezcal';