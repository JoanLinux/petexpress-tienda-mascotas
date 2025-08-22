-- Create storage buckets for Casa Beatricita images
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('category-images', 'category-images', true);

-- Create RLS policies for product images bucket
CREATE POLICY "Anyone can view product images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Create RLS policies for category images bucket
CREATE POLICY "Anyone can view category images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload category images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'category-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update category images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'category-images' AND auth.role() = 'authenticated');