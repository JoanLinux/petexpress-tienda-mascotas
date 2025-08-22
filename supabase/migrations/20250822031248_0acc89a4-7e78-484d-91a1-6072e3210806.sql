-- Add new categories for the complete menu
INSERT INTO public.categories (name, description) VALUES 
('Desayunos', 'Desayunos tradicionales mexicanos con huevos, omelettes y más'),
('Enchiladas', 'Enchiladas rojas y verdes con diferentes rellenos'),
('Tacos de Guisado', 'Tacos de guisados tradicionales con diferentes carnes'),
('Pozole', 'Pozole tradicional blanco, rojo y verde'),
('Tacos a la Parrilla', 'Tacos a la parrilla con carnes frescas'),
('Flautas', 'Flautas doradas con diferentes rellenos'),
('Postres', 'Postres tradicionales mexicanos')
ON CONFLICT (name) DO NOTHING;