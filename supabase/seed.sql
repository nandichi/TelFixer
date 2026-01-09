-- TelFixer Seed Data
-- Run this after schema.sql to populate with sample data

-- ============================================
-- SAMPLE PRODUCTS
-- ============================================

-- iPhone products
INSERT INTO public.products (name, slug, category_id, brand, price, original_price, condition_grade, description, specifications, stock_quantity, image_urls, warranty_months, featured) VALUES
(
    'iPhone 14 Pro 128GB Space Black',
    'iphone-14-pro-128gb-space-black',
    (SELECT id FROM public.categories WHERE slug = 'telefoons'),
    'Apple',
    799.00,
    1199.00,
    'zeer_goed',
    'De iPhone 14 Pro in uitstekende staat. Dit toestel is volledig getest en gereinigd. Batterijcapaciteit minimaal 85%. Inclusief oplader en garantie.',
    '{"Opslag": "128GB", "Scherm": "6.1 inch Super Retina XDR", "Chip": "A16 Bionic", "Camera": "48MP + 12MP + 12MP", "Batterij": "3200mAh", "Kleur": "Space Black"}',
    5,
    ARRAY['/images/products/iphone-14-pro-black-1.jpg', '/images/products/iphone-14-pro-black-2.jpg'],
    12,
    true
),
(
    'iPhone 13 128GB Blauw',
    'iphone-13-128gb-blauw',
    (SELECT id FROM public.categories WHERE slug = 'telefoons'),
    'Apple',
    549.00,
    899.00,
    'goed',
    'iPhone 13 in goede staat met lichte gebruikssporen. Volledig functioneel en getest. Batterijcapaciteit minimaal 80%.',
    '{"Opslag": "128GB", "Scherm": "6.1 inch Super Retina XDR", "Chip": "A15 Bionic", "Camera": "12MP + 12MP", "Batterij": "3240mAh", "Kleur": "Blauw"}',
    8,
    ARRAY['/images/products/iphone-13-blue-1.jpg'],
    12,
    true
),
(
    'iPhone 12 64GB Wit',
    'iphone-12-64gb-wit',
    (SELECT id FROM public.categories WHERE slug = 'telefoons'),
    'Apple',
    399.00,
    699.00,
    'goed',
    'iPhone 12 in goede conditie. Ideaal als eerste smartphone of backup toestel. Volledig getest en schoongemaakt.',
    '{"Opslag": "64GB", "Scherm": "6.1 inch Super Retina XDR", "Chip": "A14 Bionic", "Camera": "12MP + 12MP", "Batterij": "2815mAh", "Kleur": "Wit"}',
    12,
    ARRAY['/images/products/iphone-12-white-1.jpg'],
    12,
    false
);

-- Samsung products
INSERT INTO public.products (name, slug, category_id, brand, price, original_price, condition_grade, description, specifications, stock_quantity, image_urls, warranty_months, featured) VALUES
(
    'Samsung Galaxy S23 Ultra 256GB Phantom Black',
    'samsung-galaxy-s23-ultra-256gb-phantom-black',
    (SELECT id FROM public.categories WHERE slug = 'telefoons'),
    'Samsung',
    899.00,
    1399.00,
    'als_nieuw',
    'De Samsung Galaxy S23 Ultra in nagenoeg nieuwstaat. Nauwelijks gebruikt, geen zichtbare gebruikssporen. Inclusief S Pen.',
    '{"Opslag": "256GB", "Scherm": "6.8 inch Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 2", "Camera": "200MP + 12MP + 10MP + 10MP", "Batterij": "5000mAh", "Kleur": "Phantom Black"}',
    3,
    ARRAY['/images/products/s23-ultra-black-1.jpg'],
    12,
    true
),
(
    'Samsung Galaxy S22 128GB Groen',
    'samsung-galaxy-s22-128gb-groen',
    (SELECT id FROM public.categories WHERE slug = 'telefoons'),
    'Samsung',
    449.00,
    849.00,
    'zeer_goed',
    'Samsung Galaxy S22 in zeer goede staat. Minimale gebruikssporen, volledig functioneel.',
    '{"Opslag": "128GB", "Scherm": "6.1 inch Dynamic AMOLED 2X", "Chip": "Exynos 2200", "Camera": "50MP + 12MP + 10MP", "Batterij": "3700mAh", "Kleur": "Groen"}',
    6,
    ARRAY['/images/products/s22-green-1.jpg'],
    12,
    false
);

-- Laptop products
INSERT INTO public.products (name, slug, category_id, brand, price, original_price, condition_grade, description, specifications, stock_quantity, image_urls, warranty_months, featured) VALUES
(
    'MacBook Air M2 13 inch 256GB Space Gray',
    'macbook-air-m2-13-256gb-space-gray',
    (SELECT id FROM public.categories WHERE slug = 'laptops'),
    'Apple',
    999.00,
    1399.00,
    'zeer_goed',
    'MacBook Air met de krachtige M2 chip. In zeer goede staat met minimale gebruikssporen. Batterijcycli onder 100. Ideaal voor werk en studie.',
    '{"Opslag": "256GB SSD", "RAM": "8GB", "Scherm": "13.6 inch Liquid Retina", "Chip": "Apple M2", "Batterij": "Tot 18 uur", "Kleur": "Space Gray"}',
    4,
    ARRAY['/images/products/macbook-air-m2-1.jpg'],
    12,
    true
),
(
    'MacBook Pro 14 inch M3 512GB Space Black',
    'macbook-pro-14-m3-512gb-space-black',
    (SELECT id FROM public.categories WHERE slug = 'laptops'),
    'Apple',
    1699.00,
    2199.00,
    'als_nieuw',
    'MacBook Pro 14 inch met M3 chip. Nauwelijks gebruikt, in perfecte staat. Batterijcycli onder 20.',
    '{"Opslag": "512GB SSD", "RAM": "18GB", "Scherm": "14.2 inch Liquid Retina XDR", "Chip": "Apple M3 Pro", "Batterij": "Tot 17 uur", "Kleur": "Space Black"}',
    2,
    ARRAY['/images/products/macbook-pro-14-1.jpg'],
    12,
    true
),
(
    'Lenovo ThinkPad X1 Carbon Gen 11',
    'lenovo-thinkpad-x1-carbon-gen-11',
    (SELECT id FROM public.categories WHERE slug = 'laptops'),
    'Lenovo',
    1099.00,
    1799.00,
    'zeer_goed',
    'Business laptop in topconditie. Intel Core i7, 16GB RAM, 512GB SSD. Perfecte zakelijke laptop.',
    '{"Opslag": "512GB SSD", "RAM": "16GB", "Scherm": "14 inch 2.8K OLED", "Processor": "Intel Core i7-1365U", "Batterij": "Tot 15 uur", "Kleur": "Deep Black"}',
    3,
    ARRAY['/images/products/thinkpad-x1-1.jpg'],
    12,
    false
);

-- Tablet products
INSERT INTO public.products (name, slug, category_id, brand, price, original_price, condition_grade, description, specifications, stock_quantity, image_urls, warranty_months, featured) VALUES
(
    'iPad Pro 11 inch M2 128GB WiFi Space Gray',
    'ipad-pro-11-m2-128gb-wifi-space-gray',
    (SELECT id FROM public.categories WHERE slug = 'tablets'),
    'Apple',
    699.00,
    999.00,
    'zeer_goed',
    'iPad Pro 11 inch met M2 chip. Ideaal voor creatief werk en entertainment. In zeer goede staat.',
    '{"Opslag": "128GB", "Scherm": "11 inch Liquid Retina", "Chip": "Apple M2", "Connectiviteit": "WiFi", "Camera": "12MP + 10MP", "Kleur": "Space Gray"}',
    4,
    ARRAY['/images/products/ipad-pro-11-1.jpg'],
    12,
    true
),
(
    'iPad Air 5 64GB WiFi Blauw',
    'ipad-air-5-64gb-wifi-blauw',
    (SELECT id FROM public.categories WHERE slug = 'tablets'),
    'Apple',
    499.00,
    699.00,
    'goed',
    'iPad Air 5e generatie met M1 chip. Goede staat met lichte gebruikssporen op de behuizing.',
    '{"Opslag": "64GB", "Scherm": "10.9 inch Liquid Retina", "Chip": "Apple M1", "Connectiviteit": "WiFi", "Camera": "12MP", "Kleur": "Blauw"}',
    6,
    ARRAY['/images/products/ipad-air-5-blue-1.jpg'],
    12,
    false
),
(
    'Samsung Galaxy Tab S9 128GB WiFi Graphite',
    'samsung-galaxy-tab-s9-128gb-wifi-graphite',
    (SELECT id FROM public.categories WHERE slug = 'tablets'),
    'Samsung',
    549.00,
    849.00,
    'zeer_goed',
    'Samsung Galaxy Tab S9 in uitstekende staat. Inclusief S Pen. Perfect voor productiviteit en entertainment.',
    '{"Opslag": "128GB", "Scherm": "11 inch Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 2", "Connectiviteit": "WiFi", "Camera": "13MP", "Kleur": "Graphite"}',
    5,
    ARRAY['/images/products/tab-s9-1.jpg'],
    12,
    false
);

-- Accessories
INSERT INTO public.products (name, slug, category_id, brand, price, original_price, condition_grade, description, specifications, stock_quantity, image_urls, warranty_months, featured) VALUES
(
    'Apple 20W USB-C Power Adapter',
    'apple-20w-usb-c-power-adapter',
    (SELECT id FROM public.categories WHERE slug = 'accessoires'),
    'Apple',
    15.00,
    25.00,
    'als_nieuw',
    'Originele Apple 20W USB-C oplader. Getest en in perfecte werkende staat.',
    '{"Vermogen": "20W", "Poorten": "1x USB-C", "Compatibiliteit": "iPhone, iPad, AirPods"}',
    25,
    ARRAY['/images/products/apple-charger-1.jpg'],
    6,
    false
),
(
    'Samsung 25W Super Fast Charger',
    'samsung-25w-super-fast-charger',
    (SELECT id FROM public.categories WHERE slug = 'accessoires'),
    'Samsung',
    12.00,
    29.00,
    'als_nieuw',
    'Originele Samsung 25W snellader. Ondersteunt Super Fast Charging.',
    '{"Vermogen": "25W", "Poorten": "1x USB-C", "Compatibiliteit": "Samsung Galaxy devices"}',
    30,
    ARRAY['/images/products/samsung-charger-1.jpg'],
    6,
    false
);
