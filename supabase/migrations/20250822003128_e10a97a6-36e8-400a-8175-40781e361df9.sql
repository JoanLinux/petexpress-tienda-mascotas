-- Update all product images with the new professional food photography

-- Especialidades
UPDATE products SET image_url = '/src/assets/products/bistec-asado.jpg' WHERE name = 'Bistec Asado';
UPDATE products SET image_url = '/src/assets/products/tampiquena.jpg' WHERE name = 'Tampiqueña';
UPDATE products SET image_url = '/src/assets/products/pollo-mole-verde.jpg' WHERE name = 'Pierna/Muslo en mole verde o poblano';
UPDATE products SET image_url = '/src/assets/products/pechuga-mole-poblano.jpg' WHERE name = 'Pechuga en mole verde o poblano';
UPDATE products SET image_url = '/src/assets/products/barbacoa-res.jpg' WHERE name = 'Barbacoa de Res';
UPDATE products SET image_url = '/src/assets/products/carnitas-casa.jpg' WHERE name = 'Carnitas de la casa (300 gr)';
UPDATE products SET image_url = '/src/assets/products/cecina-natural.jpg' WHERE name = 'Cecina Natural';
UPDATE products SET image_url = '/src/assets/products/ensalada-nopales.jpg' WHERE name = 'Ensalada de Nopales';
UPDATE products SET image_url = '/src/assets/products/plato-botanero.jpg' WHERE name = 'Plato Botanero';
UPDATE products SET image_url = '/src/assets/products/arroz-mexicano.jpg' WHERE name LIKE 'Arroz%';

-- Chilaquiles
UPDATE products SET image_url = '/src/assets/products/chilaquiles-tradicionales.jpg' WHERE name = 'Chilaquiles Tradicionales';

-- Bebidas sin alcohol
UPDATE products SET image_url = '/src/assets/products/agua-jamaica.jpg' WHERE name = 'Agua de Jamaica (400ml)';
UPDATE products SET image_url = '/src/assets/products/agua-horchata.jpg' WHERE name = 'Agua de Horchata (400ml)';
UPDATE products SET image_url = '/src/assets/products/cafe-olla.jpg' WHERE name LIKE '%Café%' OR name LIKE '%de olla%';
UPDATE products SET image_url = '/src/assets/products/jugo-naranja.jpg' WHERE name LIKE '%Jugo de Naranja%';
UPDATE products SET image_url = '/src/assets/products/tepache.jpg' WHERE name = 'Tepache (500 ml)';
UPDATE products SET image_url = '/src/assets/products/limonada.jpg' WHERE name = 'Limonada Mineral o Natural';

-- Bebidas con alcohol
UPDATE products SET image_url = '/src/assets/products/cerveza.jpg' WHERE name LIKE '%Cerveza%';
UPDATE products SET image_url = '/src/assets/products/margarita.jpg' WHERE name = 'Margarita';
UPDATE products SET image_url = '/src/assets/products/mezcalita.jpg' WHERE name = 'Mezcalita';
UPDATE products SET image_url = '/src/assets/products/paloma.jpg' WHERE name = 'Paloma';
UPDATE products SET image_url = '/src/assets/products/mojito.jpg' WHERE name = 'Mojito';
UPDATE products SET image_url = '/src/assets/products/cantarito.jpg' WHERE name = 'Cantarito';
UPDATE products SET image_url = '/src/assets/products/sangria.jpg' WHERE name = 'Sangría';

-- Tequilas y Mezcal
UPDATE products SET image_url = '/src/assets/products/tequila-blanco.jpg' WHERE name = 'Tequila Blanco 2x1';
UPDATE products SET image_url = '/src/assets/products/mezcal.jpg' WHERE name = 'Mezcal 2x1';