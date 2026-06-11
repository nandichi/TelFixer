-- ============================================================
-- Voorraad verlagen pas bij geslaagde betaling + garantiewaarden
-- ============================================================
-- Deze migratie houdt repo en live-database synchroon.

-- 1) Voorraad niet langer verlagen bij het aanmaken van de bestelling
--    (dat gebeurde voorheen via een trigger op order_items, dus nog
--    voordat de betaling was geslaagd).
DROP TRIGGER IF EXISTS decrease_stock_trigger ON public.order_items;
DROP FUNCTION IF EXISTS public.decrease_stock_on_order();

-- 2) Voorraad verlagen op het moment dat de betaling slaagt.
CREATE OR REPLACE FUNCTION public.decrease_stock_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid'
     AND COALESCE(OLD.payment_status::text, '') IS DISTINCT FROM 'paid' THEN
    UPDATE public.products p
    SET stock_quantity = GREATEST(0, p.stock_quantity - oi.quantity)
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS decrease_stock_on_payment_trigger ON public.orders;
CREATE TRIGGER decrease_stock_on_payment_trigger
  AFTER UPDATE OF payment_status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.decrease_stock_on_payment();

-- 3) Garantietermijnen bijwerken naar de actuele waarden.
--    Reparatie 3 mnd, refurbished toestellen 12 mnd, nieuwe toestellen 24 mnd,
--    accessoires nieuw 24 mnd, accessoires gebruikt 6 mnd.
UPDATE public.site_settings
SET value = value || jsonb_build_object(
      'phones_months', 12,
      'laptops_months', 12,
      'tablets_months', 12,
      'repairs_months', 3,
      'accessories_new_months', 24,
      'accessories_used_months', 6,
      'new_devices_months', 24
    ),
    updated_at = now()
WHERE key = 'warranty';

INSERT INTO public.site_settings (key, value)
SELECT 'warranty', jsonb_build_object(
    'phones_months', 12,
    'laptops_months', 12,
    'tablets_months', 12,
    'repairs_months', 3,
    'accessories_new_months', 24,
    'accessories_used_months', 6,
    'new_devices_months', 24,
    'battery_min_percentage', 85,
    'laptop_max_cycles', 250
  )
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'warranty');
