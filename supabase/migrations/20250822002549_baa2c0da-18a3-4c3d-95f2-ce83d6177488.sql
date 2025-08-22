-- Clear old promotions and add real Casa Beatricita promotions
DELETE FROM promotions;

-- Insert realistic Mexican restaurant promotions
INSERT INTO promotions (title, description, discount_percentage, start_date, end_date, is_active, category_ids) VALUES
('Especial Enchiladas en Nogada', 'Celebra la temporada con nuestras famosas Enchiladas en Nogada - 15% de descuento en toda la categoría de Especialidades', 15, '2025-08-15'::timestamp, '2025-09-30'::timestamp, true, (SELECT ARRAY[id] FROM categories WHERE name = 'Especialidades')),
('2x1 en Bebidas Artesanales', 'Lleva 2 bebidas tradicionales por el precio de 1 - Válido en aguas frescas, tepache y bebidas sin alcohol', 50, '2025-08-20'::timestamp, '2025-12-31'::timestamp, true, (SELECT ARRAY[id] FROM categories WHERE name = 'Bebidas')),
('Happy Hour Tequilas', 'De 5 PM a 7 PM - 20% de descuento en toda nuestra selección de tequilas y mezcales premium', 20, '2025-08-22'::timestamp, '2025-12-31'::timestamp, true, (SELECT ARRAY[id] FROM categories WHERE name = 'Tequilas y Mezcal'));