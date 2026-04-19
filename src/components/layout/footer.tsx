import Link from 'next/link';
import Image from 'next/image';
import { Container } from './container';

const company = {
  kvk: '99703645',
  btw: 'NL005404670B51',
  kvkSearchUrl: 'https://www.kvk.nl/zoeken/?q=99703645',
} as const;

/** Afmetingen uit de officiële SVG (Currence CDN, zelfde asset als op ideal.nl). */
const paymentMethods = [
  {
    src: '/payments/ideal.svg',
    label: 'iDEAL | Wero',
    width: 480,
    height: 182,
    wide: true,
  },
  { src: '/payments/visa.svg', label: 'Visa', width: 24, height: 24, wide: false },
  { src: '/payments/mastercard.svg', label: 'Mastercard', width: 48, height: 32, wide: false },
  { src: '/payments/klarna.svg', label: 'Klarna', width: 24, height: 24, wide: false },
] as const;

const footerLinks = {
  shop: [
    { name: 'Telefoons', href: '/producten?categorie=telefoons' },
    { name: 'Laptops', href: '/producten?categorie=laptops' },
    { name: 'Tablets', href: '/producten?categorie=tablets' },
    { name: 'Accessoires', href: '/producten?categorie=accessoires' },
  ],
  services: [
    { name: 'Reparatie', href: '/reparatie' },
    { name: 'Apparaat Inleveren', href: '/inleveren' },
    { name: 'Status Tracking', href: '/tracking' },
    { name: 'Garantie', href: '/garantie' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'Over Ons', href: '/over-ons' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacybeleid', href: '/privacy' },
    { name: 'Algemene Voorwaarden', href: '/voorwaarden' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-champagne relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary via-copper to-gold" />

      <Container>
        <div className="relative py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-block group">
                <Image
                  src="/telfixer-logo.png"
                  alt="TelFixer"
                  width={160}
                  height={64}
                  className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className="mt-4 sm:mt-6 text-slate text-sm sm:text-base leading-relaxed max-w-md">
                TelFixer is jouw betrouwbare partner voor hoogwaardige refurbished
                elektronica. Wij bieden kwalitatief gecontroleerde telefoons, laptops
                en tablets tegen aantrekkelijke prijzen, allemaal met garantie.
              </p>

              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <a
                  href="mailto:info@telfixer.nl"
                  className="flex items-center gap-4 text-soft-black hover:text-primary transition-colors duration-200 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span>info@telfixer.nl</span>
                </a>
                <a
                  href="tel:+31644642162"
                  className="flex items-center gap-4 text-soft-black hover:text-primary transition-colors duration-200 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span>+31 6 44642162</span>
                </a>
                <div className="flex items-start gap-4 text-soft-black">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span>Houtrakbos 34<br />6718HD, Ede</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                    Shop
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.shop.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-slate hover:text-primary transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                    Services
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.services.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-slate hover:text-primary transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                    Bedrijf
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-slate hover:text-primary transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative py-4 sm:py-6 border-t border-sand">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <p className="text-xs sm:text-sm text-muted">
                © {currentYear} TelFixer. Alle rechten voorbehouden.
              </p>
              <p className="text-xs text-muted leading-relaxed">
                <span className="text-soft-black">KVK: </span>
                <a
                  href={company.kvkSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold underline decoration-gold/80 underline-offset-2 hover:text-primary hover:decoration-primary"
                >
                  {company.kvk}
                </a>
                <span className="mx-2 text-sand" aria-hidden>
                  |
                </span>
                <span className="text-soft-black">BTW: </span>
                <span className="tabular-nums">{company.btw}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:items-end">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Veilig betalen met
              </span>
              <ul
                className="flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:gap-3"
                aria-label="Geaccepteerde betaalmethodes"
              >
                {paymentMethods.map((method) => (
                  <li key={method.label}>
                    <div
                      className={
                        method.wide
                          ? 'flex h-9 min-w-28 max-w-36 items-center justify-center rounded-md border border-sand bg-white px-2 py-1.5 shadow-sm sm:h-10 sm:min-w-32 sm:max-w-40'
                          : 'flex h-9 min-w-13 items-center justify-center rounded-md border border-sand bg-white px-2 py-1.5 shadow-sm'
                      }
                    >
                      <Image
                        src={method.src}
                        alt=""
                        width={method.width}
                        height={method.height}
                        className={
                          method.wide
                            ? 'h-5 w-auto max-w-full object-contain object-center sm:h-6'
                            : 'h-5 w-auto max-w-14 object-contain object-center sm:h-6 sm:max-w-none'
                        }
                        aria-hidden
                      />
                      <span className="sr-only">{method.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
