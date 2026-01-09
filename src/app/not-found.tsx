import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center py-24 bg-cream">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          {/* 404 Text */}
          <div className="relative mb-8">
            <span className="text-[180px] lg:text-[220px] font-display font-bold text-sand leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: 'var(--shadow-lg)' }}>
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-soft-black mb-4 animate-fade-in-up">
            Pagina niet gevonden
          </h1>
          
          <p className="text-muted mb-10 animate-fade-in-up delay-100">
            Sorry, de pagina die je zoekt bestaat niet of is verplaatst.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Naar homepage
              </Button>
            </Link>
            <Link href="/producten">
              <Button variant="outline" size="lg" className="gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Bekijk producten
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
