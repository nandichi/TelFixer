import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  Heart,
  Award,
  Target,
  MapPin,
  GraduationCap,
  Wrench,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { getAboutStatsSettings } from '@/lib/supabase/settings';

export const metadata: Metadata = {
  title: 'Over Ons',
  description:
    'Leer meer over TelFixer - vakkundig gerepareerde telefoons die een tweede leven krijgen. Gevestigd in Ede, Gelderland.',
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Kwaliteit',
    description:
      'Elk apparaat wordt gerepareerd, getest en gereinigd. We leveren alleen producten waar we volledig achter staan.',
  },
  {
    icon: Leaf,
    title: 'Duurzaamheid',
    description:
      'Door een gerepareerde telefoon te kiezen, geef je elektronica een tweede leven en verminder je e-waste.',
  },
  {
    icon: Heart,
    title: 'Eerlijkheid',
    description:
      'Transparante prijzen, eerlijke inruilwaarden en heldere communicatie. Wat je ziet is wat je krijgt.',
  },
  {
    icon: Award,
    title: 'Garantie',
    description:
      'Al onze producten komen met minimaal 6 maanden garantie. Je koopt met vertrouwen.',
  },
];

const ivanFacts = [
  { icon: MapPin, label: 'Locatie', value: 'Ede, Gelderland' },
  { icon: GraduationCap, label: 'Opleiding', value: 'Technische Bedrijfskunde - HAN' },
  { icon: Wrench, label: 'Expertise', value: 'Elektronicareparatie & Operations' },
  { icon: Award, label: 'Certificering', value: 'VCA VOL gecertificeerd' },
];

export default async function AboutPage() {
  const aboutStats = await getAboutStatsSettings();
  const stats = [
    { value: aboutStats.customers, label: 'Tevreden klanten' },
    { value: aboutStats.phones_sold, label: 'Telefoons verkocht' },
    { value: aboutStats.devices_repaired, label: 'Apparaten gerepareerd' },
    { value: aboutStats.satisfaction, label: 'Klanttevredenheid' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-copper/5 blur-3xl" />
        </div>
        <Container>
          <Reveal className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block text-eyebrow mb-4">
              Over ons
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-soft-black leading-[1.06] tracking-tight">
              Vakmanschap met een{' '}
              <em className="not-italic text-gradient-primary">missie</em>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-slate leading-relaxed max-w-2xl mx-auto">
              Vakkundig gerepareerde telefoons die een tweede leven krijgen.
              Gevestigd in Ede, Gelderland.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Verhaal en missie */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal direction="left">
              <span className="inline-block text-eyebrow mb-4">
                Ons verhaal
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-soft-black mb-6">
                Persoonlijke aandacht voor elk toestel
              </h2>
              <div className="space-y-4 text-slate leading-relaxed">
                <p>
                  TelFixer is het verhaal van Ivan Politin, een gepassioneerde
                  telefoonreparateur uit Ede, Gelderland. Ivan zag hoe elk jaar
                  miljoenen perfect bruikbare telefoons worden weggegooid,
                  terwijl nieuwe toestellen steeds duurder worden.
                </p>
                <p>
                  Met jarenlange ervaring in het repareren van telefoons besloot
                  Ivan om deze apparaten een tweede leven te geven. Geen massale
                  refurbish-fabriek, maar persoonlijke aandacht voor elk toestel
                  dat door zijn handen gaat.
                </p>
                <p>
                  Vanuit zijn werkplaats in Ede repareert Ivan elke telefoon met
                  vakmanschap en zorg. Elk apparaat wordt grondig getest voordat
                  het een nieuwe eigenaar krijgt. Zo combineren we betaalbare
                  technologie met duurzaamheid.
                </p>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-soft-black p-8 sm:p-10 lg:p-12">
                <div className="absolute inset-0" aria-hidden="true">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
                  <div className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full bg-primary/25 blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-[280px] h-[280px] rounded-full bg-copper/10 blur-3xl" />
                </div>
                <div className="relative text-center">
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
                    <Target className="h-8 w-8 text-copper-light" strokeWidth={1.5} />
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                    Onze missie
                  </h3>
                  <p className="text-base sm:text-lg text-on-dark-muted leading-relaxed">
                    Elke telefoon verdient een tweede kans. Door vakkundig te
                    repareren maken we kwaliteit betaalbaar en dragen we bij aan
                    een duurzamere wereld, een telefoon tegelijk.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Waarden */}
      <section className="py-16 sm:py-20 lg:py-28 bg-cream">
        <Container>
          <Reveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-eyebrow mb-4">
              Onze waarden
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Waar wij voor staan
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Deze kernwaarden sturen alles wat we doen bij TelFixer
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12 lg:gap-y-0 lg:divide-x lg:divide-sand">
            {values.map((value) => (
              <RevealItem key={value.title} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 text-primary mb-5">
                  <value.icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-xl font-display font-semibold text-soft-black mb-2.5">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  {value.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Statistieken */}
      <section className="relative overflow-hidden bg-soft-black py-16 sm:py-20">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
          <div className="absolute top-0 left-1/3 w-[420px] h-[420px] rounded-full bg-primary/20 blur-3xl" />
        </div>
        <Container>
          <RevealGroup className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {stats.map((stat) => (
              <RevealItem key={stat.label} className="text-center">
                <p className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-on-dark-subtle">{stat.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* De vakman */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <Container>
          <Reveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-eyebrow mb-4">
              De vakman
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Het gezicht achter TelFixer
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Een gepassioneerde ondernemer en reparateur die elke telefoon met
              zorg behandelt
            </p>
          </Reveal>

          <Reveal className="max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-3xl lg:rounded-[2.5rem] border border-sand bg-white" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <div className="grid md:grid-cols-5">
                {/* Foto kolom */}
                <div className="relative md:col-span-2 overflow-hidden bg-soft-black p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
                    <div className="absolute -top-20 -right-20 w-[260px] h-[260px] rounded-full bg-primary/25 blur-3xl" />
                  </div>

                  <div className="relative">
                    <div
                      className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white/15 shadow-xl mb-6 mx-auto flex items-center justify-center"
                      style={
                        aboutStats.ivan_photo_url
                          ? undefined
                          : {
                              background:
                                'linear-gradient(135deg, #B8946A 0%, #D4A574 50%, #E2B887 100%)',
                            }
                      }
                      aria-label="Ivan Politin - Oprichter TelFixer"
                    >
                      {aboutStats.ivan_photo_url ? (
                        <Image
                          src={aboutStats.ivan_photo_url}
                          alt="Ivan Politin - Oprichter TelFixer"
                          fill
                          sizes="192px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-5xl sm:text-6xl font-display font-bold text-white drop-shadow-md select-none">
                          IP
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      Ivan Politin
                    </h3>
                    <p className="text-copper-light font-medium mb-5">
                      Oprichter & Telefoonreparateur
                    </p>
                    <a
                      href="https://www.linkedin.com/in/ivan-politin-333339309/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white text-sm transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Bekijk LinkedIn
                      <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
                    </a>
                  </div>
                </div>

                {/* Info kolom */}
                <div className="md:col-span-3 p-6 sm:p-8 lg:p-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-display font-semibold text-soft-black mb-3">
                        Over Ivan
                      </h4>
                      <p className="text-slate leading-relaxed">
                        Ivan Politin (21) is een jonge ondernemer uit Ede met een
                        passie voor technologie en duurzaamheid. Naast zijn studie
                        Technische Bedrijfskunde aan de HAN in Arnhem runt hij
                        TelFixer, waar hij telefoons vakkundig repareert en een
                        tweede leven geeft.
                      </p>
                    </div>

                    <p className="text-slate leading-relaxed">
                      Met ervaring in sales, logistiek en klantcontact combineert
                      Ivan ondernemerschap met analytisch denkvermogen. Hij werkt
                      voortdurend aan het optimaliseren van processen en ziet snel
                      kansen voor verbetering.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      {ivanFacts.map((fact) => (
                        <div key={fact.label} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 shrink-0">
                            <fact.icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                          </span>
                          <div>
                            <p className="font-medium text-soft-black">{fact.label}</p>
                            <p className="text-sm text-muted">{fact.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-sand">
                      <p className="text-sm text-muted italic leading-relaxed">
                        &quot;Ik krijg energie van het verbeteren van processen. Ik
                        zie snel kansen en werk goed onder druk. Altijd op zoek
                        naar slimme ideeen en verbeteringen.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-soft-black py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#063835] to-[#04201f]" />
          <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] rounded-full bg-copper/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full bg-primary/25 blur-3xl" />
        </div>
        <Container>
          <Reveal className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Klaar om te{' '}
              <em className="not-italic text-gradient-copper">beginnen</em>?
            </h2>
            <p className="text-lg text-on-dark-muted mb-10">
              Ontdek onze collectie gerepareerde telefoons of lever je oude
              apparaat in
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/producten"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-soft-black text-lg font-semibold transition-all duration-300 hover:bg-cream hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
              >
                Bekijk producten
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/inleveren"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/25 text-white text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/40 active:scale-[0.98]"
              >
                Apparaat inleveren
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
