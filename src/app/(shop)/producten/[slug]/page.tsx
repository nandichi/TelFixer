import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Shield, Truck, RotateCcw, Package } from 'lucide-react';
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

  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#094543]">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/producten" className="hover:text-[#094543]">
            Producten
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.image_urls} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-2xl lg:text-3xl font-bold text-[#2C3E48]">
              {product.name}
            </h1>

            {/* Condition Badge */}
            <div className="flex items-center gap-3">
              <ConditionBadge grade={product.condition_grade} />
              <span className="text-sm text-gray-600">
                {conditionDescription[product.condition_grade]}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#094543]">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="px-2 py-1 text-sm font-bold bg-red-100 text-red-600 rounded">
                    -{savings}% korting
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <Package className="h-5 w-5" />
                <span className="font-medium">
                  {product.stock_quantity <= 3
                    ? `Nog ${product.stock_quantity} beschikbaar`
                    : 'Op voorraad'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <Package className="h-5 w-5" />
                <span className="font-medium">Uitverkocht</span>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              {[
                { icon: Shield, text: `${product.warranty_months} maanden garantie` },
                { icon: Truck, text: 'Gratis verzending vanaf 50 euro' },
                { icon: RotateCcw, text: '30 dagen retourrecht' },
                { icon: Package, text: '2-4 werkdagen levering' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-[#094543]" />
                  <span className="text-sm text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button className="pb-4 border-b-2 border-[#094543] text-[#094543] font-medium">
                Beschrijving
              </button>
              <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Specificaties
              </button>
            </div>
          </div>

          <div className="py-8 grid lg:grid-cols-2 gap-8">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-[#2C3E48] mb-4">
                Over dit product
              </h2>
              <div className="prose prose-gray max-w-none">
                {product.description?.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-semibold text-[#2C3E48] mb-4">
                Specificaties
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <dl className="space-y-4">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b border-gray-200 last:border-0"
                    >
                      <dt className="text-gray-600">{key}</dt>
                      <dd className="font-medium text-[#2C3E48]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-6">
              Gerelateerde producten
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
