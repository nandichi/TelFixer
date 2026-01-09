'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    total,
    itemCount,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-16 lg:py-24">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Je winkelwagen is leeg
            </h1>
            <p className="text-gray-500 mb-8">
              Je hebt nog geen producten aan je winkelwagen toegevoegd.
              Bekijk onze collectie refurbished elektronica.
            </p>
            <Link href="/producten">
              <Button size="lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Verder winkelen
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <Container>
        <h1 className="text-3xl font-bold text-[#2C3E48] mb-8">Winkelwagen</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200"
              >
                {/* Image */}
                <Link
                  href={`/producten/${item.product.slug}`}
                  className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0"
                >
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
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/producten/${item.product.slug}`}
                    className="text-base font-medium text-[#2C3E48] hover:text-[#094543] line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                  
                  {/* Price on mobile */}
                  <p className="text-lg font-bold text-[#094543] mt-2 sm:hidden">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 text-gray-500 hover:text-[#094543] transition-colors"
                        aria-label="Verminderen"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 min-w-[40px] text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock_quantity}
                        className="p-2 text-gray-500 hover:text-[#094543] disabled:opacity-50 transition-colors"
                        aria-label="Verhogen"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Verwijderen"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Price on desktop */}
                <div className="hidden sm:block text-right">
                  <p className="text-lg font-bold text-[#094543]">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.product.price)} per stuk
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/producten"
                className="text-sm text-gray-600 hover:text-[#094543] flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Verder winkelen
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Winkelwagen legen
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-[#2C3E48] mb-4">
                Overzicht
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Subtotaal ({itemCount} {itemCount === 1 ? 'product' : 'producten'})
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verzendkosten</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && subtotal < 50 && (
                  <p className="text-xs text-gray-500 bg-amber-50 p-2 rounded">
                    Nog {formatPrice(50 - subtotal)} voor gratis verzending!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#2C3E48]">
                    Totaal
                  </span>
                  <span className="text-xl font-bold text-[#094543]">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusief BTW</p>
              </div>

              <Link href="/checkout">
                <Button fullWidth size="lg">
                  Afrekenen
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              {/* Trust Points */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                {[
                  '12 maanden garantie',
                  '30 dagen retourrecht',
                  'Veilig betalen',
                ].map((point) => (
                  <p key={point} className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
