'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, calculateSavings } from '@/lib/utils';
import { ConditionBadge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const savings = calculateSavings(product.original_price, product.price);
  const hasImage = product.image_urls && product.image_urls.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link href={`/producten/${product.slug}`} className="group block h-full">
      <div className="relative h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-sand overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:-translate-y-2" style={{ boxShadow: 'var(--shadow-sm)' }}>
        {/* Image Container */}
        <div className="relative aspect-square bg-champagne overflow-hidden flex-shrink-0">
          {hasImage ? (
            <Image
              src={product.image_urls[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
            <ConditionBadge grade={product.condition_grade} size="sm" />
            {savings > 0 && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-copper to-gold text-white rounded-full shadow-sm">
                -{savings}%
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium bg-white/90 backdrop-blur-sm text-soft-black rounded-full shadow-sm">
                Nog {product.stock_quantity} beschikbaar
              </span>
            </div>
          )}
          
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-soft-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="px-6 py-3 text-sm font-semibold bg-white text-soft-black rounded-full shadow-lg">
                Uitverkocht
              </span>
            </div>
          )}
          
          {/* Quick Add Button - Always visible on mobile, hover on desktop */}
          {product.stock_quantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary text-white opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-light shadow-lg"
              aria-label="Toevoegen aan winkelwagen"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          {/* Brand */}
          <p className="text-[10px] sm:text-xs font-semibold text-copper uppercase tracking-widest mb-1.5 sm:mb-2">
            {product.brand}
          </p>

          {/* Name - fixed height for 2 lines */}
          <h3 className="text-base sm:text-lg font-display font-semibold text-soft-black line-clamp-2 group-hover:text-primary transition-colors mb-3 sm:mb-4 min-h-[2.75rem] sm:min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Price - pushed to bottom */}
          <div className="flex items-end justify-between mt-auto">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl font-display font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs sm:text-sm text-muted line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
