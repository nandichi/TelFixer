'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const faqCategories = [
  {
    name: 'Refurbished producten',
    questions: [
      {
        q: 'Wat betekent refurbished?',
        a: 'Refurbished betekent dat een product is gecontroleerd, gerepareerd indien nodig, en grondig schoongemaakt. Alle refurbished producten bij TelFixer worden getest op 50+ punten en komen met garantie.',
      },
      {
        q: 'Wat is het verschil tussen de conditie grades?',
        a: 'Als nieuw: Nauwelijks of geen zichtbare gebruikssporen. Zeer goed: Minimale gebruikssporen, nauwelijks zichtbaar. Goed: Lichte gebruikssporen zichtbaar. Sterk gebruikt: Duidelijke gebruikssporen, maar volledig functioneel.',
      },
      {
        q: 'Hoeveel garantie krijg ik?',
        a: 'Alle refurbished producten komen met 12 maanden garantie. Accessoires hebben 6 maanden garantie.',
      },
      {
        q: 'Is de batterij ook getest?',
        a: 'Ja, bij telefoons en laptops controleren we de batterijconditie. Telefoons hebben minimaal 80% batterijcapaciteit, laptops minder dan 100 laadcycli (tenzij anders vermeld).',
      },
    ],
  },
  {
    name: 'Bestellen & Betalen',
    questions: [
      {
        q: 'Welke betaalmethodes accepteren jullie?',
        a: 'We accepteren iDEAL, creditcard (Visa, Mastercard, American Express) en PayPal.',
      },
      {
        q: 'Hoe lang duurt de levering?',
        a: 'Bestellingen worden binnen 2-4 werkdagen geleverd. Je ontvangt een track & trace code zodra je bestelling is verzonden.',
      },
      {
        q: 'Zijn er verzendkosten?',
        a: 'Verzending kost 6,95 euro. Bij bestellingen vanaf 50 euro is verzending gratis.',
      },
      {
        q: 'Kan ik mijn bestelling annuleren?',
        a: 'Ja, je kunt je bestelling annuleren zolang deze nog niet is verzonden. Neem contact op met onze klantenservice.',
      },
    ],
  },
  {
    name: 'Retourneren',
    questions: [
      {
        q: 'Kan ik mijn aankoop retourneren?',
        a: 'Ja, je hebt 30 dagen bedenktijd. Het product moet in originele staat zijn en onbeschadigd. Neem contact op voor een retourlabel.',
      },
      {
        q: 'Hoe werkt het retourproces?',
        a: 'Neem contact op met onze klantenservice. Je ontvangt een gratis retourlabel. Na ontvangst en controle wordt het aankoopbedrag binnen 5 werkdagen teruggestort.',
      },
      {
        q: 'Wat als mijn product defect is?',
        a: 'Bij defecten binnen de garantieperiode repareren of vervangen wij het product gratis. Neem contact op met ons voor een oplossing.',
      },
    ],
  },
  {
    name: 'Inleveren & Verkopen',
    questions: [
      {
        q: 'Hoe werkt apparaat inleveren?',
        a: 'Vul het inleverformulier in met details over je apparaat. Binnen 2 werkdagen ontvang je een prijsaanbod. Bij akkoord ontvang je gratis verzendlabels.',
      },
      {
        q: 'Welke apparaten kunnen jullie inkopen?',
        a: 'We kopen telefoons, laptops en tablets in van populaire merken zoals Apple, Samsung, Google, Lenovo en meer.',
      },
      {
        q: 'Hoe wordt de prijs bepaald?',
        a: 'De prijs hangt af van het model, de conditie, en de huidige marktwaarde. Je krijgt altijd een eerlijk en transparant aanbod.',
      },
      {
        q: 'Hoe word ik uitbetaald?',
        a: 'Na ontvangst en goedkeuring van je apparaat wordt het bedrag binnen 3 werkdagen overgemaakt naar je bankrekening.',
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

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <div className="px-4 pb-4">
                          <p className="text-gray-600">{item.a}</p>
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
                Geen vragen gevonden voor "{searchQuery}"
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
