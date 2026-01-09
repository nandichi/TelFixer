'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Aantal:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-3 text-gray-500 hover:text-[#094543] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Verminderen"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 min-w-[50px] text-center font-medium">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock_quantity}
            className="p-3 text-gray-500 hover:text-[#094543] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Verhogen"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {product.stock_quantity <= 5 && (
          <span className="text-sm text-amber-600">
            Nog {product.stock_quantity} beschikbaar
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        fullWidth
        size="lg"
        disabled={isAdded}
        className={isAdded ? 'bg-emerald-500 hover:bg-emerald-500' : ''}
      >
        {isAdded ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            Toegevoegd!
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            In winkelwagen
          </>
        )}
      </Button>
    </div>
  );
}
