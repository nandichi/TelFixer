'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/components/ui/toast';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { success } = useToast();

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    success('Toegevoegd aan winkelwagen', `${product.name} (${quantity}x)`);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (product.stock_quantity === 0) {
    return (
      <Button disabled fullWidth size="lg">
        Uitverkocht
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-soft-black">Aantal:</span>
        <div className="flex items-center bg-champagne rounded-xl">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-4 text-muted hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Verminderen"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="px-6 py-3 min-w-[60px] text-center font-semibold text-soft-black text-lg">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock_quantity}
            className="p-4 text-muted hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Verhogen"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {product.stock_quantity <= 5 && (
          <span className="text-sm text-[#D97706] font-medium">
            Nog {product.stock_quantity} beschikbaar
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        fullWidth
        size="xl"
        disabled={isAdded}
        className={isAdded ? 'bg-[#0D9488] hover:bg-[#0D9488]' : ''}
      >
        {isAdded ? (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Toegevoegd!
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            In winkelwagen
          </>
        )}
      </Button>
    </div>
  );
}
