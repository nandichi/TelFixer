import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Leaf, Heart, Award, Users, Target } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Over Ons',
  description:
    'Leer meer over TelFixer - jouw betrouwbare partner voor refurbished elektronica en duurzame technologie.',
};

const values = [
  {
    icon: Shield,
    title: 'Kwaliteit',
    description:
      'Elk apparaat wordt grondig getest op 50+ punten. We leveren alleen producten waar we volledig achter staan.',
  },
  {
    icon: Leaf,
    title: 'Duurzaamheid',
    description:
      'Door refurbished te kiezen, geef je elektronica een tweede leven en verminder je e-waste.',
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
      'Al onze producten komen met minimaal 12 maanden garantie. Je koopt met vertrouwen.',
  },
];

const stats = [
  { value: '10.000+', label: 'Tevreden klanten' },
  { value: '15.000+', label: 'Producten verkocht' },
  { value: '5.000+', label: 'Apparaten gerefurbished' },
  { value: '98%', label: 'Klanttevredenheid' },
];

export default function AboutPage() {
  return (
    <div className="py-12 lg:py-16">
      {/* Hero */}
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#2C3E48] mb-6">
            Over TelFixer
          </h1>
          <p className="text-xl text-gray-600">
            Wij geloven dat hoogwaardige technologie voor iedereen toegankelijk 
            moet zijn, zonder de planeet te belasten.
          </p>
        </div>
      </Container>

      {/* Story Section */}
      <section className="bg-gray-50 py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2C3E48] mb-6">
                Ons Verhaal
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  TelFixer is ontstaan uit een simpele observatie: elk jaar worden 
                  miljoenen perfect bruikbare apparaten weggegooid, terwijl nieuwe 
                  elektronica steeds duurder wordt.
                </p>
                <p>
                  Wij zagen een kans om dit te veranderen. Door gebruikte apparaten 
                  professioneel te refurbishen, geven we ze een tweede leven en bieden 
                  we consumenten een betaalbaar alternatief zonder in te leveren op kwaliteit.
                </p>
                <p>
                  Vandaag de dag zijn we uitgegroeid tot een van de meest betrouwbare 
                  aanbieders van refurbished elektronica in Nederland. Met een team van 
                  gepassioneerde technici werken we dagelijks aan het leveren van de 
                  beste kwaliteit refurbished producten.
                </p>
              </div>
            </div>
            <div className="bg-[#094543] rounded-2xl p-8 text-white">
              <div className="text-center">
                <Target className="h-16 w-16 mx-auto mb-6 text-emerald-300" />
                <h3 className="text-2xl font-bold mb-4">Onze Missie</h3>
                <p className="text-lg text-gray-200">
                  Hoogwaardige technologie toegankelijk maken voor iedereen, 
                  terwijl we bijdragen aan een duurzamere wereld door elektronica 
                  een tweede leven te geven.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2C3E48]">
              Onze Waarden
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Deze kernwaarden sturen alles wat we doen bij TelFixer
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#094543]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-[#094543]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2C3E48] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-[#094543] py-16 text-white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2C3E48]">
              Ons Team
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Een gepassioneerd team van technici en klantenservice medewerkers 
              staat klaar om je te helpen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Technici', count: '8+', description: 'Gecertificeerde refurbish specialisten' },
              { name: 'Klantenservice', count: '5+', description: 'Vriendelijke experts klaar om te helpen' },
              { name: 'Logistiek', count: '4+', description: 'Zorgen voor snelle levering' },
            ].map((dept) => (
              <div key={dept.name} className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-[#094543]" />
                </div>
                <p className="text-2xl font-bold text-[#094543]">{dept.count}</p>
                <h3 className="text-lg font-semibold text-[#2C3E48]">{dept.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{dept.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#2C3E48] mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-gray-600 mb-8">
              Ontdek onze collectie refurbished elektronica of lever je oude apparaat in
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/producten">
                <Button size="lg">
                  Bekijk producten
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/inleveren">
                <Button size="lg" variant="outline">
                  Apparaat inleveren
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
