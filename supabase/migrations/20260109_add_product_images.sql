-- TelFixer Product Images Migration
-- Run this SQL to update products with real product images
-- Images sourced from Unsplash (free to use)

-- ============================================
-- UPDATE PRODUCT IMAGES
-- ============================================

-- iPhone 14 Pro 128GB Space Black
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80'
]
WHERE slug = 'iphone-14-pro-128gb-space-black';

-- iPhone 13 128GB Blauw
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1632633173522-47456de71b76?w=800&q=80',
    'https://images.unsplash.com/photo-1638038772924-ef79cce2426d?w=800&q=80'
]
WHERE slug = 'iphone-13-128gb-blauw';

-- iPhone 12 64GB Wit
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1605457212895-a6c9fb0c5de3?w=800&q=80',
    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=800&q=80'
]
WHERE slug = 'iphone-12-64gb-wit';

-- Samsung Galaxy S23 Ultra 256GB Phantom Black
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    'https://images.unsplash.com/photo-1678911820864-e5c67e784b40?w=800&q=80'
]
WHERE slug = 'samsung-galaxy-s23-ultra-256gb-phantom-black';

-- Samsung Galaxy S22 128GB Groen
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1644501566143-5e6c6e4e4d8e?w=800&q=80',
    'https://images.unsplash.com/photo-1657476749877-98a0d5d7a6c1?w=800&q=80'
]
WHERE slug = 'samsung-galaxy-s22-128gb-groen';

-- MacBook Air M2 13 inch 256GB Space Gray
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
]
WHERE slug = 'macbook-air-m2-13-256gb-space-gray';

-- MacBook Pro 14 inch M3 512GB Space Black
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80',
    'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80'
]
WHERE slug = 'macbook-pro-14-m3-512gb-space-black';

-- Lenovo ThinkPad X1 Carbon Gen 11
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'
]
WHERE slug = 'lenovo-thinkpad-x1-carbon-gen-11';

-- iPad Pro 11 inch M2 128GB WiFi Space Gray
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80'
]
WHERE slug = 'ipad-pro-11-m2-128gb-wifi-space-gray';

-- iPad Air 5 64GB WiFi Blauw
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80',
    'https://images.unsplash.com/photo-1557825835-70d97c4aa567?w=800&q=80'
]
WHERE slug = 'ipad-air-5-64gb-wifi-blauw';

-- Samsung Galaxy Tab S9 128GB WiFi Graphite
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=800&q=80',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80'
]
WHERE slug = 'samsung-galaxy-tab-s9-128gb-wifi-graphite';

-- Apple 20W USB-C Power Adapter
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'
]
WHERE slug = 'apple-20w-usb-c-power-adapter';

-- Samsung 25W Super Fast Charger
UPDATE public.products 
SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80',
    'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80'
]
WHERE slug = 'samsung-25w-super-fast-charger';

-- ============================================
-- VERIFY UPDATES
-- ============================================
-- Run this to verify the images were updated correctly:
-- SELECT name, slug, image_urls FROM public.products;
