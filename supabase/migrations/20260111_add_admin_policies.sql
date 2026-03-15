-- Add RLS policies for admins to access all data
-- 
-- IMPORTANT: This uses a SECURITY DEFINER helper function to avoid
-- infinite recursion when checking if a user is an admin.

-- ============================================
-- HELPER FUNCTION (SECURITY DEFINER bypasses RLS)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- ADMINS - Simple policy without recursion
-- ============================================
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
CREATE POLICY "Admins can view admins" ON public.admins
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- DEVICE SUBMISSIONS - Admin access
-- ============================================
CREATE POLICY "Admins can view all submissions" ON public.device_submissions
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all submissions" ON public.device_submissions
    FOR UPDATE USING (public.is_admin());

-- ============================================
-- ORDERS - Admin access
-- ============================================
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all orders" ON public.orders
    FOR UPDATE USING (public.is_admin());

-- ============================================
-- ORDER ITEMS - Admin access
-- ============================================
CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (public.is_admin());

-- ============================================
-- USERS - Admin access
-- ============================================
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin());

-- ============================================
-- PRODUCTS - Admin access (view inactive too)
-- ============================================
CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (public.is_admin());

-- ============================================
-- CATEGORIES - Admin access (CRUD)
-- ============================================
CREATE POLICY "Admins can insert categories" ON public.categories
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" ON public.categories
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
    FOR DELETE USING (public.is_admin());

-- ============================================
-- SITE SETTINGS - Admin access
-- ============================================
CREATE POLICY "Admins can insert settings" ON public.site_settings
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update settings" ON public.site_settings
    FOR UPDATE USING (public.is_admin());

-- ============================================
-- ADDRESSES - Admin access
-- ============================================
CREATE POLICY "Admins can view all addresses" ON public.addresses
    FOR SELECT USING (public.is_admin());
