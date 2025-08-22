-- Add remaining menu products
INSERT INTO public.products (name, description, price, category_id, stock) VALUES 
-- TACOS DE GUISADO
('Taco de Chicharrón Seco', 'Precio por taco', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Chicharrón Guisado', 'Chicharrón guisado en salsa verde, nopales con queso', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Tinga de Pollo o Res', 'Rajas con crema y queso', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Pollo con Guacamole', 'Mole verde con pollo', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Mole Poblano con Pollo', 'Chorizo con papa', 70, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Taco de Chorizo Solo', 'Acompañado de guacamole', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Carnitas de Res Guisado', 'Con chicharrón seco y guacamole', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Barbacoa de Res Consomé', 'Barbacoa de res consomé', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Tacos Combinados', 'Dos ingredientes', 82, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),
('Especial Beatricita', 'Taco semiblado de pollo con frijoles, bañado en mole poblano', 75, '49773792-4d74-4ee4-af2f-5c7236385c20', 100),

-- TACOS A LA PARRILLA  
('Taco de Pastor', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Bistec a la Parrilla', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Chorizo a la Parrilla', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Suadero', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Cecina a la Parrilla', 'Precio por taco', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),
('Taco de Campechano', 'Suadero o bistec con longaniza', 75, 'f4c53eb2-c623-4d95-a9eb-403f0bdf6af0', 100),

-- FLAUTAS
('Flautas de Pollo, Carne, Papa', '3 piezas con queso, crema, lechuga y jitomate', 165, 'cae50083-9275-46a7-ab62-458957dcc9d0', 50),
('Flautas Ahogadas', '3 piezas verdes o rojas', 178, 'cae50083-9275-46a7-ab62-458957dcc9d0', 50),
('Quesadilla Grande', '1 pieza de queso Oaxaca (100 gr)', 70, 'cae50083-9275-46a7-ab62-458957dcc9d0', 100),

-- POSTRES
('Flan', 'Vainilla o cajeta', 75, '8ccd7b5e-9493-47bc-95c3-7774a8ade07e', 50),
('Pastel', 'Tres leches o fresa', 75, '8ccd7b5e-9493-47bc-95c3-7774a8ade07e', 50);