-- Add all menu products with their respective categories and prices
INSERT INTO public.products (name, description, price, category_id, stock) VALUES 
-- DESAYUNOS
('Huevos al Gusto', 'Huevos estrellados, revueltos o a la mexicana (guarnición de frijoles y chilaquiles)', 150, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos a la Mexicana', 'Revueltos con jitomate, cebolla y chile (guarnición de frijoles y chilaquiles)', 150, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos Divorciados', '2 piezas de huevo estrellados, uno bañado con salsa verde y otro en salsa roja (montados en tortilla frita)', 150, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Omelette Espinaca y Queso', 'Omelette relleno de espinaca y queso', 170, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Omelette de Jamón y Queso', 'Omelette relleno de jamón y queso (guarnición de frijoles y chilaquiles)', 170, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Omelette Queso y Champiñones', 'Omelette relleno de queso, champiñones y queso Oaxaca (guarnición de frijoles)', 170, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos Tirados', 'Revueltos con frijoles (guarnición de frijoles y quesadilla)', 185, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos Toluqueños', 'Revueltos con chorizo, bañados en salsa roja (guarnición de frijoles)', 160, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos Norteños', 'Revueltos con carne deshebrada, bañados en salsa roja (guarnición de frijoles)', 185, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos Rancheros', 'Estrellados, bañados en salsa ranchera (guarnición de frijoles)', 150, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos Albañil', 'Revueltos, bañados en salsa roja (guarnición de frijoles)', 165, '93061733-3a6e-4807-8443-ad3328c942f9', 50),

-- ENCHILADAS
('Enchiladas Verdes o Rojas', 'Rellenas de pollo (guarnición de frijoles refritos)', 195, 'ed92716d-0cdc-4a2f-9d39-f29d623bcf4a', 50),
('Enchiladas de Mole Poblano', 'Rellenas de pollo (guarnición de arroz y frijoles refritos)', 220, 'ed92716d-0cdc-4a2f-9d39-f29d623bcf4a', 50),
('Enchiladas de Mole Verde', 'Rellenas de pollo (guarnición de arroz y frijoles refritos)', 220, 'ed92716d-0cdc-4a2f-9d39-f29d623bcf4a', 50),
('Enmoladas', 'Rellenas de pollo (guarnición de arroz)', 195, 'ed92716d-0cdc-4a2f-9d39-f29d623bcf4a', 50),

-- POZOLE
('Pozole Blanco, Rojo o Verde', 'De cerdo, pollo o surtido. Incluye: tostadas (3 piezas), crema y queso rallado', 190, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Pozole Extra Crema', 'Crema (30 gr)', 30, '94fa76f8-6831-433b-beb5-2df2b619de06', 100),
('Pozole Extra Queso', 'Queso (30 gr)', 30, '94fa76f8-6831-433b-beb5-2df2b619de06', 100),
('Pozole Extra Aguacate', 'Aguacate', 50, '94fa76f8-6831-433b-beb5-2df2b619de06', 100),
('Pollo Tlalpeño', 'Incluye: una pieza de pollo (pechuga desmenuazada, pierna o muslo) acompañado de verdura, arroz, aguacate y tiritas de tortilla frita', 187, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Consomé Solo Chico', 'Solo con arroz y garbanzos (250 ml)', 75, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Consomé Preparado Grande', 'Con pechuga deshebrada, aguacate, garbanzo, arroz y queso Oaxaca (500 ml). Se puede dividir para 2 personas como máximo', 173, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Tostadas de Pozole', '1 pieza - Pata / Pollo / Tinga de Pollo / Tinga de Res con frijoles, queso, crema y lechuga', 80, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Tostada de Lomo', 'Chorizo / papa, relleno de lechuga, queso y crema', 75, '94fa76f8-6831-433b-beb5-2df2b619de06', 50);