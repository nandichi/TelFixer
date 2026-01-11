-- Add social media/marketplace links to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS marketplace_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN products.marketplace_url IS 'URL to Marktplaats listing for this product';
COMMENT ON COLUMN products.facebook_url IS 'URL to Facebook Marketplace listing for this product';
