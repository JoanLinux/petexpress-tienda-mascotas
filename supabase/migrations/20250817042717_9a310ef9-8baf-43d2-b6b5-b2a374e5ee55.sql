-- Create table for tracking product views
CREATE TABLE public.product_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert product views" 
ON public.product_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view product views for analytics" 
ON public.product_views 
FOR SELECT 
USING (true);

-- Create index for better performance
CREATE INDEX idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX idx_product_views_viewed_at ON public.product_views(viewed_at DESC);
CREATE INDEX idx_product_views_session_id ON public.product_views(session_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_views_updated_at
BEFORE UPDATE ON public.product_views
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();