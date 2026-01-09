import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, RotateCcw, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Garantie & Retourbeleid',
  description:
    'Informatie over garantie, retourneren en reparaties bij TelFixer.',
};

export default function WarrantyPage() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E48] mb-4">
            Garantie & Retourbeleid
          </h1>
          <p className="text-gray-600">
            Bij TelFixer koop je met vertrouwen. Lees hier alles over onze garantie 
            en ons retourbeleid.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Warranty Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#094543]/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#094543]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2C3E48]">Garantie</h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-[#2C3E48] mb-4">
                Garantietermijnen
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Telefoons</span>
                  <span className="font-semibold text-[#094543]">12 maanden</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Laptops</span>
                  <span className="font-semibold text-[#094543]">12 maanden</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tablets</span>
                  <span className="font-semibold text-[#094543]">12 maanden</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">Accessoires</span>
                  <span className="font-semibold text-[#094543]">6 maanden</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-xl p-6">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Wel gedekt door garantie
                </h3>
                <ul className="space-y-2 text-sm text-emerald-700">
                  <li>Defecte componenten (scherm, batterij, etc.)</li>
                  <li>Software problemen veroorzaakt door ons</li>
                  <li>Fabricagefouten</li>
                  <li>Verborgen gebreken</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Niet gedekt door garantie
                </h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>Schade door vallen, stoten of water</li>
                  <li>Ongeautoriseerde reparaties</li>
                  <li>Normale slijtage</li>
                  <li>Schade door verkeerd gebruik</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Policy */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#094543]/10 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-[#094543]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2C3E48]">Retourbeleid</h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-[#2C3E48] mb-4">
                30 dagen bedenktijd
              </h3>
              <p className="text-gray-600 mb-4">
                Je hebt 30 dagen bedenktijd na ontvangst van je bestelling. 
                Binnen deze periode kun je het product zonder opgaaf van reden retourneren.
              </p>

              <h4 className="font-semibold text-[#2C3E48] mb-2">Voorwaarden:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  Product is in originele staat en onbeschadigd
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  Alle accessoires en verpakking zijn aanwezig
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  Product is uitgelogd van alle accounts (iCloud, Google, etc.)
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#2C3E48] mb-4">
                Hoe retourneer ik?
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#094543] text-white font-semibold shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-[#2C3E48]">
                      Neem contact op
                    </p>
                    <p className="text-sm text-gray-600">
                      Stuur een e-mail naar info@telfixer.nl met je ordernummer en reden
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#094543] text-white font-semibold shrink-0">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-[#2C3E48]">
                      Ontvang retourlabel
                    </p>
                    <p className="text-sm text-gray-600">
                      Je ontvangt een gratis retourlabel per e-mail
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#094543] text-white font-semibold shrink-0">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-[#2C3E48]">
                      Verstuur het product
                    </p>
                    <p className="text-sm text-gray-600">
                      Verpak het product goed en lever het af bij een PostNL punt
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#094543] text-white font-semibold shrink-0">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-[#2C3E48]">
                      Terugbetaling
                    </p>
                    <p className="text-sm text-gray-600">
                      Na ontvangst en controle wordt het bedrag binnen 5 werkdagen teruggestort
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Warranty Claim */}
          <section className="mb-16">
            <div className="bg-amber-50 rounded-xl p-6 flex gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  Garantie claimen?
                </h3>
                <p className="text-sm text-amber-700 mb-4">
                  Als je product binnen de garantieperiode defect raakt, neem dan 
                  contact met ons op. We zorgen voor een snelle oplossing - reparatie, 
                  vervanging of terugbetaling.
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm">
                    Contact opnemen
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Vragen over garantie of retourneren?
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Onze klantenservice helpt je graag. Neem contact op via e-mail of telefoon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button>Contact opnemen</Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline">Bekijk FAQ</Button>
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
