import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShoppingBag, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Algemene voorwaarden',
  description:
    'Algemene voorwaarden van TelFixer voor levering van refurbished apparaten, reparaties en inname.',
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
            Laatst bijgewerkt op 19 april 2026. Deze voorwaarden zijn van
            toepassing op alle overeenkomsten met TelFixer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 1 - Definities
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>TelFixer</strong>: de onderneming TelFixer, gevestigd aan
                Houtrakbos 34, 6718HD Ede, ingeschreven bij de Kamer van
                Koophandel.
              </p>
              <p>
                <strong>Klant</strong>: de natuurlijke persoon of
                rechtspersoon die een overeenkomst aangaat met TelFixer.
              </p>
              <p>
                <strong>Overeenkomst</strong>: iedere koop-, reparatie- of
                innameovereenkomst tussen TelFixer en de klant.
              </p>
              <p>
                <strong>Producten</strong>: refurbished telefoons, laptops,
                tablets, accessoires en nieuwe apparaten die TelFixer aanbiedt.
              </p>
              <p>
                <strong>Diensten</strong>: reparatie- en innameservices die
                TelFixer aanbiedt.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 2 - Toepasselijkheid
            </h2>
            <p className="text-gray-700 mb-3">
              Deze algemene voorwaarden zijn van toepassing op elk aanbod van
              TelFixer en op iedere tot stand gekomen overeenkomst. Afwijkingen
              gelden uitsluitend indien schriftelijk overeengekomen.
            </p>
            <p className="text-gray-700">
              Door een bestelling te plaatsen, een reparatie aan te vragen of
              een apparaat in te leveren, gaat de klant akkoord met deze
              voorwaarden.
            </p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-[#094543]" />
              Artikel 3 - Aanbod en overeenkomst
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Alle aanbiedingen op de website zijn vrijblijvend en onder
                voorbehoud van beschikbaarheid.
              </li>
              <li>
                De overeenkomst komt tot stand op het moment dat TelFixer de
                bestelling per e-mail bevestigt.
              </li>
              <li>
                TelFixer behoudt zich het recht voor om een bestelling te
                weigeren, bijvoorbeeld bij vermoeden van fraude of onjuiste
                gegevens.
              </li>
              <li>
                Kennelijke vergissingen of fouten in het aanbod binden TelFixer
                niet.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 4 - Prijzen en betaling
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Alle prijzen zijn in euro&apos;s, inclusief btw, tenzij anders
                vermeld.
              </li>
              <li>
                Verzendkosten worden duidelijk weergegeven voor het afronden van
                de bestelling.
              </li>
              <li>
                Betaling verloopt via Mollie. Beschikbare betaalmethoden zijn
                onder andere iDEAL, Creditcard, Klarna en bankoverschrijving.
              </li>
              <li>
                Bij reparaties wordt eerst een prijsopgave gedaan. De reparatie
                start pas na akkoord van de klant.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 5 - Levering en verzending
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Bestellingen worden zo snel mogelijk verzonden na ontvangst van
                de betaling.
              </li>
              <li>
                Levertermijnen zijn indicatief en gelden nooit als fatale
                termijn.
              </li>
              <li>
                Het risico van beschadiging of verlies gaat over op de klant op
                het moment van aflevering.
              </li>
              <li>
                De klant is zelf verantwoordelijk voor het opgeven van een
                juist en volledig afleveradres.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <RefreshCw className="h-6 w-6 text-[#094543]" />
              Artikel 6 - Herroepingsrecht
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Consumenten hebben bij online aankopen 14 dagen bedenktijd na
                ontvangst van het product.
              </li>
              <li>
                Binnen deze termijn mag de klant het product zonder opgave van
                reden retourneren, mits het in de originele staat en verpakking
                verkeert.
              </li>
              <li>
                De klant is verantwoordelijk voor de kosten van retourzending,
                tenzij anders overeengekomen.
              </li>
              <li>
                Na ontvangst en controle van het geretourneerde product betalen
                wij het aankoopbedrag binnen 14 dagen terug op dezelfde
                betaalmethode.
              </li>
              <li>
                Het herroepingsrecht geldt niet voor op maat gemaakte producten
                of uitgevoerde reparaties.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#094543]" />
              Artikel 7 - Garantie
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Op refurbished telefoons, laptops en tablets geldt een garantie
                van 6 maanden.
              </li>
              <li>Op reparaties geldt een garantie van 3 maanden.</li>
              <li>Op accessoires en nieuwe apparaten geldt 2 jaar garantie.</li>
              <li>
                Garantie geldt op materiaal- en productiefouten, niet op schade
                door eigen toedoen, val- of vochtschade, overbelasting of
                normale slijtage.
              </li>
              <li>
                Zie onze volledige{' '}
                <Link
                  href="/garantie"
                  className="text-[#094543] font-medium hover:underline"
                >
                  garantiepagina
                </Link>{' '}
                voor het volledige garantiebeleid.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 8 - Inname van apparaten
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Bij inname van een apparaat ontvang je binnen 2 werkdagen een
                prijsaanbod per e-mail en WhatsApp.
              </li>
              <li>
                Na akkoord ontvang je kosteloos verzendlabels om het apparaat
                naar ons te versturen.
              </li>
              <li>
                De klant garandeert dat het aangeboden apparaat zijn eigendom
                is en niet als gestolen gemeld is.
              </li>
              <li>
                Wijkt de staat van het apparaat bij ontvangst substantieel af
                van de beschrijving, dan kan het aanbod worden aangepast of
                ingetrokken.
              </li>
              <li>
                Uitbetaling geschiedt binnen 5 werkdagen na akkoord op ons
                (aangepaste) aanbod.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 9 - Reparaties
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Voor een reparatie wordt eerst een diagnose en prijsopgave
                gemaakt. De reparatie start pas na schriftelijk akkoord.
              </li>
              <li>
                TelFixer gebruikt waar mogelijk originele onderdelen. Indien
                niet beschikbaar, worden kwalitatief gelijkwaardige onderdelen
                ingezet.
              </li>
              <li>
                Niet opgehaalde reparaties worden na 90 dagen eigendom van
                TelFixer.
              </li>
              <li>
                Wij adviseren altijd een backup te maken van data op het
                apparaat. TelFixer is niet aansprakelijk voor verlies van data.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 10 - Klachten
            </h2>
            <p className="text-gray-700 mb-3">
              Klachten over de uitvoering van de overeenkomst moeten binnen
              redelijke tijd, volledig en duidelijk omschreven worden ingediend
              bij TelFixer via{' '}
              <a
                href="mailto:info@telfixer.nl"
                className="text-[#094543] font-medium hover:underline"
              >
                info@telfixer.nl
              </a>
              . Wij reageren binnen 14 dagen. Komt er geen oplossing, dan kan de
              klant het geschil voorleggen aan de Geschillencommissie via{' '}
              <a
                href="https://www.degeschillencommissie.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#094543] font-medium hover:underline"
              >
                degeschillencommissie.nl
              </a>{' '}
              of via het ODR-platform van de EU.
            </p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-[#094543]" />
              Artikel 11 - Aansprakelijkheid
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                TelFixer is uitsluitend aansprakelijk voor directe schade die
                het gevolg is van opzet of grove nalatigheid.
              </li>
              <li>
                Aansprakelijkheid is beperkt tot maximaal het factuurbedrag van
                de betreffende overeenkomst.
              </li>
              <li>
                TelFixer is niet aansprakelijk voor indirecte schade, waaronder
                gederfde winst, gemiste besparingen of bedrijfsstagnatie.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Artikel 12 - Toepasselijk recht
            </h2>
            <p className="text-gray-700">
              Op alle overeenkomsten tussen TelFixer en de klant is uitsluitend
              Nederlands recht van toepassing. Geschillen worden voorgelegd aan
              de bevoegde rechter in het arrondissement Gelderland, tenzij de
              wet dwingend anders voorschrijft.
            </p>
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
