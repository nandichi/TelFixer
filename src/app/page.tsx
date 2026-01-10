import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { InstagramFeed } from '@/components/ui/instagram-feed';
import { ProductCard } from '@/components/products/product-card';
import { getFeaturedProducts, getCategoriesWithCount } from '@/lib/supabase/products';

const categoryData: Record<string, { icon: React.ReactNode; gradient: string }> = {
  telefoons: {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-primary to-primary-light',
  },
  laptops: {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-copper to-gold',
  },
  tablets: {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-[#0D9488] to-[#14B8A6]',
  },
  accessoires: {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-[#7C3AED] to-[#A78BFA]',
  },
};

const steps = [
  {
    number: '01',
    title: 'Kies je apparaat',
    description: 'Blader door onze collectie vakkundig gerepareerde telefoons of lever je oude apparaat in.',
  },
  {
    number: '02',
    title: 'Kwaliteitsgarantie',
    description: 'Elk apparaat wordt door Ivan persoonlijk gerepareerd, getest en gereinigd. Je ontvangt een product in topconditie.',
  },
  {
    number: '03',
    title: 'Snelle levering',
    description: 'Na betaling wordt je bestelling binnen 2-4 werkdagen thuisbezorgd met track & trace.',
  },
];

const trustPoints = [
  { 
    text: '12 maanden garantie', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    text: 'Gratis verzending vanaf 50 euro', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  },
  { 
    text: '30 dagen retourrecht', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  { 
    text: 'Gecertificeerde kwaliteit', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(6),
    getCategoriesWithCount(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cream min-h-[90vh] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-copper/5 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>
        
        <Container>
          <div className="relative py-10 sm:py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-6 sm:space-y-8 lg:pr-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                  <span className="w-2 h-2 rounded-full bg-copper animate-pulse" />
                  <span className="text-sm font-medium text-primary">Een Tweede Leven</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-soft-black leading-[1.1] animate-fade-in-up" style={{ willChange: 'transform, opacity' }}>
                  Gerepareerde
                  <br />
                  <span className="text-gradient-primary">Telefoons</span>
                  <br />
                  Met Garantie
          </h1>
                
                <p className="text-lg lg:text-xl text-slate max-w-lg leading-relaxed animate-fade-in-up delay-200" style={{ willChange: 'transform, opacity' }}>
                  Bespaar tot 40% op vakkundig gerepareerde telefoons. 
                  Persoonlijk gerepareerd door Ivan, getest en met 12 maanden garantie.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300" style={{ willChange: 'transform, opacity' }}>
                  <Link href="/producten">
                    <Button size="lg" className="gap-3">
                      Bekijk producten
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/inleveren">
                    <Button size="lg" variant="outline" className="gap-3">
                      Apparaat inleveren
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                  </Link>
                </div>
                
                {/* Trust Points */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-fade-in-up delay-400" style={{ willChange: 'transform, opacity' }}>
                  {trustPoints.map((point) => (
                    <div key={point.text} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate">
                      <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/5 text-primary flex-shrink-0">
                        {point.icon}
                      </span>
                      <span>{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Side - Product Visual */}
              <div className="relative flex items-center justify-center lg:justify-end animate-fade-in-left delay-300" style={{ willChange: 'transform, opacity' }}>
                {/* Glow Effect Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] rounded-full bg-gradient-to-br from-primary/20 via-copper/15 to-gold/10 blur-3xl animate-pulse-slow" />
                </div>
                
                {/* Phone Mockup Container */}
                <div className="relative z-10">
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 rounded-[4rem] bg-gradient-to-br from-primary/10 via-transparent to-copper/10 blur-2xl" />
                  
                  {/* Phone Device */}
                  <div className="relative w-[200px] h-[400px] sm:w-[280px] sm:h-[560px] lg:w-[320px] lg:h-[640px]">
                    {/* Phone Frame Shadow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-soft-black/30 to-charcoal/20 rounded-[3rem] blur-xl translate-y-4 translate-x-2" />
                    
                    {/* Phone Body */}
                    <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-soft-black to-charcoal rounded-[3rem] p-[3px]">
                      {/* Inner Frame */}
                      <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2.8rem] p-2 relative overflow-hidden">
                        {/* Side Buttons */}
                        <div className="absolute left-0 top-24 w-[3px] h-12 bg-charcoal rounded-r-sm" />
                        <div className="absolute left-0 top-40 w-[3px] h-8 bg-charcoal rounded-r-sm" />
                        <div className="absolute left-0 top-52 w-[3px] h-8 bg-charcoal rounded-r-sm" />
                        <div className="absolute right-0 top-32 w-[3px] h-16 bg-charcoal rounded-l-sm" />
                        
                        {/* Screen */}
                        <div className="w-full h-full bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] rounded-[2.4rem] overflow-hidden relative">
                          {/* Dynamic Island / Notch */}
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-soft-black rounded-full flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-charcoal" />
                            <div className="w-3 h-3 rounded-full bg-charcoal/80 ring-1 ring-charcoal/50" />
                          </div>
                          
                          {/* Screen Content - App Display */}
                          <div className="absolute inset-0 pt-14 px-4 pb-8 flex flex-col">
                            {/* Status Bar */}
                            <div className="flex items-center justify-between text-[10px] text-soft-black/60 px-2 mb-4">
                              <span className="font-medium">9:41</span>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 3c-4.5 0-8.27 3.11-9.33 7.31C3.79 14.51 7.56 17.62 12 17.62c4.44 0 8.21-3.11 9.33-7.31C20.27 6.11 16.5 3 12 3z" opacity="0.3"/>
                                  <path d="M1 9l2 2c2.88-2.88 6.79-4 10.5-3.12l1.82-1.82C11.5 4.45 6.18 5.28 2.72 8.45L1 9z"/>
                                </svg>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M17 4h-3V2h-4v2H7v18h10V4zm-4 16h-2v-2h2v2zm0-4h-2V8h2v8z"/>
                                </svg>
                              </div>
                            </div>
                            
                            {/* App Content Preview */}
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                              {/* TelFixer Badge */}
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              
                              <div className="text-center space-y-1">
                                <p className="text-sm sm:text-base font-display font-bold text-soft-black">TelFixer</p>
                                <p className="text-[10px] sm:text-xs text-muted">Een Tweede Leven</p>
                              </div>
                              
                              {/* Stats Preview */}
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-sm w-full max-w-[180px] sm:max-w-[200px]">
                    <div className="text-center">
                                  <div className="text-2xl sm:text-3xl font-display font-bold text-gradient-primary">40%</div>
                                  <div className="text-[10px] sm:text-xs text-muted mt-1">Besparing t.o.v. nieuw</div>
                                </div>
                              </div>
                              
                              {/* Feature Pills */}
                              <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px]">
                                <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] sm:text-[10px] rounded-full font-medium">12 mnd garantie</span>
                                <span className="px-2 py-1 bg-copper/10 text-copper text-[8px] sm:text-[10px] rounded-full font-medium">Getest</span>
                                <span className="px-2 py-1 bg-[#0D9488]/10 text-[#0D9488] text-[8px] sm:text-[10px] rounded-full font-medium">Gratis verzending</span>
                              </div>
                            </div>
                            
                            {/* Home Indicator */}
                            <div className="w-24 h-1 bg-soft-black/20 rounded-full mx-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Badges */}
                    <div className="hidden sm:block absolute -top-2 -right-6 sm:-top-4 sm:-right-8 lg:-top-6 lg:-right-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-copper to-gold p-3 sm:p-4 text-white shadow-xl animate-float" style={{ animationDelay: '0s' }}>
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium block leading-tight">Garantie<br/>12 maanden</span>
                    </div>
                    
                    <div className="hidden sm:block absolute -bottom-2 -left-6 sm:-bottom-4 sm:-left-8 lg:-bottom-6 lg:-left-12 w-18 h-18 sm:w-22 sm:h-22 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-light p-3 sm:p-4 text-white shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium block leading-tight">Gratis<br/>verzending</span>
                    </div>
                    
                    <div className="hidden sm:block absolute top-1/3 -left-4 sm:-left-6 lg:-left-10 w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] p-2 sm:p-3 text-white shadow-xl animate-float" style={{ animationDelay: '4s' }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium block leading-tight">30 dagen<br/>retour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white relative">
        <Container>
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
              Categorieen
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Shop per categorie
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Ontdek onze collectie vakkundig gerepareerde telefoons
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category) => {
              const catData = categoryData[category.slug] || categoryData.telefoons;
              return (
                <Link
                  key={category.slug}
                  href={`/producten?categorie=${category.slug}`}
                  className="group relative h-full"
                >
                  <div className="relative h-full flex flex-col bg-cream rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-sand transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${catData.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${catData.gradient} flex items-center justify-center mb-4 sm:mb-6 text-white transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}>
                      {catData.icon}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-semibold text-soft-black mb-2 font-display">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted line-clamp-2 mb-3 sm:mb-4 min-h-[2rem] sm:min-h-[2.5rem] flex-grow">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-muted">
                        {category.product_count} producten
                      </span>
                      <span className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-cream">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
                Populair
              </span>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
                Populaire producten
              </h2>
              <p className="mt-4 text-lg text-muted">
                Onze best verkopende gerepareerde telefoons
              </p>
            </div>
            <Link
              href="/producten"
              className="group flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all duration-300"
            >
              Bekijk alles
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-sand">
              <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-muted">Binnenkort beschikbaar</p>
            </div>
          )}
          
          <div className="mt-12 text-center sm:hidden">
            <Link href="/producten">
              <Button variant="outline" size="lg">
                Bekijk alle producten
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-soft-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-copper/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <Container>
          <div className="relative text-center mb-12 sm:mb-20">
            <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
              Proces
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
              Hoe werkt het?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              In 3 simpele stappen naar jouw gerepareerde telefoon
            </p>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-primary via-copper to-gold opacity-30" />
            </div>
            
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 mb-5 sm:mb-8">
                  <span className="text-3xl sm:text-5xl font-display font-bold text-gradient-copper">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-semibold text-white mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Sell Your Device CTA */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <Container>
          <div className="relative rounded-2xl sm:rounded-[3rem] overflow-hidden bg-gradient-to-br from-soft-black to-charcoal">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-6 sm:p-10 lg:p-16">
                <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4 sm:mb-6">
                  Inleveren
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                  Heb je een oud apparaat?
                </h2>
                <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 leading-relaxed">
                  Lever je oude telefoon, laptop of tablet in en ontvang een eerlijk 
                  bod. Wij zorgen voor duurzame verwerking of geven het apparaat een 
                  tweede leven.
                </p>
                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {[
                    'Gratis waardebepaling',
                    'Eerlijke prijzen',
                    'Snelle uitbetaling',
                    'Milieuvriendelijk',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-white">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-copper to-gold">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/inleveren">
                  <Button size="lg" variant="copper" className="gap-3">
                    Start waardebepaling
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
              </div>
              
              <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-copper/10 to-transparent">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-copper/20 to-gold/20 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-copper to-gold flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
                    <span className="text-2xl font-display font-bold text-white">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-cream">
        <Container>
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
              Waarom TelFixer
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Waarom kiezen voor ons?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: '12 Maanden Garantie',
                description: 'Op al onze gerepareerde telefoons voor jouw gemoedsrust',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Gecertificeerde Kwaliteit',
                description: 'Elk apparaat wordt grondig getest op 50+ punten',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
                title: 'Snelle Levering',
                description: 'Binnen 2-4 werkdagen thuisbezorgd met track & trace',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: '30 Dagen Retour',
                description: 'Niet tevreden? Retourneer binnen 30 dagen',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-sand transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/5 text-primary mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 mx-auto flex-shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-display font-semibold text-soft-black mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed flex-grow">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Instagram Feed Section */}
      <InstagramFeed />
    </>
  );
}
