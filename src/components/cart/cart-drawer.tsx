'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-soft-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-cream shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-sand">
          <h2 className="text-lg sm:text-xl font-display font-semibold text-soft-black">
            Winkelwagen ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-muted hover:text-soft-black hover:bg-sand transition-all"
            aria-label="Sluiten"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <svg className="w-12 h-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-muted text-center mb-6">
              Je winkelwagen is leeg
            </p>
            <Button onClick={closeCart} variant="outline">
              Verder winkelen
            </Button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-sand"
                    style={{ boxShadow: 'var(--shadow-xs)' }}
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-champagne rounded-lg sm:rounded-xl overflow-hidden shrink-0">
                      {item.product.image_urls?.[0] ? (
                        <Image
                          src={item.product.image_urls[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producten/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-soft-black hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-copper font-medium mt-0.5">
                        {item.product.brand}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-2">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-champagne rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 text-muted hover:text-primary transition-colors"
                            aria-label="Verminderen"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-3 text-sm font-semibold text-soft-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock_quantity}
                            className="p-2 text-muted hover:text-primary transition-colors disabled:opacity-40"
                            aria-label="Verhogen"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-muted hover:text-[#DC2626] transition-colors"
                          aria-label="Verwijderen"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-sand bg-white px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Totals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotaal</span>
                  <span className="font-medium text-soft-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Verzendkosten</span>
                  <span className="font-medium text-soft-black">
                    {shipping === 0 ? <span className="text-[#0D9488]">Gratis</span> : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && subtotal < 50 && (
                  <p className="text-xs text-[#D97706]">
                    Nog {formatPrice(50 - subtotal)} voor gratis verzending
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-sand">
                  <span className="font-semibold text-soft-black">Totaal</span>
                  <span className="text-xl font-display font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link href="/checkout" onClick={closeCart}>
                  <Button fullWidth className="gap-2">
                    Afrekenen
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/winkelwagen" onClick={closeCart}>
                  <Button variant="ghost" fullWidth>
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
