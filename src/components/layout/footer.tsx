import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Container } from './container';
import { FooterUsps } from './footer-usps';

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
    { name: 'Reparatie status', href: '/reparatie-status' },
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

      {/* USP-balk (route-bewust: verborgen op /reparatie) */}
      <FooterUsps />

      <Container>
        <div className="relative py-10 sm:py-14 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-flex group" aria-label="TelFixer home">
                <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border border-sand shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/telfixer-logo.png"
                    alt="TelFixer"
                    width={160}
                    height={160}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                </span>
              </Link>
              <p className="mt-4 sm:mt-6 text-slate text-sm sm:text-base leading-relaxed max-w-md">
                TelFixer is jouw betrouwbare partner voor hoogwaardige refurbished
                elektronica. Wij bieden kwalitatief gecontroleerde telefoons, laptops
                en tablets aan tegen aantrekkelijke prijzen, allemaal met garantie.
              </p>

              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <a
                  href="mailto:info@telfixer.nl"
                  className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-soft-black hover:text-primary transition-colors duration-200 group"
                >
                  <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.75} />
                  </span>
                  <span className="break-all">info@telfixer.nl</span>
                </a>
                <a
                  href="tel:+31644642162"
                  className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-soft-black hover:text-primary transition-colors duration-200 group"
                >
                  <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.75} />
                  </span>
                  <span>+31 6 44642162</span>
                </a>
                <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-soft-black">
                  <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.75} />
                  </span>
                  <span className="leading-relaxed">
                    Houtrakbos 34
                    <br />
                    6718HD, Ede
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 sm:gap-8">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 sm:mb-6">
                    Shop
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {footerLinks.shop.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="inline-block text-sm sm:text-base text-slate hover:text-primary hover:translate-x-0.5 transition-all duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 sm:mb-6">
                    Services
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {footerLinks.services.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="inline-block text-sm sm:text-base text-slate hover:text-primary hover:translate-x-0.5 transition-all duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 sm:mb-6">
                    Bedrijf
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="inline-block text-sm sm:text-base text-slate hover:text-primary hover:translate-x-0.5 transition-all duration-200"
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

        <div className="relative py-5 sm:py-6 border-t border-sand">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2 text-center lg:text-left">
              <p className="text-xs sm:text-sm text-slate">
                © {currentYear} TelFixer. Alle rechten voorbehouden.
              </p>
              <p className="text-xs text-slate leading-relaxed">
                <span className="text-soft-black">KVK: </span>
                <a
                  href={company.kvkSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-light hover:decoration-primary"
                >
                  {company.kvk}
                </a>
                <span className="mx-2 text-sand" aria-hidden>
                  |
                </span>
                <span className="text-soft-black">BTW: </span>
                <span className="tabular-nums text-slate">{company.btw}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 lg:items-end">
              <span className="text-xs font-medium uppercase tracking-wide text-slate">
                Veilig betalen met
              </span>
              <ul
                className="flex flex-wrap items-center justify-center gap-2 lg:justify-end sm:gap-3"
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
