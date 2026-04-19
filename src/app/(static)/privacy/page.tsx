import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Mail, Lock, User, Database, FileText } from 'lucide-react';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Privacyverklaring',
  description:
    'Privacyverklaring van TelFixer - hoe wij omgaan met persoonsgegevens conform de AVG/GDPR.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#094543]/10 mb-6">
            <Shield className="h-8 w-8 text-[#094543]" />
          </div>
          <h1 className="text-4xl font-bold text-[#2C3E48] mb-4">
            Privacyverklaring
          </h1>
          <p className="text-gray-600">
            Laatst bijgewerkt op 19 april 2026. Deze verklaring beschrijft hoe
            TelFixer omgaat met je persoonsgegevens conform de Algemene
            Verordening Gegevensbescherming (AVG).
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <User className="h-6 w-6 text-[#094543]" />
              Wie is de verwerkingsverantwoordelijke?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TelFixer is verantwoordelijk voor de verwerking van
              persoonsgegevens zoals weergegeven in deze privacyverklaring.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Bedrijfsnaam</p>
                <p className="font-semibold text-[#2C3E48]">TelFixer</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Adres</p>
                <p className="font-semibold text-[#2C3E48]">
                  Houtrakbos 34, 6718HD Ede
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">E-mail</p>
                <a
                  href="mailto:info@telfixer.nl"
                  className="font-semibold text-[#094543] hover:underline"
                >
                  info@telfixer.nl
                </a>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Telefoon</p>
                <a
                  href="tel:+31644642162"
                  className="font-semibold text-[#094543] hover:underline"
                >
                  +31 6 44642162
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Database className="h-6 w-6 text-[#094543]" />
              Welke persoonsgegevens verwerken wij?
            </h2>
            <p className="text-gray-700 mb-4">
              Afhankelijk van de dienst die je bij ons afneemt, verwerken wij de
              volgende persoonsgegevens:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Voor- en achternaam, bedrijfsnaam (bij zakelijke bestellingen)
              </li>
              <li>Adresgegevens (straat, huisnummer, postcode, plaats)</li>
              <li>E-mailadres en telefoonnummer</li>
              <li>
                Gegevens over je apparaat (merk, model, type en staat) bij
                inlevering of reparatie
              </li>
              <li>
                Betaal- en factuurgegevens (via Mollie - wij ontvangen geen
                volledige bankgegevens of creditcardgegevens)
              </li>
              <li>
                Bestelgeschiedenis, reparatie- en inlevergeschiedenis
              </li>
              <li>
                Technische gegevens (IP-adres, browsertype, bezochte pagina&apos;s)
                bij gebruik van onze website
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#094543]" />
              Met welk doel en op welke grondslag?
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-[#094543] mb-1">
                  Uitvoering van de overeenkomst
                </h3>
                <p>
                  Om je bestelling, reparatie of inlevering af te handelen,
                  contact met je op te nemen en onze producten en diensten te
                  leveren.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#094543] mb-1">
                  Wettelijke verplichting
                </h3>
                <p>
                  Wij bewaren facturen en administratie voor de wettelijke
                  termijn van 7 jaar (fiscale bewaarplicht).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#094543] mb-1">
                  Gerechtvaardigd belang
                </h3>
                <p>
                  Voor verbetering van onze dienstverlening, fraudepreventie,
                  beveiliging van onze website en het verzenden van
                  servicegerichte e-mails.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#094543] mb-1">
                  Toestemming
                </h3>
                <p>
                  Voor optionele communicatie (zoals nieuwsbrieven) vragen we je
                  uitdrukkelijke toestemming. Deze kun je op ieder moment
                  intrekken.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Hoe lang bewaren wij je gegevens?
            </h2>
            <p className="text-gray-700 mb-4">
              Wij bewaren je persoonsgegevens niet langer dan strikt nodig is om
              de doelen te realiseren waarvoor ze worden verzameld:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>
                Bestel- en factuurgegevens: 7 jaar (fiscale bewaarplicht)
              </li>
              <li>
                Klantaccountgegevens: zolang je account actief is + 12 maanden
              </li>
              <li>
                Reparatie- en inlevergegevens: 2 jaar ter garantie-afhandeling
              </li>
              <li>E-mailcorrespondentie: 2 jaar</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Delen met derden
            </h2>
            <p className="text-gray-700 mb-4">
              Wij delen je gegevens uitsluitend met derden voor zover dat nodig
              is voor de uitvoering van de overeenkomst of om te voldoen aan een
              wettelijke verplichting. Met verwerkers hebben wij
              verwerkersovereenkomsten afgesloten.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Mollie B.V. - voor het verwerken van betalingen</li>
              <li>PostNL/DHL - voor bezorging en track &amp; trace</li>
              <li>Supabase - voor hosting van onze applicatie en database</li>
              <li>Resend - voor het versturen van transactionele e-mails</li>
              <li>Vercel - voor hosting van de website</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-[#094543]" />
              Je rechten
            </h2>
            <p className="text-gray-700 mb-4">
              Je hebt op grond van de AVG de volgende rechten:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Inzage</strong> - je kunt opvragen welke gegevens wij
                van je verwerken.
              </li>
              <li>
                <strong>Rectificatie</strong> - onjuiste gegevens laten
                corrigeren.
              </li>
              <li>
                <strong>Verwijdering</strong> - je gegevens laten verwijderen
                (voor zover geen wettelijke bewaartermijn van toepassing is).
              </li>
              <li>
                <strong>Beperking</strong> - beperking van de verwerking.
              </li>
              <li>
                <strong>Dataportabiliteit</strong> - je gegevens in een
                gestructureerd formaat ontvangen.
              </li>
              <li>
                <strong>Bezwaar</strong> - bezwaar maken tegen verwerking op
                basis van gerechtvaardigd belang.
              </li>
              <li>
                <strong>Intrekken toestemming</strong> - op elk moment.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Stuur een e-mail naar{' '}
              <a
                href="mailto:info@telfixer.nl"
                className="text-[#094543] font-medium hover:underline"
              >
                info@telfixer.nl
              </a>{' '}
              om een recht uit te oefenen. We reageren binnen 4 weken. Je hebt
              ook het recht om een klacht in te dienen bij de Autoriteit
              Persoonsgegevens.
            </p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Cookies
            </h2>
            <p className="text-gray-700">
              TelFixer gebruikt alleen functionele en analytische cookies die
              geen of weinig inbreuk maken op je privacy. Een cookie is een
              klein tekstbestand dat bij het eerste bezoek aan deze website
              wordt opgeslagen op je computer, tablet of smartphone. De cookies
              die wij gebruiken zijn noodzakelijk voor de technische werking van
              de website en je gebruiksgemak.
            </p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Beveiliging
            </h2>
            <p className="text-gray-700">
              TelFixer neemt de bescherming van je gegevens serieus en neemt
              passende maatregelen om misbruik, verlies, onbevoegde toegang,
              ongewenste openbaarmaking en ongeoorloofde wijziging tegen te
              gaan. Alle verbindingen verlopen via HTTPS en gegevens worden
              versleuteld opgeslagen.
            </p>
          </section>

          <section className="bg-gradient-to-br from-[#094543] to-[#0D9488] text-white rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Vragen?</h2>
                <p className="text-white/90 mb-4">
                  Heb je vragen over deze privacyverklaring of wil je een recht
                  uitoefenen? Neem dan gerust contact met ons op.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#094543] font-medium hover:bg-gray-100 transition-colors"
                  >
                    Contact opnemen
                  </Link>
                  <a
                    href="mailto:info@telfixer.nl"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    info@telfixer.nl
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
