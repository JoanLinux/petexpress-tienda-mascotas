-- Clear existing data and add Mexican food categories and products
DELETE FROM products;
DELETE FROM categories;

-- Insert Mexican food categories
INSERT INTO categories (id, name, description, image_url) VALUES
(gen_random_uuid(), 'Especialidades', 'Nuestros platillos más tradicionales y populares', '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
(gen_random_uuid(), 'Chilaquiles', 'Deliciosos chilaquiles con diferentes preparaciones', '/lovable-uploads/d1f703d4-7546-4d71-b50a-d04d17d5f574.png'),
(gen_random_uuid(), 'Bebidas', 'Aguas frescas, café y bebidas tradicionales', '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
(gen_random_uuid(), 'Bebidas con Alcohol', 'Cervezas, cocktails y bebidas con alcohol', '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
(gen_random_uuid(), 'Tequilas y Mezcal', 'Nuestra selección de tequilas y mezcales premium', '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png');

-- Get category IDs for products
DO $$
DECLARE
    especialidades_id uuid;
    chilaquiles_id uuid;
    bebidas_id uuid;
    alcohol_id uuid;
    tequila_id uuid;
BEGIN
    SELECT id INTO especialidades_id FROM categories WHERE name = 'Especialidades';
    SELECT id INTO chilaquiles_id FROM categories WHERE name = 'Chilaquiles';
    SELECT id INTO bebidas_id FROM categories WHERE name = 'Bebidas';
    SELECT id INTO alcohol_id FROM categories WHERE name = 'Bebidas con Alcohol';
    SELECT id INTO tequila_id FROM categories WHERE name = 'Tequilas y Mezcal';

    -- Insert Especialidades products
    INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
    ('Bistec Asado', 'Acompañado de frijoles, ensalada de lechuga y jitomate.', 200, especialidades_id, 50, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Tampiqueña', 'Acompañada de una doblada de mole, arroz, guacamole y frijoles refritos.', 260, especialidades_id, 30, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Pierna/Muslo en mole verde o poblano', 'Acompañado de arroz y frijoles.', 240, especialidades_id, 40, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Pechuga en mole verde o poblano', 'Acompañado de arroz y frijoles.', 265, especialidades_id, 35, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Barbacoa de Res', 'Acompañada de arroz, frijoles y guacamole.', 275, especialidades_id, 25, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Carnitas de la casa (300 gr)', 'Acompañadas de frijoles, chicharrón seco y guacamole.', 275, especialidades_id, 30, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Cecina Natural', 'Acompañada de frijoles y nopales.', 250, especialidades_id, 20, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Ensalada de Nopales', 'Fresca ensalada de nopales con verduras.', 110, especialidades_id, 50, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Plato Botanero', '3 sopes con chorizo, 3 taquitos de bistec y 3 quesadillitas de queso.', 265, especialidades_id, 15, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Arroz Solo', 'Porción de arroz mexicano.', 70, especialidades_id, 100, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Arroz con un huevo', 'Arroz mexicano con huevo frito.', 78, especialidades_id, 80, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Arroz con dos huevos', 'Arroz mexicano con dos huevos fritos.', 85, especialidades_id, 80, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png'),
    ('Arroz con mole', 'Arroz mexicano bañado en mole.', 97, especialidades_id, 60, '/lovable-uploads/09577fbe-e48b-4d7d-bdd6-82bf66fdafc4.png');

    -- Insert Chilaquiles products
    INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
    ('Chilaquiles Tradicionales', 'También es opción de Desayuno. Tortilla dorada bañada en salsa.', 0, chilaquiles_id, 50, '/lovable-uploads/d1f703d4-7546-4d71-b50a-d04d17d5f574.png');

    -- Insert Bebidas products
    INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
    ('Agua de Jamaica (400ml)', 'Refrescante agua de jamaica natural.', 55, bebidas_id, 100, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Agua de Horchata (400ml)', 'Tradicional agua de horchata.', 55, bebidas_id, 100, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Agua Embotellada (500 ml)', 'Agua purificada embotellada.', 50, bebidas_id, 200, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Té (250 ml)', 'Té caliente tradicional.', 45, bebidas_id, 80, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Café Americano / Capuccino', 'Café recién preparado.', 60, bebidas_id, 150, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Café con Leche / de olla', 'Café tradicional mexicano.', 60, bebidas_id, 120, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Jugo de Naranja Chico (250 ml)', 'Jugo de naranja natural.', 60, bebidas_id, 80, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Jugo de Naranja Grande (500 ml)', 'Jugo de naranja natural grande.', 75, bebidas_id, 60, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Tepache (500 ml)', 'Bebida fermentada tradicional.', 68, bebidas_id, 40, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Refresco de Lata (355 ml)', 'Refrescos variados en lata.', 60, bebidas_id, 200, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Limonada Mineral o Natural', 'Limonada refrescante.', 75, bebidas_id, 100, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Naranjada Mineral o Natural', 'Naranjada natural.', 75, bebidas_id, 80, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Suero (Mineral con Limón y Sal)', 'Bebida rehidratante.', 90, bebidas_id, 60, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Clamato Preparado', 'Clamato con especias.', 95, bebidas_id, 50, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Topo Chico (Agua Mineral)', 'Agua mineral natural.', 65, bebidas_id, 120, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png');

    -- Insert Con Alcohol products
    INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
    ('Cerveza (355 ml)', 'Cerveza fría nacional.', 75, alcohol_id, 100, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Cerveza Stella Artois', 'Cerveza premium importada.', 95, alcohol_id, 50, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Cerveza Con Clamato', 'Cerveza preparada con clamato.', 98, alcohol_id, 60, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Margarita', 'Cocktail clásico con tequila.', 180, alcohol_id, 30, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Mezcalita', 'Cocktail con mezcal artesanal.', 180, alcohol_id, 25, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Paloma', 'Cocktail refrescante con tequila.', 150, alcohol_id, 40, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Mojito', 'Cocktail cubano con menta.', 180, alcohol_id, 35, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Cantarito', 'Bebida tradicional mexicana.', 150, alcohol_id, 30, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Sangría', 'Sangría de vino con frutas.', 185, alcohol_id, 20, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png');

    -- Insert Tequilas y Mezcal products
    INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
    ('Tequila Blanco 2x1', 'Dos caballitos de tequila blanco.', 0, tequila_id, 50, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png'),
    ('Mezcal 2x1', 'Dos caballitos de mezcal artesanal.', 0, tequila_id, 30, '/lovable-uploads/ce29d375-e5b3-4ae8-abbd-19fe921d2a35.png');

END $$;