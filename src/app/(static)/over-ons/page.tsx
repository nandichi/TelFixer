import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Leaf, Heart, Award, Target, MapPin, GraduationCap, Wrench, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Over Ons',
  description:
    'Leer meer over TelFixer - vakkundig gerepareerde telefoons die een tweede leven krijgen. Gevestigd in Ede, Gelderland.',
};

const values = [
  {
    icon: Shield,
    title: 'Kwaliteit',
    description:
      'Elk apparaat wordt door Ivan persoonlijk gerepareerd en grondig getest. We leveren alleen producten waar we volledig achter staan.',
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
      'Al onze producten komen met minimaal 12 maanden garantie. Je koopt met vertrouwen.',
  },
];

const stats = [
  { value: '500+', label: 'Tevreden klanten' },
  { value: '1.000+', label: 'Telefoons verkocht' },
  { value: '800+', label: 'Apparaten gerepareerd' },
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
            Vakkundig gerepareerde telefoons die een tweede leven krijgen. 
            Gevestigd in Ede, Gelderland.
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
                  TelFixer is het verhaal van Ivan Politin, een gepassioneerde telefoonreparateur 
                  uit Ede, Gelderland. Ivan zag hoe elk jaar miljoenen perfect bruikbare telefoons 
                  worden weggegooid, terwijl nieuwe toestellen steeds duurder worden.
                </p>
                <p>
                  Met jarenlange ervaring in het repareren van telefoons besloot Ivan om 
                  deze apparaten een tweede leven te geven. Geen massale refurbish-fabriek, 
                  maar persoonlijke aandacht voor elk toestel dat door zijn handen gaat.
                </p>
                <p>
                  Vanuit zijn werkplaats in Ede repareert Ivan elke telefoon met vakmanschap 
                  en zorg. Elk apparaat wordt grondig getest voordat het een nieuwe eigenaar 
                  krijgt. Zo combineren we betaalbare technologie met duurzaamheid.
                </p>
              </div>
            </div>
            <div className="bg-[#094543] rounded-2xl p-8 text-white">
              <div className="text-center">
                <Target className="h-16 w-16 mx-auto mb-6 text-emerald-300" />
                <h3 className="text-2xl font-bold mb-4">Onze Missie</h3>
                <p className="text-lg text-gray-200">
                  Elke telefoon verdient een tweede kans. Door vakkundig te repareren 
                  maken we kwaliteit betaalbaar en dragen we bij aan een duurzamere 
                  wereld, een telefoon tegelijk.
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

      {/* Ivan Section */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2C3E48]">
              De Vakman
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Achter TelFixer staat een gepassioneerde ondernemer en reparateur 
              die elke telefoon met zorg behandelt
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Foto kolom */}
                <div className="md:col-span-2 bg-gradient-to-br from-[#094543] to-[#0a5a57] p-8 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-xl mb-6">
                    <Image
                      src="https://media.licdn.com/dms/image/v2/D4D03AQFntoMXsxBODQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726786165361?e=1769644800&v=beta&t=kfvBFGH9tvNGub3Xgc7Si-WZut4P6clcyDi1wgXNi4o"
                      alt="Ivan Politin - Oprichter TelFixer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Ivan Politin</h3>
                  <p className="text-emerald-300 font-medium mb-4">Oprichter & Telefoonreparateur</p>
                  <a
                    href="https://www.linkedin.com/in/ivan-politin-333339309/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Bekijk LinkedIn
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Info kolom */}
                <div className="md:col-span-3 p-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-[#2C3E48] mb-3">Over Ivan</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Ivan Politin (20) is een jonge ondernemer uit Ede met een passie voor 
                        technologie en duurzaamheid. Naast zijn studie Technische Bedrijfskunde 
                        aan de HAN in Arnhem runt hij TelFixer, waar hij telefoons vakkundig 
                        repareert en een tweede leven geeft.
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 leading-relaxed">
                        Met ervaring in sales, logistiek en klantcontact combineert Ivan 
                        ondernemerschap met analytisch denkvermogen. Hij werkt voortdurend 
                        aan het optimaliseren van processen en ziet snel kansen voor verbetering.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#094543]/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#094543]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E48]">Locatie</p>
                          <p className="text-sm text-gray-600">Ede, Gelderland</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#094543]/10 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-[#094543]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E48]">Opleiding</p>
                          <p className="text-sm text-gray-600">Technische Bedrijfskunde - HAN</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#094543]/10 flex items-center justify-center flex-shrink-0">
                          <Wrench className="w-5 h-5 text-[#094543]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E48]">Expertise</p>
                          <p className="text-sm text-gray-600">Elektronicareparatie & Operations</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#094543]/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-[#094543]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E48]">Certificering</p>
                          <p className="text-sm text-gray-600">VCA VOL gecertificeerd</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 italic">
                        &quot;Ik krijg energie van het verbeteren van processen. Ik zie snel kansen 
                        en werk goed onder druk. Altijd op zoek naar slimme ideeen en verbeteringen.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              Ontdek onze collectie gerepareerde telefoons of lever je oude apparaat in
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
