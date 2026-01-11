import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

interface PageProps {
  searchParams: Promise<{
    ref?: string;
  }>;
}

export default async function SubmissionConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const referenceNumber = params.ref || 'UNKNOWN';

  return (
    <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8 animate-scale-in">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center">
                <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black mb-4 animate-fade-in-up">
            Inlevering ontvangen!
          </h1>
          <p className="text-lg text-muted mb-10 animate-fade-in-up delay-100">
            We hebben je inlevering ontvangen en gaan deze zo snel mogelijk beoordelen.
            <br />
            <span className="text-sm text-[#0D9488]">Een bevestiging met je referentienummer is verzonden naar je e-mailadres.</span>
          </p>

          {/* Reference Number */}
          <div className="bg-white rounded-3xl border border-sand p-8 mb-10 animate-fade-in-up delay-200">
            <p className="text-sm font-medium text-muted uppercase tracking-wider mb-2">
              Referentienummer
            </p>
            <p className="text-3xl lg:text-4xl font-display font-bold text-gradient-primary">
              {referenceNumber}
            </p>
            <p className="text-sm text-muted mt-3">
              Bewaar dit nummer om de status van je inlevering te volgen
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-2xl border border-sand p-6 animate-fade-in-up delay-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-soft-black mb-1">Ontvangen</h3>
              <p className="text-sm text-muted">Je aanvraag is ingediend</p>
            </div>
            <div className="bg-white rounded-2xl border border-sand p-6 animate-fade-in-up delay-400">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-soft-black mb-1">Beoordeling</h3>
              <p className="text-sm text-muted">Binnen 2 werkdagen</p>
            </div>
            <div className="bg-white rounded-2xl border border-sand p-6 animate-fade-in-up delay-500">
              <div className="w-14 h-14 rounded-xl bg-champagne flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-soft-black mb-1">Aanbod</h3>
              <p className="text-sm text-muted">Per e-mail ontvangen</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-primary/5 rounded-3xl p-8 mb-10 text-left animate-fade-in-up delay-600">
            <h3 className="font-display font-semibold text-soft-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Wat kun je verwachten?
            </h3>
            <ul className="space-y-3">
              {[
                'Je ontvangt binnen 2 werkdagen een e-mail met een prijsaanbod',
                'Bij akkoord ontvang je gratis verzendlabels',
                'Na ontvangst en controle wordt het bedrag uitbetaald',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-copper to-gold mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-700">
            <Link href={`/tracking?ref=${referenceNumber}`}>
              <Button variant="outline" size="lg" className="gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Volg je inlevering
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="gap-3">
                Terug naar home
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
