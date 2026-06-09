import { Suspense } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/home/hero';
import { CategoryGrid } from '@/components/home/category-grid';
import { FeaturedGrid } from '@/components/home/featured-grid';
import { HowItWorks, SellDeviceCta, TrustSection } from '@/components/home/sections';
import { Reveal } from '@/components/ui/reveal';
import { CategoryGridSkeleton, ProductGridSkeleton } from '@/components/ui/skeleton';
import { InstagramFeed } from '@/components/ui/instagram-feed';
import { GoogleReviews } from '@/components/ui/google-reviews';
import { getFeaturedProducts, getCategoriesWithCount } from '@/lib/supabase/products';
import { getInstagramSettings, getGoogleReviewsSettings } from '@/lib/supabase/settings';

async function CategoriesData() {
  const categories = await getCategoriesWithCount();
  return <CategoryGrid categories={categories} />;
}

async function FeaturedProductsData() {
  const featuredProducts = await getFeaturedProducts(6);

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-sand">
        <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-muted">Binnenkort beschikbaar</p>
      </div>
    );
  }

  return <FeaturedGrid products={featuredProducts} />;
}

async function ReviewsData() {
  const googleReviews = await getGoogleReviewsSettings();

  if (!googleReviews.enabled || googleReviews.reviews.length === 0) {
    return null;
  }

  return (
    <GoogleReviews
      reviews={googleReviews.reviews}
      overallRating={googleReviews.overall_rating}
      totalReviews={googleReviews.total_reviews}
      reviewUrl={googleReviews.review_url}
      writeReviewUrl={googleReviews.write_review_url}
      businessName={googleReviews.business_name}
    />
  );
}

async function InstagramData() {
  const instagramSettings = await getInstagramSettings();

  return (
    <InstagramFeed
      posts={instagramSettings.posts}
      profileUrl={instagramSettings.profile_url}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Categories Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white relative">
        <Container>
          <Reveal className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
              Categorieen
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Shop per categorie
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Ontdek onze collectie vakkundig gerepareerde telefoons
            </p>
          </Reveal>

          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoriesData />
          </Suspense>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-cream">
        <Container>
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
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
          </Reveal>

          <Suspense fallback={<ProductGridSkeleton />}>
            <FeaturedProductsData />
          </Suspense>

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

      <HowItWorks />

      <SellDeviceCta />

      <TrustSection />

      <Suspense fallback={null}>
        <ReviewsData />
      </Suspense>

      <Suspense fallback={null}>
        <InstagramData />
      </Suspense>
    </>
  );
}
