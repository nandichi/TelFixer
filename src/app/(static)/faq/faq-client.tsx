'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

interface WarrantyTerms {
  phones: string;
  laptops: string;
  tablets: string;
  accessories_new: string;
  accessories_used: string;
  new_devices: string;
  repairs: string;
}

interface FaqClientProps {
  warrantyTerms: WarrantyTerms;
  batteryMin: number;
  laptopCycles: number;
}

interface FaqItem {
  q: string;
  a: ReactNode;
  searchText: string;
}

interface FaqCategory {
  name: string;
  questions: FaqItem[];
}

export function FaqClient({
  warrantyTerms,
  batteryMin,
  laptopCycles,
}: FaqClientProps) {
  const shouldReduceMotion = useReducedMotion();

  const faqCategories: FaqCategory[] = [
    {
      name: 'Refurbished producten',
      questions: [
        {
          q: 'Wat betekent refurbished?',
          a: (
            <p>
              Refurbished betekent dat een product is gecontroleerd, gerepareerd
              indien nodig, en grondig schoongemaakt. Alle refurbished producten
              bij TelFixer worden getest en komen met garantie.
            </p>
          ),
          searchText:
            'Refurbished betekent dat een product is gecontroleerd, gerepareerd indien nodig, en grondig schoongemaakt. Alle refurbished producten bij TelFixer worden getest en komen met garantie.',
        },
        {
          q: 'Wat is het verschil tussen de conditie grades?',
          a: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-soft-black">Als nieuw:</span>{' '}
                nauwelijks of geen zichtbare gebruikssporen.
              </li>
              <li>
                <span className="font-medium text-soft-black">Zeer goed:</span>{' '}
                minimale gebruikssporen, nauwelijks zichtbaar.
              </li>
              <li>
                <span className="font-medium text-soft-black">Goed:</span> lichte
                gebruikssporen zichtbaar.
              </li>
              <li>
                <span className="font-medium text-soft-black">Sterk gebruikt:</span>{' '}
                duidelijke gebruikssporen, maar volledig functioneel.
              </li>
            </ul>
          ),
          searchText:
            'Als nieuw Zeer goed Goed Sterk gebruikt conditie grades',
        },
        {
          q: 'Hoeveel garantie krijg ik?',
          a: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Refurbished telefoons: {warrantyTerms.phones} garantie.</li>
              <li>Refurbished laptops: {warrantyTerms.laptops} garantie.</li>
              <li>Refurbished tablets: {warrantyTerms.tablets} garantie.</li>
              <li>Reparaties: {warrantyTerms.repairs} garantie.</li>
              <li>
                Accessoires (nieuw): {warrantyTerms.accessories_new} garantie.
              </li>
              <li>
                Accessoires (gebruikt): {warrantyTerms.accessories_used} garantie.
              </li>
              <li>Nieuwe apparaten: {warrantyTerms.new_devices} garantie.</li>
            </ul>
          ),
          searchText: `garantie refurbished telefoons ${warrantyTerms.phones} laptops ${warrantyTerms.laptops} tablets ${warrantyTerms.tablets} reparaties ${warrantyTerms.repairs} accessoires nieuw ${warrantyTerms.accessories_new} gebruikt ${warrantyTerms.accessories_used} nieuwe apparaten ${warrantyTerms.new_devices}`,
        },
        {
          q: 'Is de batterij ook getest?',
          a: (
            <p>
              Ja, bij telefoons en laptops controleren we de batterijconditie.
              Telefoons hebben minimaal {batteryMin}% batterijcapaciteit en
              laptops minder dan {laptopCycles} laadcycli (tenzij anders
              vermeld).
            </p>
          ),
          searchText: `batterij getest telefoons ${batteryMin}% batterijcapaciteit laptops ${laptopCycles} laadcycli`,
        },
      ],
    },
    {
      name: 'Bestellen & Betalen',
      questions: [
        {
          q: 'Welke betaalmethodes accepteren jullie?',
          a: (
            <ul className="list-disc pl-5 space-y-1">
              <li>iDEAL</li>
              <li>Creditcard (Visa, Mastercard, American Express)</li>
              <li>Klarna (achteraf betalen of gespreid)</li>
              <li>Bankafschrift (handmatige overboeking)</li>
            </ul>
          ),
          searchText:
            'Betaalmethodes iDEAL creditcard Visa Mastercard American Express Klarna bankafschrift',
        },
        {
          q: 'Hoe lang duurt de levering?',
          a: (
            <p>
              Je bestelling wordt zo snel mogelijk verzonden. Je ontvangt een track
              &amp; trace code zodra je bestelling is verzonden.
            </p>
          ),
          searchText:
            'levering zo snel mogelijk verzonden track trace code',
        },
        {
          q: 'Zijn er verzendkosten?',
          a: (
            <p>
              Verzending kost &euro;6,95. Bij bestellingen vanaf &euro;50 is
              verzending gratis.
            </p>
          ),
          searchText:
            'Verzendkosten 6,95 euro gratis bestellingen vanaf 50',
        },
        {
          q: 'Kan ik mijn bestelling annuleren?',
          a: (
            <p>
              Ja, je kunt je bestelling annuleren zolang deze nog niet is
              verzonden.
              <br />
              Neem contact op met onze klantenservice.
            </p>
          ),
          searchText:
            'bestelling annuleren klantenservice nog niet verzonden',
        },
      ],
    },
    {
      name: 'Retourneren',
      questions: [
        {
          q: 'Kan ik mijn aankoop retourneren?',
          a: (
            <p>
              Ja, je hebt 14 dagen bedenktijd. Het product moet in originele staat
              zijn en onbeschadigd. Neem contact op voor een retourlabel.
            </p>
          ),
          searchText:
            'retourneren 14 dagen bedenktijd originele staat retourlabel',
        },
        {
          q: 'Hoe werkt het retourproces?',
          a: (
            <p>
              Neem contact op met onze klantenservice. Je ontvangt een gratis
              retourlabel. Na ontvangst en controle wordt het aankoopbedrag binnen
              5 werkdagen teruggestort.
            </p>
          ),
          searchText:
            'retourproces klantenservice gratis retourlabel 5 werkdagen teruggestort',
        },
        {
          q: 'Wat als mijn product defect is?',
          a: (
            <p>
              Bij defecten binnen de garantieperiode repareren of vervangen wij
              het product gratis. Neem contact op voor een oplossing.
            </p>
          ),
          searchText:
            'product defect garantieperiode repareren vervangen gratis',
        },
      ],
    },
    {
      name: 'Inleveren & Verkopen',
      questions: [
        {
          q: 'Hoe werkt apparaat inleveren?',
          a: (
            <p>
              Vul het inleverformulier in met details over je apparaat. Binnen 2
              werkdagen ontvang je een prijsaanbod per e-mail en WhatsApp. Bij
              akkoord ontvang je gratis verzendlabels.
            </p>
          ),
          searchText:
            'apparaat inleveren formulier 2 werkdagen prijsaanbod WhatsApp gratis verzendlabels',
        },
        {
          q: 'Welke apparaten kunnen jullie inkopen?',
          a: (
            <p>
              We kopen telefoons, laptops en tablets in van populaire merken zoals
              Apple, Samsung, Google, Lenovo en meer.
            </p>
          ),
          searchText:
            'apparaten inkopen telefoons laptops tablets Apple Samsung Google Lenovo',
        },
        {
          q: 'Hoe wordt de prijs bepaald?',
          a: (
            <p>
              De prijs hangt af van het model, de conditie en de huidige
              marktwaarde. Je krijgt altijd een eerlijk en transparant aanbod.
            </p>
          ),
          searchText:
            'prijs bepaald model conditie marktwaarde eerlijk transparant',
        },
        {
          q: 'Hoe word ik uitbetaald?',
          a: (
            <p>
              Na ontvangst en goedkeuring van je apparaat wordt het bedrag binnen
              3 werkdagen overgemaakt naar je bankrekening.
            </p>
          ),
          searchText:
            'uitbetaald 3 werkdagen overgemaakt bankrekening',
        },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(questionId)) {
      newOpen.delete(questionId);
    } else {
      newOpen.add(questionId);
    }
    setOpenQuestions(newOpen);
  };

  const query = searchQuery.toLowerCase();
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(query) ||
          q.searchText.toLowerCase().includes(query)
      ),
    }))
    .filter((category) => category.questions.length > 0);

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
              FAQ
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-soft-black leading-[1.06] tracking-tight">
              Veelgestelde{' '}
              <em className="not-italic text-gradient-primary">vragen</em>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-slate leading-relaxed mb-10">
              Vind antwoorden op de meest gestelde vragen over TelFixer
            </p>

            {/* Zoekveld */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Zoek in veelgestelde vragen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-13 pl-12 pr-4 rounded-2xl bg-white border border-sand text-soft-black placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Vragen */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
            {filteredCategories.map((category) => (
              <Reveal key={category.name}>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-soft-black mb-4 sm:mb-5">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, index) => {
                    const questionId = `${category.name}-${index}`;
                    const isOpen = openQuestions.has(questionId);

                    return (
                      <div
                        key={index}
                        className={cn(
                          'bg-white rounded-2xl border overflow-hidden transition-colors duration-200',
                          isOpen ? 'border-primary/30' : 'border-sand'
                        )}
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                          aria-expanded={isOpen}
                        >
                          <span className="font-medium text-soft-black">
                            {item.q}
                          </span>
                          <span
                            className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-300',
                              isOpen
                                ? 'bg-primary text-white rotate-180'
                                : 'bg-cream text-muted'
                            )}
                          >
                            <ChevronDown className="h-4.5 w-4.5" strokeWidth={2} />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                              animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-5 pb-5 text-slate leading-relaxed">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-sand">
                <p className="text-muted">
                  Geen vragen gevonden voor &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <Reveal className="max-w-3xl mx-auto mt-12 sm:mt-16">
            <div className="relative overflow-hidden rounded-3xl bg-soft-black p-8 sm:p-12 text-center">
              <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
                <div className="absolute -top-24 right-1/4 w-[320px] h-[320px] rounded-full bg-primary/20 blur-3xl" />
              </div>
              <div className="relative">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/15 mb-5">
                  <MessageCircle className="h-7 w-7 text-copper-light" strokeWidth={1.5} />
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                  Vraag niet gevonden?
                </h2>
                <p className="text-on-dark-muted mb-8">
                  Neem gerust contact met ons op. We helpen je graag verder.
                </p>
                <Link href="/contact">
                  <Button size="lg" variant="secondary">
                    Contact opnemen
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
