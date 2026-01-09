import Link from 'next/link';
import { ArrowRight, Shield, Truck, RefreshCw, Award, CheckCircle, Smartphone, Laptop, Tablet, Plug, Recycle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { getFeaturedProducts, getCategoriesWithCount } from '@/lib/supabase/products';

const categoryIcons: Record<string, typeof Smartphone> = {
  telefoons: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  accessoires: Plug,
};

const steps = [
  {
    number: '01',
    title: 'Kies je apparaat',
    description: 'Blader door onze uitgebreide collectie refurbished elektronica of lever je oude apparaat in.',
    icon: RefreshCw,
  },
  {
    number: '02',
    title: 'Kwaliteitsgarantie',
    description: 'Elk apparaat wordt grondig getest en gereinigd. Je ontvangt een product in topconditie.',
    icon: Shield,
  },
  {
    number: '03',
    title: 'Snelle levering',
    description: 'Na betaling wordt je bestelling binnen 2-4 werkdagen thuisbezorgd met track & trace.',
    icon: Truck,
  },
];

const trustPoints = [
  { text: '12 maanden garantie', icon: Shield },
  { text: 'Gratis verzending vanaf 50 euro', icon: Truck },
  { text: '30 dagen retourrecht', icon: RefreshCw },
  { text: 'Gecertificeerde kwaliteit', icon: Award },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(6),
    getCategoriesWithCount(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#094543] to-[#0d5c59] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <Container>
          <div className="relative py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  Refurbished Elektronica
                  <span className="block text-emerald-300">Met Garantie</span>
          </h1>
                <p className="text-lg lg:text-xl text-gray-200 max-w-xl">
                  Bespaar tot 40% op topkwaliteit telefoons, laptops en tablets. 
                  Allemaal getest, gereinigd en met 12 maanden garantie.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/producten">
                    <Button size="lg" className="bg-white text-[#094543] hover:bg-gray-100">
                      Bekijk producten
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/inleveren">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Apparaat inleveren
                    </Button>
                  </Link>
                </div>
                
                {/* Trust Points */}
                <div className="pt-6 grid grid-cols-2 gap-4">
                  {trustPoints.map((point) => (
                    <div key={point.text} className="flex items-center gap-2 text-sm text-gray-200">
                      <point.icon className="h-5 w-5 text-emerald-300" />
                      <span>{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Hero Image/Illustration */}
              <div className="hidden lg:block relative">
                <div className="aspect-square relative">
                  <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm" />
                  <div className="absolute inset-8 bg-white/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <Smartphone className="h-16 w-16 text-emerald-300" />
                        <Laptop className="h-20 w-20 text-white" />
                        <Tablet className="h-16 w-16 text-emerald-300" />
                      </div>
                      <p className="text-xl font-medium">Kwaliteit voor minder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2C3E48]">
              Shop per categorie
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Ontdek onze uitgebreide collectie refurbished elektronica
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.slug] || Smartphone;
              return (
                <Link
                  key={category.slug}
                  href={`/producten?categorie=${category.slug}`}
                  className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#094543] hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-[#094543]/10 flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-[#094543]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2C3E48] group-hover:text-[#094543] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{category.product_count} producten</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2C3E48]">
                Populaire producten
              </h2>
              <p className="mt-2 text-gray-600">
                Onze best verkopende refurbished apparaten
              </p>
            </div>
            <Link
              href="/producten"
              className="hidden sm:flex items-center text-[#094543] font-medium hover:underline"
            >
              Bekijk alles
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">Binnenkort beschikbaar</p>
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/producten">
              <Button variant="outline">
                Bekijk alle producten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-20 bg-[#094543] text-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Hoe werkt het?
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              In 3 simpele stappen naar jouw refurbished apparaat
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
                    <step.icon className="h-8 w-8 text-emerald-300" />
                  </div>
                  <div className="text-sm font-medium text-emerald-300 mb-2">
                    Stap {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Sell Your Device CTA */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Heb je een oud apparaat?
                </h2>
                <p className="text-gray-300 mb-6">
                  Lever je oude telefoon, laptop of tablet in en ontvang een eerlijk 
                  bod. Wij zorgen voor duurzame verwerking of geven het apparaat een 
                  tweede leven.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Gratis waardebepaling',
                    'Eerlijke prijzen',
                    'Snelle uitbetaling',
                    'Milieuvriendelijk',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-200">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/inleveren">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                    Start waardebepaling
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-transparent p-12">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Recycle className="h-14 w-14 text-emerald-400" />
                  </div>
                  <p className="text-xl font-medium text-white">
                    Duurzaam & Eerlijk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2C3E48]">
              Waarom kiezen voor TelFixer?
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: '12 Maanden Garantie',
                description: 'Op al onze refurbished producten voor jouw gemoedsrust',
              },
              {
                icon: Award,
                title: 'Gecertificeerde Kwaliteit',
                description: 'Elk apparaat wordt grondig getest op 50+ punten',
              },
              {
                icon: Truck,
                title: 'Snelle Levering',
                description: 'Binnen 2-4 werkdagen thuisbezorgd met track & trace',
              },
              {
                icon: RefreshCw,
                title: '30 Dagen Retour',
                description: 'Niet tevreden? Retourneer binnen 30 dagen',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-gray-200 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#094543]/10 mb-4">
                  <item.icon className="h-6 w-6 text-[#094543]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2C3E48] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
        </div>
            ))}
    </div>
        </Container>
      </section>
    </>
  );
}
