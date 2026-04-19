-- Default site setting voor Google Reviews sectie op homepage
INSERT INTO public.site_settings (key, value)
VALUES (
    'google_reviews',
    jsonb_build_object(
        'enabled', true,
        'business_name', 'TelFixer',
        'overall_rating', 5.0,
        'total_reviews', 0,
        'review_url', 'https://www.google.com/search?q=TelFixer+Reviews#lkt=LocalPoiReviews',
        'write_review_url', '',
        'reviews', '[]'::jsonb
    )
)
ON CONFLICT (key) DO NOTHING;
