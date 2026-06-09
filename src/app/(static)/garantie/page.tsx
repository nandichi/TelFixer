import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  LifeBuoy,
  ArrowRight,
  Mail,
  Tag,
  PackageCheck,
  Banknote,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { getWarrantySettings } from '@/lib/supabase/settings';

export const metadata: Metadata = {
  title: 'Garantie & Retourbeleid',
  description:
    'Informatie over garantie, retourneren en reparaties bij TelFixer.',
};

function formatTerm(months: number): string {
  if (months <= 0) return '-';
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 jaar' : `${years} jaar`;
  }
  return months === 1 ? '1 maand' : `${months} maanden`;
}

const covered = [
  'Defecte componenten (scherm, batterij, etc.)',
  'Software problemen veroorzaakt door ons',
  'Fabricagefouten',
  'Verborgen gebreken',
];

const notCovered = [
  'Schade door vallen, stoten of water',
  'Ongeautoriseerde reparaties',
  'Normale slijtage',
  'Schade door verkeerd gebruik',
];

const returnConditions = [
  'Product is in originele staat en onbeschadigd',
  'Alle accessoires en verpakking zijn aanwezig',
  'Product is uitgelogd van alle accounts (iCloud, Google, etc.)',
];

const returnSteps = [
  {
    icon: Mail,
    title: 'Neem contact op',
    description: 'Stuur een e-mail naar info@telfixer.nl met je ordernummer en reden',
  },
  {
    icon: Tag,
    title: 'Ontvang retourlabel',
    description: 'Je ontvangt een gratis retourlabel per e-mail',
  },
  {
    icon: PackageCheck,
    title: 'Verstuur het product',
    description: 'Verpak het product goed en lever het af bij een PostNL punt',
  },
  {
    icon: Banknote,
    title: 'Terugbetaling',
    description: 'Na ontvangst en controle wordt het bedrag binnen 5 werkdagen teruggestort',
  },
];

const claimSteps = [
  'Mail info@telfixer.nl met je ordernummer en een omschrijving van het defect.',
  'Stuur foto\u2019s of video\u2019s mee van het probleem zodat we snel kunnen beoordelen.',
  'Je ontvangt een gratis verzendlabel. Na controle kiezen we voor reparatie, vervanging of terugbetaling.',
];

export default async function WarrantyPage() {
  const warranty = await getWarrantySettings();

  const warrantyRows = [
    { label: 'Refurbished telefoons', months: warranty.phones_months },
    { label: 'Refurbished laptops', months: warranty.laptops_months },
    { label: 'Refurbished tablets', months: warranty.tablets_months },
    { label: 'Reparaties', months: warranty.repairs_months },
    { label: 'Accessoires (nieuw)', months: warranty.accessories_new_months },
    {
      label: 'Accessoires (gebruikt)',
      months: warranty.accessories_used_months,
    },
    { label: 'Nieuwe apparaten', months: warranty.new_devices_months },
  ];

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-copper/5 blur-3xl" />
        </div>
        <Container>
          <Reveal className="relative max-w-2xl mx-auto text-center">
            <span className="inline-block text-eyebrow mb-4">
              Garantie & Retour
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-soft-black leading-[1.06] tracking-tight">
              Koop met{' '}
              <em className="not-italic text-gradient-primary">vertrouwen</em>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-slate leading-relaxed">
              Bij TelFixer koop je met vertrouwen. Lees hier alles over onze
              garantie en ons retourbeleid.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container>
        <div className="max-w-4xl mx-auto pb-16 sm:pb-20 lg:pb-28 space-y-12 sm:space-y-16">
          {/* Garantie */}
          <section>
            <Reveal className="flex items-center gap-4 mb-6 sm:mb-8">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 shrink-0">
                <ShieldCheck className="h-6 w-6 text-primary" strokeWidth={1.75} />
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-soft-black">
                Garantie
              </h2>
            </Reveal>

            <Reveal>
              <div className="bg-white rounded-3xl border border-sand p-5 sm:p-8 mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h3 className="text-lg font-display font-semibold text-soft-black mb-4">
                  Garantietermijnen
                </h3>
                <div>
                  {warrantyRows.map((row, idx) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between gap-4 py-3.5 ${
                        idx < warrantyRows.length - 1 ? 'border-b border-sand' : ''
                      }`}
                    >
                      <span className="text-sm sm:text-base text-slate">{row.label}</span>
                      <span className="font-semibold text-primary whitespace-nowrap">
                        {formatTerm(row.months)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <RevealGroup className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <RevealItem className="rounded-3xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-7">
                <h3 className="font-display font-semibold text-primary mb-4 flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white shrink-0">
                    <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
                  </span>
                  Wel gedekt door garantie
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-slate">
                  {covered.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-1" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealItem>

              <RevealItem className="rounded-3xl border border-[#DC2626]/15 bg-[#DC2626]/[0.03] p-5 sm:p-7">
                <h3 className="font-display font-semibold text-[#B91C1C] mb-4 flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#DC2626] text-white shrink-0">
                    <X className="h-4.5 w-4.5" strokeWidth={2.5} />
                  </span>
                  Niet gedekt door garantie
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-slate">
                  {notCovered.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <X className="h-4 w-4 text-[#DC2626] shrink-0 mt-1" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </RevealGroup>
          </section>

          {/* Retourbeleid */}
          <section>
            <Reveal className="flex items-center gap-4 mb-6 sm:mb-8">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 shrink-0">
                <RotateCcw className="h-6 w-6 text-primary" strokeWidth={1.75} />
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-soft-black">
                Retourbeleid
              </h2>
            </Reveal>

            <Reveal>
              <div className="bg-white rounded-3xl border border-sand p-5 sm:p-8 mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h3 className="text-lg font-display font-semibold text-soft-black mb-3">
                  14 dagen bedenktijd
                </h3>
                <p className="text-slate mb-5 leading-relaxed">
                  Je hebt 14 dagen bedenktijd na ontvangst van je bestelling.
                  Binnen deze periode kun je het product zonder opgaaf van reden
                  retourneren.
                </p>

                <h4 className="font-semibold text-soft-black mb-3">Voorwaarden:</h4>
                <ul className="space-y-2.5 text-sm sm:text-base text-slate">
                  {returnConditions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-1" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-white rounded-3xl border border-sand p-5 sm:p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h3 className="text-lg font-display font-semibold text-soft-black mb-6">
                  Hoe retourneer ik?
                </h3>
                <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  {returnSteps.map((step, idx) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/5 shrink-0">
                        <step.icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-copper text-white text-[10px] font-bold">
                          {idx + 1}
                        </span>
                      </span>
                      <div>
                        <p className="font-semibold text-soft-black">{step.title}</p>
                        <p className="text-sm text-muted leading-relaxed mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </section>

          {/* Garantie claimen */}
          <Reveal>
            <section className="relative overflow-hidden rounded-3xl bg-soft-black p-6 sm:p-10">
              <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
                <div className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full bg-copper/15 blur-3xl" />
              </div>

              <div className="relative flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/15 shrink-0">
                  <LifeBuoy className="h-6 w-6 sm:h-7 sm:w-7 text-copper-light" strokeWidth={1.5} />
                </span>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                    Garantie claimen?
                  </h2>
                  <p className="text-on-dark-muted mb-6 leading-relaxed">
                    Als je product binnen de garantieperiode defect raakt,
                    doorloop dan deze stappen:
                  </p>
                  <ol className="space-y-3.5 mb-8">
                    {claimSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-3.5 text-sm sm:text-base text-white/80">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-copper text-white font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-soft-black font-semibold transition-all duration-300 hover:bg-cream hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Contact opnemen
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>

          {/* CTA */}
          <Reveal>
            <section className="text-center bg-white rounded-3xl border border-sand p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-soft-black mb-3">
                Vragen over garantie of retourneren?
              </h2>
              <p className="text-muted mb-8 max-w-lg mx-auto">
                Onze klantenservice helpt je graag. Neem contact op via e-mail
                of telefoon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Contact opnemen
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Bekijk FAQ
                  </Button>
                </Link>
              </div>
            </section>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
