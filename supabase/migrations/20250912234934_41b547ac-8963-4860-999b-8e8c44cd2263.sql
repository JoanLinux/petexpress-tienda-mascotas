-- Verificar y arreglar solo las políticas específicas necesarias para delivery_tracking
-- Solo crear las políticas que faltan
DO $$
BEGIN
    -- Verificar si existe la política "Anyone can create delivery tracking"
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'delivery_tracking' 
        AND policyname = 'Anyone can create delivery tracking'
    ) THEN
        CREATE POLICY "Anyone can create delivery tracking" ON delivery_tracking
        FOR INSERT
        WITH CHECK (true);
    END IF;
    
    -- Verificar si existe la política "Anyone can view delivery tracking"
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'delivery_tracking' 
        AND policyname = 'Anyone can view delivery tracking'
    ) THEN
        CREATE POLICY "Anyone can view delivery tracking" ON delivery_tracking
        FOR SELECT
        USING (true);
    END IF;
END $$;