import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, PackageOpen } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Hero } from '@/components/home/hero';
import { CategoryGrid } from '@/components/home/category-grid';
import { FeaturedGrid } from '@/components/home/featured-grid';
import {
  RepairSection,
  HowItWorks,
  SellDeviceCta,
  TrustSection,
  FinalCta,
} from '@/components/home/sections';
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
          <PackageOpen className="w-8 h-8 text-muted" strokeWidth={1.5} />
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

      {/* Categorieen */}
      <section className="py-16 sm:py-24 lg:py-32 bg-cream">
        <Container>
          <Reveal className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-eyebrow mb-4">
              Categorieen
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Shop per categorie
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Van telefoons tot accessoires, alles vakkundig nagekeken
            </p>
          </Reveal>

          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoriesData />
          </Suspense>
        </Container>
      </section>

      {/* Populaire producten */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <Container>
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <span className="inline-block text-eyebrow mb-4">
                Populair
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black">
                Onze populairste toestellen
              </h2>
              <p className="mt-4 text-lg text-muted">
                De best verkochte refurbished toestellen van dit moment
              </p>
            </div>
            <Link
              href="/producten"
              className="group hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all duration-300 shrink-0"
            >
              Bekijk alles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Reveal>

          <Suspense fallback={<ProductGridSkeleton />}>
            <FeaturedProductsData />
          </Suspense>

          <div className="mt-12 text-center sm:hidden">
            <Link
              href="/producten"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-primary text-primary font-medium transition-all duration-300 hover:bg-primary hover:text-white"
            >
              Bekijk alle producten
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>

      <RepairSection />

      <HowItWorks />

      <SellDeviceCta />

      <TrustSection />

      <Suspense fallback={null}>
        <ReviewsData />
      </Suspense>

      <Suspense fallback={null}>
        <InstagramData />
      </Suspense>

      <FinalCta />
    </>
  );
}
