import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { ConditionBadge } from '@/components/ui/badge';
import { ImageGallery } from '@/components/products/image-gallery';
import { ProductCard } from '@/components/products/product-card';
import { AddToCartButton } from './add-to-cart-button';
import { formatPrice, calculateSavings } from '@/lib/utils';
import { getProductBySlug, getRelatedProducts } from '@/lib/supabase/products';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product niet gevonden',
    };
  }

  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.image_urls?.[0] ? [product.image_urls[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 3);

  const savings = calculateSavings(product.original_price, product.price);
  const conditionDescription = {
    als_nieuw: 'Dit product is in nagenoeg nieuwe staat. Geen zichtbare gebruikssporen.',
    zeer_goed: 'Dit product is in zeer goede staat met minimale gebruikssporen.',
    goed: 'Dit product is in goede staat met lichte gebruikssporen.',
    sterk_gebruikt: 'Dit product heeft zichtbare gebruikssporen maar functioneert perfect.',
  };

  const trustPoints = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: `${product.warranty_months} maanden garantie`
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      text: 'Gratis verzending vanaf 50 euro'
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      text: '30 dagen retourrecht'
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      text: '2-4 werkdagen levering'
    },
  ];

  return (
    <div className="py-12 lg:py-20 bg-cream">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted mb-6 sm:mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/producten" className="hover:text-primary transition-colors">
            Producten
          </Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-soft-black truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.image_urls} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Brand */}
            <p className="text-sm font-semibold text-copper uppercase tracking-widest">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-soft-black leading-tight">
              {product.name}
            </h1>

            {/* Condition Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <ConditionBadge grade={product.condition_grade} />
              <span className="text-sm text-muted">
                {conditionDescription[product.condition_grade]}
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
              <span className="text-3xl sm:text-4xl font-display font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-lg sm:text-xl text-muted line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-copper to-gold text-white rounded-full">
                    -{savings}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-3 text-[#0D9488]">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#0D9488]/10">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="font-medium">
                  {product.stock_quantity <= 3
                    ? `Nog ${product.stock_quantity} beschikbaar`
                    : 'Op voorraad'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-[#DC2626]">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#DC2626]/10">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span className="font-medium">Uitverkocht</span>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-sand">
              {trustPoints.map((item) => (
                <div key={item.text} className="flex items-center gap-2 sm:gap-3">
                  <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/5 text-primary flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-xs sm:text-sm text-slate">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-10 sm:mt-16 lg:mt-24">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
            {/* Description */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8 lg:p-10" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-soft-black mb-4 sm:mb-6">
                Over dit product
              </h2>
              <div className="prose-luxury">
                {product.description?.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-slate mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8 lg:p-10" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-soft-black mb-4 sm:mb-6">
                Specificaties
              </h2>
              <dl className="space-y-4">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-sand last:border-0"
                  >
                    <dt className="text-muted">{key}</dt>
                    <dd className="font-medium text-soft-black text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-16 lg:mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
              <div>
                <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-2 sm:mb-4">
                  Gerelateerd
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-soft-black">
                  Vergelijkbare producten
                </h2>
              </div>
              <Link
                href="/producten"
                className="hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all duration-300"
              >
                Bekijk meer
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
