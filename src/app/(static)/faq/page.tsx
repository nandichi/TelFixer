'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FaqItem {
  q: string;
  a: ReactNode;
  /** Plain-text fallback for search matching */
  searchText: string;
}

interface FaqCategory {
  name: string;
  questions: FaqItem[];
}

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
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <span className="font-medium text-[#2C3E48]">Als nieuw:</span>{' '}
              nauwelijks of geen zichtbare gebruikssporen.
            </li>
            <li>
              <span className="font-medium text-[#2C3E48]">Zeer goed:</span>{' '}
              minimale gebruikssporen, nauwelijks zichtbaar.
            </li>
            <li>
              <span className="font-medium text-[#2C3E48]">Goed:</span> lichte
              gebruikssporen zichtbaar.
            </li>
            <li>
              <span className="font-medium text-[#2C3E48]">Sterk gebruikt:</span>{' '}
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
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Refurbished apparaten: 6 maanden garantie.</li>
            <li>Accessoires en nieuwe apparaten: 2 jaar garantie.</li>
          </ul>
        ),
        searchText:
          'Refurbished 6 maanden garantie accessoires nieuwe apparaten 2 jaar',
      },
      {
        q: 'Is de batterij ook getest?',
        a: (
          <p>
            Ja, bij telefoons en laptops controleren we de batterijconditie.
            Telefoons hebben minimaal 85% batterijcapaciteit en laptops minder
            dan 250 laadcycli (tenzij anders vermeld).
          </p>
        ),
        searchText:
          'batterij getest telefoons 85% batterijcapaciteit laptops 250 laadcycli',
      },
    ],
  },
  {
    name: 'Bestellen & Betalen',
    questions: [
      {
        q: 'Welke betaalmethodes accepteren jullie?',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
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
            werkdagen ontvang je een prijsaanbod. Bij akkoord ontvang je gratis
            verzendlabels.
          </p>
        ),
        searchText:
          'apparaat inleveren formulier 2 werkdagen prijsaanbod gratis verzendlabels',
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

export default function FAQPage() {
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
    <div className="py-12 lg:py-16">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E48] mb-4">
            Veelgestelde Vragen
          </h1>
          <p className="text-gray-600 mb-8">
            Vind antwoorden op de meest gestelde vragen over TelFixer
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Zoek in veelgestelde vragen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h2 className="text-xl font-semibold text-[#2C3E48] mb-4">
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item, index) => {
                  const questionId = `${category.name}-${index}`;
                  const isOpen = openQuestions.has(questionId);

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(questionId)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="font-medium text-[#2C3E48] pr-4">
                          {item.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-gray-600">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Geen vragen gevonden voor &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <MessageCircle className="h-12 w-12 text-[#094543] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C3E48] mb-2">
            Vraag niet gevonden?
          </h2>
          <p className="text-gray-600 mb-6">
            Neem gerust contact met ons op. We helpen je graag verder.
          </p>
          <Link href="/contact">
            <Button>Contact opnemen</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
