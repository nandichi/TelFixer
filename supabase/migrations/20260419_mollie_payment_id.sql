-- Add Mollie-related fields to orders for webhook reconciliation

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS mollie_payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_mollie_payment_id
  ON public.orders(mollie_payment_id);

-- Guest orders: allow user_id to be NULL and add guest contact columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT;
