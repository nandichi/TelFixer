import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  ShoppingBag,
  RefreshCw,
  Shield,
  AlertCircle,
  Wrench,
  Package,
  Truck,
  CreditCard,
  Ban,
  Lock,
  Cloud,
  Scale,
} from 'lucide-react';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Algemene voorwaarden',
  description:
    'Algemene voorwaarden van TelFixer voor reparaties, verkoop en inkoop van elektronische apparaten.',
};

export default function TermsPage() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#094543]/10 mb-6">
            <FileText className="h-8 w-8 text-[#094543]" />
          </div>
          <h1 className="text-4xl font-bold text-[#2C3E48] mb-4">
            Algemene voorwaarden
          </h1>
          <p className="text-gray-600">
            Deze voorwaarden zijn van toepassing op alle diensten en
            overeenkomsten van TelFixer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. Algemeen */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#094543]" />
              1. Algemeen
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                1.1 Deze algemene voorwaarden zijn van toepassing op alle
                diensten en overeenkomsten van TelFixer.
              </li>
              <li>
                1.2 Door gebruik te maken van onze diensten gaat de klant
                akkoord met deze voorwaarden.
              </li>
            </ul>
          </section>

          {/* 2. Diensten */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-[#094543]" />
              2. Diensten
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                2.1 TelFixer biedt reparaties, inkoop en verkoop van
                elektronische apparaten, waaronder smartphones en tablets.
              </li>
              <li>
                2.2 Reparaties worden uitgevoerd naar beste inzicht en
                vermogen.
              </li>
            </ul>
          </section>

          {/* 3. Offertes en prijzen */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              3. Offertes en prijzen
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>3.1 Alle prijsopgaven zijn vrijblijvend en indicatief.</li>
              <li>
                3.2 De uiteindelijke prijs kan afwijken indien tijdens de
                reparatie aanvullende gebreken worden vastgesteld.
              </li>
              <li>3.3 Prijzen zijn inclusief btw, tenzij anders vermeld.</li>
            </ul>
          </section>

          {/* 4. Reparaties */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Wrench className="h-6 w-6 text-[#094543]" />
              4. Reparaties
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                4.1 De klant gaat akkoord met het openen van het apparaat voor
                diagnose en reparatie.
              </li>
              <li>
                4.2 TelFixer is niet aansprakelijk voor reeds aanwezige schade
                die tijdens de reparatie zichtbaar wordt.
              </li>
              <li>
                4.3 Indien een apparaat niet te repareren blijkt, kunnen
                onderzoekskosten in rekening worden gebracht (indien vooraf
                gecommuniceerd).
              </li>
            </ul>
          </section>

          {/* 5. Garantie op reparaties */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#094543]" />
              5. Garantie op reparaties
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>5.1 Op uitgevoerde reparaties geldt 3 maanden garantie.</li>
              <li>
                5.2 Garantie dekt defecten die direct verband houden met de
                uitgevoerde reparatie.
              </li>
              <li>
                5.3 Garantie vervalt bij:
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Val-, stoot- of waterschade</li>
                  <li>Onjuist gebruik</li>
                  <li>Reparaties door derden</li>
                  <li>
                    Schade aan andere onderdelen dan het gerepareerde onderdeel
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          {/* 6. Verkoop van toestellen */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-[#094543]" />
              6. Verkoop van toestellen
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                6.1 Op door TelFixer verkochte toestellen geldt 6 maanden
                garantie, tenzij anders vermeld.
              </li>
              <li>
                6.2 Deze garantie dekt technische defecten die niet door de
                gebruiker zijn veroorzaakt.
              </li>
              <li>
                6.3 Garantie op toestellen dekt niet:
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Val-, stoot- of waterschade</li>
                  <li>Slijtage van batterij (normaal gebruik)</li>
                  <li>Schade door verkeerd gebruik of software-installaties</li>
                </ul>
              </li>
              <li>
                6.4 Eventuele gebruikssporen of cosmetische schade worden
                vooraf gecommuniceerd en vallen niet onder garantie.
              </li>
            </ul>
          </section>

          {/* 7. Onderdelen */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Package className="h-6 w-6 text-[#094543]" />
              7. Onderdelen
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                7.1 TelFixer maakt gebruik van originele, refurbished of
                compatibele onderdelen.
              </li>
              <li>
                7.2 Indien geen originele onderdelen worden gebruikt, wordt dit
                vooraf gecommuniceerd.
              </li>
            </ul>
          </section>

          {/* 8. Ophaal- en brengservice */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Truck className="h-6 w-6 text-[#094543]" />
              8. Ophaal- en brengservice
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                8.1 TelFixer biedt een ophaal- en brengservice binnen Ede en
                een straal van 15 km.
              </li>
              <li>
                8.2 De klant is verantwoordelijk voor het correct overdragen
                van het apparaat.
              </li>
              <li>
                8.3 TelFixer is niet aansprakelijk voor verlies van data
                tijdens transport of reparatie.
              </li>
              <li>
                8.4 Indien de klant niet aanwezig is op het afgesproken
                tijdstip, kan een nieuwe afspraak worden ingepland.
              </li>
              <li>
                8.5 TelFixer behoudt zich het recht voor om de ophaalservice te
                weigeren of kosten in rekening te brengen bij misbruik of
                herhaalde afwezigheid.
              </li>
            </ul>
          </section>

          {/* 9. Aansprakelijkheid */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-[#094543]" />
              9. Aansprakelijkheid
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                9.1 TelFixer is niet aansprakelijk voor:
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Verlies van data</li>
                  <li>Indirecte schade of gevolgschade</li>
                </ul>
              </li>
              <li>
                9.2 De klant is zelf verantwoordelijk voor het maken van een
                back-up van gegevens.
              </li>
            </ul>
          </section>

          {/* 10. Betaling */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-[#094543]" />
              10. Betaling
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                10.1 Betaling dient te geschieden bij oplevering van de
                reparatie of levering van het toestel, tenzij anders
                afgesproken.
              </li>
              <li>
                10.2 TelFixer behoudt zich het recht voor om een apparaat of
                product onder zich te houden totdat volledige betaling is
                ontvangen.
              </li>
            </ul>
          </section>

          {/* 11. Inkoop van toestellen */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <RefreshCw className="h-6 w-6 text-[#094543]" />
              11. Inkoop van toestellen
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                11.1 De klant dient eigenaar te zijn van het aangeboden
                apparaat.
              </li>
              <li>11.2 TelFixer kan vragen om legitimatie bij inkoop.</li>
              <li>
                11.3 TelFixer behoudt zich het recht voor om een aankoop te
                weigeren zonder opgaaf van reden.
              </li>
            </ul>
          </section>

          {/* 12. Annulering */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Ban className="h-6 w-6 text-[#094543]" />
              12. Annulering
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                12.1 Annulering van een reparatie is mogelijk zolang de
                reparatie nog niet is gestart.
              </li>
              <li>
                12.2 Indien onderdelen speciaal zijn besteld, kunnen kosten in
                rekening worden gebracht.
              </li>
            </ul>
          </section>

          {/* 13. Privacy */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-[#094543]" />
              13. Privacy
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                13.1 TelFixer gaat zorgvuldig om met persoonsgegevens en
                gebruikt deze uitsluitend voor dienstverlening.
              </li>
              <li>
                13.2 Gegevens worden niet gedeeld met derden zonder
                toestemming, tenzij wettelijk verplicht.
              </li>
              <li>
                Zie onze volledige{' '}
                <Link
                  href="/privacy"
                  className="text-[#094543] font-medium hover:underline"
                >
                  privacyverklaring
                </Link>{' '}
                voor meer informatie.
              </li>
            </ul>
          </section>

          {/* 14. Overmacht */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Cloud className="h-6 w-6 text-[#094543]" />
              14. Overmacht
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                14.1 TelFixer is niet aansprakelijk voor vertragingen of schade
                als gevolg van overmacht.
              </li>
            </ul>
          </section>

          {/* 15. Toepasselijk recht */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Scale className="h-6 w-6 text-[#094543]" />
              15. Toepasselijk recht
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                15.1 Op alle overeenkomsten is Nederlands recht van toepassing.
              </li>
            </ul>
          </section>

          <div className="bg-gradient-to-br from-[#094543] to-[#0D9488] text-white rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Vragen over de voorwaarden?</h2>
            <p className="text-white/90 mb-4">
              Neem gerust contact met ons op. We helpen je graag verder.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#094543] font-medium hover:bg-gray-100 transition-colors"
              >
                Contact opnemen
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Privacyverklaring
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
