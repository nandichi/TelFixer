import Link from 'next/link';
import { Container } from './container';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Telefoons', href: '/producten?categorie=telefoons' },
    { name: 'Laptops', href: '/producten?categorie=laptops' },
    { name: 'Tablets', href: '/producten?categorie=tablets' },
    { name: 'Accessoires', href: '/producten?categorie=accessoires' },
  ],
  services: [
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
    <footer className="bg-[#2C3E48] text-white">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold text-white">TelFixer</span>
              </Link>
              <p className="mt-4 text-gray-300 text-sm leading-relaxed max-w-md">
                TelFixer is jouw betrouwbare partner voor hoogwaardige refurbished 
                elektronica. Wij bieden kwalitatief gecontroleerde telefoons, laptops 
                en tablets tegen aantrekkelijke prijzen, allemaal met garantie.
              </p>
              
              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <a
                  href="mailto:info@telfixer.nl"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>info@telfixer.nl</span>
                </a>
                <a
                  href="tel:+31201234567"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>+31 20 123 4567</span>
                </a>
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Voorbeeldstraat 123<br />1234 AB Amsterdam</span>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Shop
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Services
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Bedrijf
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              {currentYear} TelFixer. Alle rechten voorbehouden.
            </p>
            <div className="flex items-center gap-6">
              {/* Payment Icons - placeholder text for now */}
              <span className="text-xs text-gray-400">
                iDEAL | Visa | Mastercard | PayPal
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
