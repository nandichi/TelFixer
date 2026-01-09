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
    <div className="py-8 lg:py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#2C3E48]">
            {categoryName || 'Alle producten'}
          </h1>
          <p className="mt-2 text-gray-600">
            {totalItems} {totalItems === 1 ? 'product' : 'producten'} gevonden
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Suspense fallback={<div>Laden...</div>}>
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
            <div className="flex items-center justify-between mb-6">
              <Suspense fallback={null}>
                <ProductSort />
              </Suspense>
            </div>

            {/* Products */}
            <Suspense fallback={<ProductGridSkeleton count={9} />}>
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Geen producten gevonden die aan je criteria voldoen.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Probeer je filters aan te passen.
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
