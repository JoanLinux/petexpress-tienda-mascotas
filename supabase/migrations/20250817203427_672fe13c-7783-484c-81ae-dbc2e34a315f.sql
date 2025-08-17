-- Insertar productos de la categoría HIGIENE
INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
('Champú Avena y Aloe Premium', 'Fórmula suave con avena coloidal y aloe vera, ideal para pieles sensibles, aroma relajante', 16.99, '46405709-b579-444c-8905-601fb23f4537', 45, '/src/assets/products/champu-avena-aloe.webp'),
('Kit Dental Completo', 'Set con cepillo dental, cepillo de dedo y pasta dentífrica sabor menta, higiene oral completa', 21.99, '46405709-b579-444c-8905-601fb23f4537', 38, '/src/assets/products/kit-dental-perro.webp'),
('Cortauñas Profesional', 'Tijeras de acero inoxidable con protector de seguridad, mango ergonómico antideslizante', 12.99, '46405709-b579-444c-8905-601fb23f4537', 60, '/src/assets/products/cortaunas.webp'),
('Limpiador de Oídos Suave', 'Solución limpiadora con aplicador de punta suave, fórmula no irritante, líquido azul transparente', 9.99, '46405709-b579-444c-8905-601fb23f4537', 75, '/src/assets/products/limpiador-oidos.webp'),
('Set de Cepillos de Peluquería', 'Kit profesional con cepillo slicker y cepillo de púas, mangos azules ergonómicos', 18.99, '46405709-b579-444c-8905-601fb23f4537', 50, '/src/assets/products/cepillos-peluqueria.webp'),
('Desodorizante Lavanda', 'Spray desodorante con aroma a lavanda, neutraliza olores, botella con atomizador púrpura', 11.99, '46405709-b579-444c-8905-601fb23f4537', 65, '/src/assets/products/desodorizante.webp'),
('Toallitas Húmedas Hipoalergénicas', 'Paquete de toallas húmedas libres de alcohol, fórmula suave, paquete verde resellable', 7.99, '46405709-b579-444c-8905-601fb23f4537', 85, '/src/assets/products/toallitas-humedas.webp'),
('Champú en Seco Sin Enjuague', 'Fórmula en espuma para limpieza rápida sin agua, extractos naturales, botella aerosol', 14.99, '46405709-b579-444c-8905-601fb23f4537', 42, '/src/assets/products/champu-avena-aloe.webp'),
('Acondicionador Desenredante', 'Tratamiento suavizante con aceites naturales, facilita el cepillado, aroma fresco', 13.99, '46405709-b579-444c-8905-601fb23f4537', 40, '/src/assets/products/champu-avena-aloe.webp'),
('Gel Dental Enzimático', 'Pasta dental con enzimas naturales, combate placa y sarro, sabor pollo atractivo', 15.99, '46405709-b579-444c-8905-601fb23f4537', 52, '/src/assets/products/kit-dental-perro.webp'),
('Lima de Uñas Doble', 'Lima profesional de doble grano, superficie rugosa y suave, mango antideslizante', 8.99, '46405709-b579-444c-8905-601fb23f4537', 68, '/src/assets/products/cortaunas.webp'),
('Limpiador Ocular Estéril', 'Solución oftálmica para limpieza de ojos, reduce lagañas, envase gotero estéril', 10.99, '46405709-b579-444c-8905-601fb23f4537', 48, '/src/assets/products/limpiador-oidos.webp'),
('Guante de Baño Exfoliante', 'Guante de silicona con textura masajeadora, estimula circulación, fácil de limpiar', 12.99, '46405709-b579-444c-8905-601fb23f4537', 35, '/src/assets/products/cepillos-peluqueria.webp'),
('Perfume para Mascotas', 'Fragancia suave y duradera, fórmula libre de alcohol, aroma floral delicado', 16.99, '46405709-b579-444c-8905-601fb23f4537', 30, '/src/assets/products/desodorizante.webp'),
('Pañales Lavables Ecológicos', 'Set de 3 pañales reutilizables, tela absorbente, velcro ajustable, diversos tamaños', 24.99, '46405709-b579-444c-8905-601fb23f4537', 25, '/src/assets/products/toallitas-humedas.webp');

-- Insertar productos de la categoría JUGUETES
INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
('Juguete Puzzle Interactivo', 'Rompecabezas dispensador de premios azul y amarillo, estimula la mente, plástico resistente', 26.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 35, '/src/assets/products/juguete-puzzle.webp'),
('Cuerda Trenzada Multicolor', 'Juguete de cuerda de algodón grueso con nudos, colores vibrantes, resistente a tirones', 14.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 60, '/src/assets/products/juguete-cuerda.webp'),
('Pelota Chillona Naranja', 'Pelota de goma con sonido atractivo, superficie texturizada para mejor agarre, color brillante', 8.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 80, '/src/assets/products/pelota-chillon.webp'),
('Ratón con Catnip', 'Ratoncito de tela gris con orejas rosas, relleno de hierba gatera orgánica, tamaño realista', 5.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 90, '/src/assets/products/raton-catnip.webp'),
('Láser Interactivo Automático', 'Puntero láser con patrones de movimiento automático, batería recargable, funciones de seguridad', 19.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 28, '/src/assets/products/laser-interactivo.webp'),
('Varita con Plumas', 'Juguete interactivo con plumas coloridas en vara extensible, estimula instinto cazador', 12.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 45, '/src/assets/products/varita-plumas.webp'),
('Kong Clásico Rojo', 'Juguete de goma natural ultra resistente, dispensador de premios, rebote impredecible', 16.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 50, '/src/assets/products/kong-clasico.webp'),
('Pelota de Tenis con Sonido', 'Pelota de tenis amarilla con squeaker interno, fieltro duradero, perfecta para fetch', 7.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 75, '/src/assets/products/pelota-chillon.webp'),
('Frisbee Flotante', 'Disco volador de goma flexible, flota en agua, bordes suaves para dientes, colores vivos', 11.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 40, '/src/assets/products/juguete-puzzle.webp'),
('Túneles para Gatos', 'Túnel plegable con crujidos internos, múltiples entradas, estimula exploración felina', 18.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 32, '/src/assets/products/juguete-cuerda.webp'),
('Hueso de Nylon Duradero', 'Hueso masticable de nylon con sabor a bacon, limpia dientes, resistente a masticadores fuertes', 13.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 55, '/src/assets/products/kong-clasico.webp'),
('Dispensador de Premios Giratorio', 'Juguete que gira y dispensa snacks, ajustable según dificultad, mantiene entretenido', 22.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 25, '/src/assets/products/juguete-puzzle.webp'),
('Peluche con Heartbeat', 'Muñeco suave con latido simulado, tranquiliza cachorros, lavable en máquina', 24.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 30, '/src/assets/products/raton-catnip.webp'),
('Alfombra Olfativa', 'Tapete con flecos largos para esconder premios, estimula olfato, fácil de lavar', 19.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 35, '/src/assets/products/varita-plumas.webp'),
('Set de Pelotas Variadas', 'Pack de 6 pelotas diferentes texturas y sonidos, diversión garantizada, colores atractivos', 15.99, 'c2777289-318c-4c91-a156-7c32e4a38081', 48, '/src/assets/products/pelota-chillon.webp');