'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    total,
    itemCount,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#2C3E48]">
            Winkelwagen ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Sluiten"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-6">
              Je winkelwagen is leeg
            </p>
            <Button onClick={closeCart} variant="outline">
              Verder winkelen
            </Button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                      {item.product.image_urls?.[0] ? (
                        <Image
                          src={item.product.image_urls[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producten/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-[#2C3E48] hover:text-[#094543] line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {item.product.brand}
                      </p>
                      <p className="text-sm font-semibold text-[#094543] mt-1">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1.5 text-gray-500 hover:text-[#094543] transition-colors"
                            aria-label="Verminderen"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock_quantity}
                            className="p-1.5 text-gray-500 hover:text-[#094543] transition-colors disabled:opacity-50"
                            aria-label="Verhogen"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Verwijderen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotaal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Verzendkosten</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && subtotal < 50 && (
                  <p className="text-xs text-gray-500">
                    Nog {formatPrice(50 - subtotal)} voor gratis verzending
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-[#2C3E48]">Totaal</span>
                  <span className="text-lg font-bold text-[#094543]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart}>
                  <Button fullWidth>Afrekenen</Button>
                </Link>
                <Link href="/winkelwagen" onClick={closeCart}>
                  <Button variant="outline" fullWidth>
                    Bekijk winkelwagen
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
