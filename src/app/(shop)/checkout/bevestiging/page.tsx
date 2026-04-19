'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

type OrderStatus =
  | 'loading'
  | 'paid'
  | 'pending'
  | 'failed'
  | 'unknown';

function BevestigingInner() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'ONBEKEND';
  const { clearCart } = useCart();

  const [status, setStatus] = useState<OrderStatus>('loading');

  useEffect(() => {
    if (!orderNumber || orderNumber === 'ONBEKEND') {
      setStatus('unknown');
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 15;

    async function poll() {
      try {
        const res = await fetch(
          `/api/tracking?ref=${encodeURIComponent(orderNumber)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          if (attempts >= maxAttempts) {
            if (!cancelled) setStatus('unknown');
            return;
          }
          attempts += 1;
          setTimeout(poll, 2000);
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        const paymentStatus = data?.details?.paymentStatus as
          | string
          | null
          | undefined;

        if (paymentStatus === 'paid') {
          setStatus('paid');
          clearCart();
          return;
        }
        if (paymentStatus === 'failed' || data.status === 'geannuleerd') {
          setStatus('failed');
          return;
        }
        if (attempts >= maxAttempts) {
          setStatus('pending');
          return;
        }
        attempts += 1;
        setTimeout(poll, 2000);
      } catch (err) {
        console.error('Polling error', err);
        if (attempts >= maxAttempts) {
          if (!cancelled) setStatus('unknown');
          return;
        }
        attempts += 1;
        setTimeout(poll, 2000);
      }
    }

    poll();

    return () => {
      cancelled = true;
    };
  }, [orderNumber, clearCart]);

  const iconBg =
    status === 'failed'
      ? 'bg-red-100 text-red-600'
      : status === 'paid'
      ? 'bg-[#0D9488]/10 text-[#0D9488]'
      : 'bg-amber-100 text-amber-700';

  const title =
    status === 'paid'
      ? 'Bedankt voor je bestelling!'
      : status === 'failed'
      ? 'Betaling niet voltooid'
      : status === 'unknown'
      ? 'We konden je bestelling niet vinden'
      : 'Je betaling wordt verwerkt...';

  const subtitle =
    status === 'paid'
      ? 'Je bestelling is succesvol geplaatst en betaald. Je ontvangt binnen enkele minuten een bevestigingsmail.'
      : status === 'failed'
      ? 'Het lijkt erop dat de betaling is geannuleerd of mislukt. Je kunt het opnieuw proberen.'
      : status === 'unknown'
      ? 'Geen geldig ordernummer gevonden. Controleer de link of neem contact op.'
      : 'Moment geduld - we wachten op de bevestiging van Mollie. Sluit deze pagina niet.';

  return (
    <div className="py-24 lg:py-32 bg-cream min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center animate-scale-in ${iconBg}`}
              >
                {status === 'failed' ? (
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : status === 'paid' ? (
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-16 h-16 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeOpacity="0.25"
                      strokeWidth={2}
                    />
                    <path
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M22 12a10 10 0 00-10-10"
                    />
                  </svg>
                )}
              </div>
              {status === 'paid' && (
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-copper to-gold animate-float"
                  style={{ animationDelay: '0.5s' }}
                />
              )}
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black mb-6">
            {title}
          </h1>
          <p className="text-lg text-muted mb-12 max-w-lg mx-auto">{subtitle}</p>

          {orderNumber !== 'ONBEKEND' && (
            <div
              className="bg-white rounded-3xl border border-sand p-8 mb-12"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <p className="text-sm text-muted mb-2">Ordernummer</p>
              <p className="text-3xl font-display font-bold text-primary">
                {orderNumber}
              </p>
            </div>
          )}

          {status === 'paid' && (
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div
                className="bg-white rounded-3xl border border-sand p-8 text-left"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-display font-semibold text-soft-black mb-2">
                  Check je inbox
                </h3>
                <p className="text-muted">
                  Je ontvangt een bevestigingsmail met alle details van je
                  bestelling.
                </p>
              </div>
              <div
                className="bg-white rounded-3xl border border-sand p-8 text-left"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-display font-semibold text-soft-black mb-2">
                  Verzending
                </h3>
                <p className="text-muted">
                  Je bestelling wordt zo snel mogelijk verzonden met track &amp;
                  trace.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {status === 'failed' ? (
              <>
                <Link href="/winkelwagen">
                  <Button variant="outline" size="lg">
                    Terug naar winkelwagen
                  </Button>
                </Link>
                <Link href="/checkout">
                  <Button size="lg">Opnieuw betalen</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/producten">
                  <Button variant="outline" size="lg">
                    Verder winkelen
                  </Button>
                </Link>
                <Link href={`/tracking?ref=${orderNumber}`}>
                  <Button size="lg" className="gap-2">
                    Volg je bestelling
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-[#094543] border-t-transparent animate-spin" />
        </div>
      }
    >
      <BevestigingInner />
    </Suspense>
  );
}
