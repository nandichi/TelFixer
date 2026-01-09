'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
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
    <Link href={`/producten/${product.slug}`} className="group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100">
          {hasImage ? (
            <Image
              src={product.image_urls[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <ConditionBadge grade={product.condition_grade} size="sm" />
            {savings > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                -{savings}%
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                Nog {product.stock_quantity} beschikbaar
              </span>
            </div>
          )}
          
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 text-sm font-medium bg-white text-gray-800 rounded-full">
                Uitverkocht
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="mt-1 text-base font-semibold text-[#2C3E48] line-clamp-2 group-hover:text-[#094543] transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#094543]">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            {product.stock_quantity > 0 && (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#094543] text-white hover:bg-[#0d5c59] transition-colors"
                aria-label="Toevoegen aan winkelwagen"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
