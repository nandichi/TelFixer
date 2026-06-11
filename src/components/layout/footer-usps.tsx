'use client';

import { usePathname } from 'next/navigation';
import { ShieldCheck, Truck, RotateCcw, BadgeCheck, MapPin } from 'lucide-react';
import { Container } from './container';

const footerUsps = [
  { icon: ShieldCheck, text: '12 maanden garantie op toestellen' },
  { icon: Truck, text: 'Gratis verzending vanaf 50 euro' },
  { icon: MapPin, text: 'Gratis ophaal- en brengdienst (15 km)' },
  { icon: RotateCcw, text: '14 dagen bedenktijd' },
  { icon: BadgeCheck, text: 'Getest en gereinigd' },
];

// De balk gaat over de verkoop van toestellen (garantie, verzending,
// bedenktijd). Op de reparatiepagina is dat niet van toepassing, dus daar
// verbergen we de balk.
const hiddenOn = ['/reparatie'];

export function FooterUsps() {
  const pathname = usePathname();

  if (hiddenOn.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <div className="border-b border-sand">
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-3 py-5 sm:py-6">
          {footerUsps.map((usp) => (
            <li key={usp.text} className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white text-primary shrink-0 border border-sand">
                <usp.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.75} />
              </span>
              <span className="text-xs sm:text-sm font-medium text-soft-black leading-snug">
                {usp.text}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
