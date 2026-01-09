import { Suspense } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSort } from '@/components/products/product-sort';
import { Pagination } from '@/components/products/pagination';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import { getProducts, getCategories, getBrands } from '@/lib/supabase/products';
import { ConditionGrade } from '@/types';

export const metadata: Metadata = {
  title: 'Producten',
  description:
    'Bekijk onze uitgebreide collectie refurbished telefoons, laptops, tablets en accessoires. Kwaliteit met garantie.',
};

interface PageProps {
  searchParams: Promise<{
    categorie?: string;
    merk?: string;
    min?: string;
    max?: string;
    conditie?: string;
    sorteer?: string;
    pagina?: string;
    zoek?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const {
    categorie,
    merk,
    min,
    max,
    conditie,
    sorteer = 'newest',
    pagina = '1',
    zoek,
  } = params;

  const currentPage = parseInt(pagina) || 1;
  const itemsPerPage = 9;

  // Parse conditions
  const conditions = conditie ? conditie.split(',') as ConditionGrade[] : undefined;

  // Fetch data from database
  const [productsResult, categories, brands] = await Promise.all([
    getProducts({
      category: categorie,
      brand: merk,
      minPrice: min ? parseFloat(min) : undefined,
      maxPrice: max ? parseFloat(max) : undefined,
      condition: conditions,
      search: zoek,
      sort: sorteer as 'price_asc' | 'price_desc' | 'newest' | 'name',
      page: currentPage,
      limit: itemsPerPage,
    }),
    getCategories(),
    getBrands(categorie),
  ]);

  const { data: products, total: totalItems, totalPages } = productsResult;

  // Get category name for header
  const categoryName = categorie
    ? categories.find((c) => c.slug === categorie)?.name
    : null;

  return (
    <div className="py-12 lg:py-20 bg-cream min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
            Collectie
          </span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
            {categoryName || 'Alle producten'}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {totalItems} {totalItems === 1 ? 'product' : 'producten'} gevonden
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="sticky top-28">
              <Suspense fallback={
                <div className="bg-white rounded-3xl border border-sand p-6 animate-shimmer">
                  <div className="h-6 w-24 bg-champagne rounded mb-6" />
                  <div className="space-y-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 bg-champagne rounded-xl" />
                    ))}
                  </div>
                </div>
              }>
                <ProductFilters
                  categories={categories}
                  brands={brands}
                />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-8 bg-white rounded-2xl border border-sand p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <Suspense fallback={null}>
                <ProductSort />
              </Suspense>
            </div>

            {/* Products */}
            <Suspense fallback={<ProductGridSkeleton count={9} />}>
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                  />
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-sand">
                  <div className="w-20 h-20 rounded-3xl bg-champagne flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-soft-black mb-2">
                    Geen producten gevonden
                  </h3>
                  <p className="text-muted max-w-md mx-auto">
                    Er zijn geen producten die aan je criteria voldoen. Probeer je filters aan te passen.
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
