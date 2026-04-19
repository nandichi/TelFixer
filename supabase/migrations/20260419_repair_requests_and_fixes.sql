-- Repair requests table + product fixes + site_settings defaults

-- ============================================
-- REPAIR REQUESTS TABLE
-- ============================================
DO $$ BEGIN
    CREATE TYPE repair_status AS ENUM (
        'ontvangen',
        'in_behandeling',
        'klaar',
        'afgehandeld',
        'afgewezen'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.repair_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reference_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    device_type TEXT NOT NULL,
    device_brand TEXT NOT NULL,
    device_model TEXT NOT NULL,
    repair_type TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    preferred_date DATE,
    status repair_status DEFAULT 'ontvangen',
    notes TEXT,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repair_requests_reference ON public.repair_requests(reference_number);
CREATE INDEX IF NOT EXISTS idx_repair_requests_status ON public.repair_requests(status);
CREATE INDEX IF NOT EXISTS idx_repair_requests_email ON public.repair_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_repair_requests_user ON public.repair_requests(user_id);

ALTER TABLE public.repair_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own repair requests" ON public.repair_requests;
CREATE POLICY "Users can view own repair requests" ON public.repair_requests
    FOR SELECT USING (
        auth.uid() = user_id OR
        customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Anyone can create repair requests" ON public.repair_requests;
CREATE POLICY "Anyone can create repair requests" ON public.repair_requests
    FOR INSERT WITH CHECK (true);

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Admins can view all repair requests" ON public.repair_requests';
        EXECUTE 'CREATE POLICY "Admins can view all repair requests" ON public.repair_requests FOR SELECT USING (public.is_admin())';
        EXECUTE 'DROP POLICY IF EXISTS "Admins can update repair requests" ON public.repair_requests';
        EXECUTE 'CREATE POLICY "Admins can update repair requests" ON public.repair_requests FOR UPDATE USING (public.is_admin())';
        EXECUTE 'DROP POLICY IF EXISTS "Admins can delete repair requests" ON public.repair_requests';
        EXECUTE 'CREATE POLICY "Admins can delete repair requests" ON public.repair_requests FOR DELETE USING (public.is_admin())';
    END IF;
END $$;

CREATE TRIGGER update_repair_requests_updated_at
    BEFORE UPDATE ON public.repair_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PRODUCTS: in_stock + warranty default
-- ============================================
ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

ALTER TABLE public.products
    ALTER COLUMN warranty_months SET DEFAULT 6;

-- ============================================
-- SITE SETTINGS: update defaults
-- ============================================
UPDATE public.site_settings
SET value = jsonb_build_object(
    'name', 'TelFixer',
    'email', 'info@telfixer.nl',
    'phone', '+31 6 44642162',
    'address', 'Houtrakbos 34, 6718HD, Ede',
    'kvk_number', COALESCE(value->>'kvk_number', ''),
    'vat_number', COALESCE(value->>'vat_number', '')
),
updated_at = NOW()
WHERE key = 'company';

INSERT INTO public.site_settings (key, value)
VALUES ('company', '{"name": "TelFixer", "email": "info@telfixer.nl", "phone": "+31 6 44642162", "address": "Houtrakbos 34, 6718HD, Ede"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
