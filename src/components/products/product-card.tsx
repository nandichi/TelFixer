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
        {/* Image Container - Taller aspect ratio for better visibility */}
        <div className="relative aspect-[4/5] bg-gradient-to-b from-champagne to-cream overflow-hidden flex-shrink-0">
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
            {/* Garantie badge */}
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold bg-white/95 backdrop-blur-sm text-primary rounded-full shadow-sm flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {product.warranty_months} mnd garantie
            </span>
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
          <h3 className="text-base sm:text-lg font-display font-semibold text-soft-black line-clamp-2 group-hover:text-primary transition-colors mb-2 sm:mb-3 min-h-[2.75rem] sm:min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Quality indicator */}
          <p className="text-[10px] sm:text-xs text-[#0D9488] font-medium flex items-center gap-1 mb-3 sm:mb-4">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            In ieder geval helemaal in orde
          </p>

          {/* Price and Social Links */}
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
            
            {/* Social/Marketplace Links */}
            {(product.marketplace_url || product.facebook_url) && (
              <div className="flex items-center gap-1.5">
                {product.marketplace_url && (
                  <a
                    href={product.marketplace_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F45334]/10 text-[#F45334] hover:bg-[#F45334]/20 transition-colors"
                    aria-label="Bekijk op Marktplaats"
                    title="Bekijk op Marktplaats"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </a>
                )}
                {product.facebook_url && (
                  <a
                    href={product.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
                    aria-label="Bekijk op Facebook"
                    title="Bekijk op Facebook"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
