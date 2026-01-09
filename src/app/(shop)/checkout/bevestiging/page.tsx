import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

interface PageProps {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderNumber = params.order || 'UNKNOWN';

  return (
    <div className="py-24 lg:py-32 bg-cream min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#0D9488]/10 flex items-center justify-center animate-scale-in">
                <svg className="w-16 h-16 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-copper to-gold animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black mb-6 animate-fade-in-up">
            Bedankt voor je bestelling!
          </h1>
          <p className="text-lg text-muted mb-12 max-w-lg mx-auto animate-fade-in-up delay-100">
            Je bestelling is succesvol geplaatst. Je ontvangt binnen enkele minuten een bevestigingsmail.
          </p>

          {/* Order Number */}
          <div className="bg-white rounded-3xl border border-sand p-8 mb-12 animate-fade-in-up delay-200" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-sm text-muted mb-2">Ordernummer</p>
            <p className="text-3xl font-display font-bold text-primary">{orderNumber}</p>
          </div>

          {/* Next Steps */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-3xl border border-sand p-8 text-left animate-fade-in-up delay-300" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-semibold text-soft-black mb-2">
                Check je inbox
              </h3>
              <p className="text-muted">
                Je ontvangt een bevestigingsmail met alle details van je bestelling.
              </p>
            </div>
            <div className="bg-white rounded-3xl border border-sand p-8 text-left animate-fade-in-up delay-400" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-semibold text-soft-black mb-2">
                Verzending
              </h3>
              <p className="text-muted">
                Je bestelling wordt binnen 2-4 werkdagen verzonden met track & trace.
              </p>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-gradient-to-r from-primary/5 to-copper/5 rounded-3xl p-8 mb-12 animate-fade-in-up delay-500">
            <p className="text-sm text-muted mb-2">Geschatte levering</p>
            <p className="text-2xl font-display font-semibold text-soft-black">
              {(() => {
                const date = new Date();
                date.setDate(date.getDate() + 3);
                return new Intl.DateTimeFormat('nl-NL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }).format(date);
              })()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-600">
            <Link href="/producten">
              <Button variant="outline" size="lg">
                Verder winkelen
              </Button>
            </Link>
            <Link href="/account/bestellingen">
              <Button size="lg" className="gap-2">
                Bekijk je bestellingen
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
