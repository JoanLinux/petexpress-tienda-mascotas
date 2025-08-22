-- Add all menu products with their respective categories and prices
-- DESAYUNOS
INSERT INTO public.products (name, description, price, category_id, stock) VALUES 
-- Huevos section
('Huevos al Gusto', 'Huevos estrellados, revueltos o a la mexicana (guarnición de frijoles y chilaquiles)', 150, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos a la Mexicana', 'Revueltos con jitomate, cebolla y chile (guarnición de frijoles y chilaquiles)', 150, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Huevos Divorciados', '2 piezas de huevo estrellados, uno bañado con salsa verde y otro en salsa roja (montados en tortilla frita)', 150, '93061733-3a6e-4807-8443-ad3328c942f9', 50),

-- Omelettes section  
('Omelette Espinaca y Queso', 'Omelette relleno de espinaca y queso', 170, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Omelette de Jamón y Queso', 'Omelette relleno de jamón y queso (guarnición de frijoles y chilaquiles)', 170, '93061733-3a6e-4807-8443-ad3328c942f9', 50),
('Omelette Queso y Champiñones', 'Omelette relleno de queso, champiñones y queso Oaxaca (guarnición de frijoles)', 170, '93061733-3a6e-4807-8443-ad3328c942f9', 50),

-- Huevos Especiales
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
('Pozole Pollo Tlalpeño', 'Incluye: una pieza de pollo (pechuga desmenuazada, pierna o muslo) acompañado de verdura, arroz, aguacate y tiritas de tortilla frita', 187, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Consomé Solo Chico', 'Solo con arroz y garbanzos (250 ml)', 75, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Consomé Preparado Grande', 'Con pechuga deshebrada, aguacate, garbanzo, arroz y queso Oaxaca (500 ml). Se puede dividir para 2 personas como máximo', 173, '94fa76f8-6831433b-beb5-2df2b619de06', 50),
('Tostadas de Pozole', '1 pieza - Pata / Pollo / Tinga de Pollo / Tinga de Res con frijoles, queso, crema y lechuga', 80, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),
('Tostada de Lomo', 'Chorizo / papa, relleno de lechuga, queso y crema', 75, '94fa76f8-6831-433b-beb5-2df2b619de06', 50),

-- TACOS DE GUISADO
('Taco de Chicharrón Seco', 'Precio por taco', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Chicharrón Guisado', 'Chicharrón guisado en salsa verde, nopales con queso', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Tinga de Pollo o Res', 'Rajas con crema y queso', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Pollo con Guacamole', 'Mole verde con pollo', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Mole Poblano con Pollo', 'Chorizo con papa', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Chorizo Solo', 'Acompañado de guacamole', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Carnitas de Res', 'Con chicharrón seco y guacamole', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Barbacoa de Res Consomé', 'Barbacoa de res consomé', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Tacos Combinados', 'Dos ingredientes', 82, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Especial Beatricita', 'Taco semiblado de pollo con frijoles, bañado en mole poblano', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),

-- TACOS A LA PARRILLA  
('Taco de Pastor', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Bistec', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Chorizo', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Suadero', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Cecina', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Campechano', 'Suadero o bistec con longaniza', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),

-- FLAUTAS
('Flautas de Pollo, Carne, Papa', '3 piezas con queso, crema, lechuga y jitomate', 165, 'cae50083-9275-46a7-ab62-458957dcc9d0', 50),
('Flautas Ahogadas', '3 piezas verdes o rojas', 178, 'cae50083-9275-46a7-ab62-458957dcc9d0', 50),
('Quesadilla', '1 pieza de queso Oaxaca (100 gr)', 70, 'cae50083-9275-46a7-ab62-458957dcc9d0', 100),

-- POSTRES
('Flan', 'Vainilla o cajeta', 75, '8ccd7b5e-9493-47bc-95c3-7774a8ade07e', 50),
('Pastel', 'Tres o fresa', 75, '8ccd7b5e-9493-47bc-95c3-7774a8ade07e', 50)

ON CONFLICT (name) DO NOTHING;