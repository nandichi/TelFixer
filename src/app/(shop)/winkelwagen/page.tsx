'use client';

import Image from 'next/image';
import Link from 'next/link';
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
      <div className="py-24 lg:py-32 bg-cream min-h-screen">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 rounded-full bg-champagne flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-soft-black mb-4">
              Je winkelwagen is leeg
            </h1>
            <p className="text-muted mb-8 leading-relaxed">
              Je hebt nog geen producten aan je winkelwagen toegevoegd.
              Bekijk onze collectie refurbished elektronica.
            </p>
            <Link href="/producten">
              <Button size="lg" className="gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Verder winkelen
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20 bg-cream min-h-screen">
      <Container>
        <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
          Winkelwagen
        </span>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black mb-12">
          Jouw selectie
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-6 p-6 bg-white rounded-3xl border border-sand transition-all duration-300 hover:shadow-md"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                {/* Image */}
                <Link
                  href={`/producten/${item.product.slug}`}
                  className="relative w-28 h-28 bg-champagne rounded-2xl overflow-hidden shrink-0"
                >
                  {item.product.image_urls?.[0] ? (
                    <Image
                      src={item.product.image_urls[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/producten/${item.product.slug}`}
                    className="text-lg font-display font-semibold text-soft-black hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-copper font-medium mt-1">{item.product.brand}</p>
                  
                  {/* Price on mobile */}
                  <p className="text-xl font-display font-bold text-primary mt-3 sm:hidden">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center bg-champagne rounded-xl">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-3 text-muted hover:text-primary transition-colors"
                        aria-label="Verminderen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 min-w-[48px] text-center font-semibold text-soft-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock_quantity}
                        className="p-3 text-muted hover:text-primary disabled:opacity-40 transition-colors"
                        aria-label="Verhogen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-3 rounded-xl text-muted hover:text-[#DC2626] hover:bg-[#DC2626]/5 transition-all"
                      aria-label="Verwijderen"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Price on desktop */}
                <div className="hidden sm:block text-right">
                  <p className="text-2xl font-display font-bold text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-muted mt-1">
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
                className="text-sm text-muted hover:text-primary flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Verder winkelen
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-muted hover:text-[#DC2626] transition-colors"
              >
                Winkelwagen legen
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-12 lg:mt-0">
            <div className="bg-white rounded-3xl border border-sand p-8 sticky top-28" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="text-xl font-display font-semibold text-soft-black mb-6">
                Overzicht
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-muted">
                    Subtotaal ({itemCount} {itemCount === 1 ? 'product' : 'producten'})
                  </span>
                  <span className="font-medium text-soft-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Verzendkosten</span>
                  <span className="font-medium text-soft-black">
                    {shipping === 0 ? (
                      <span className="text-[#0D9488]">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && subtotal < 50 && (
                  <div className="flex items-center gap-3 p-4 bg-[#D97706]/5 rounded-xl">
                    <svg className="w-5 h-5 text-[#D97706] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-[#D97706]">
                      Nog {formatPrice(50 - subtotal)} voor gratis verzending!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-sand pt-6 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-display font-semibold text-soft-black">
                    Totaal
                  </span>
                  <span className="text-2xl font-display font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-muted mt-2">Inclusief BTW</p>
              </div>

              <Link href="/checkout">
                <Button fullWidth size="lg" className="gap-3">
                  Afrekenen
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>

              {/* Trust Points */}
              <div className="mt-8 pt-8 border-t border-sand space-y-3">
                {[
                  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: '12 maanden garantie' },
                  { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', text: '30 dagen retourrecht' },
                  { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Veilig betalen' },
                ].map((point) => (
                  <div key={point.text} className="flex items-center gap-3 text-sm text-muted">
                    <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={point.icon} />
                    </svg>
                    {point.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
