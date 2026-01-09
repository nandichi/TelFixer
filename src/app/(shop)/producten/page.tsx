import { Suspense } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSort } from '@/components/products/product-sort';
import { Pagination } from '@/components/products/pagination';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import { Product, Category, ConditionGrade } from '@/types';

export const metadata: Metadata = {
  title: 'Producten',
  description:
    'Bekijk onze uitgebreide collectie refurbished telefoons, laptops, tablets en accessoires. Kwaliteit met garantie.',
};

// Mock data - will be replaced with Supabase queries
const mockCategories: Category[] = [
  { id: '1', name: 'Telefoons', slug: 'telefoons', description: '', created_at: '' },
  { id: '2', name: 'Laptops', slug: 'laptops', description: '', created_at: '' },
  { id: '3', name: 'Tablets', slug: 'tablets', description: '', created_at: '' },
  { id: '4', name: 'Accessoires', slug: 'accessoires', description: '', created_at: '' },
];

const mockBrands = ['Apple', 'Samsung', 'Lenovo', 'HP', 'Dell', 'Google'];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro 128GB Space Black',
    slug: 'iphone-14-pro-128gb-space-black',
    category_id: '1',
    brand: 'Apple',
    price: 799,
    original_price: 1199,
    condition_grade: 'zeer_goed',
    description: 'iPhone 14 Pro in uitstekende staat',
    specifications: {},
    stock_quantity: 5,
    image_urls: [],
    warranty_months: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23 Ultra 256GB',
    slug: 'samsung-galaxy-s23-ultra-256gb',
    category_id: '1',
    brand: 'Samsung',
    price: 899,
    original_price: 1399,
    condition_grade: 'als_nieuw',
    description: 'Samsung Galaxy S23 Ultra in nieuwstaat',
    specifications: {},
    stock_quantity: 3,
    image_urls: [],
    warranty_months: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'MacBook Air M2 13 inch 256GB',
    slug: 'macbook-air-m2-256gb',
    category_id: '2',
    brand: 'Apple',
    price: 999,
    original_price: 1399,
    condition_grade: 'zeer_goed',
    description: 'MacBook Air met M2 chip',
    specifications: {},
    stock_quantity: 4,
    image_urls: [],
    warranty_months: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'iPad Pro 11 inch M2 128GB',
    slug: 'ipad-pro-11-m2-128gb',
    category_id: '3',
    brand: 'Apple',
    price: 699,
    original_price: 999,
    condition_grade: 'zeer_goed',
    description: 'iPad Pro 11 inch met M2 chip',
    specifications: {},
    stock_quantity: 4,
    image_urls: [],
    warranty_months: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'iPhone 13 128GB Blauw',
    slug: 'iphone-13-128gb-blauw',
    category_id: '1',
    brand: 'Apple',
    price: 549,
    original_price: 899,
    condition_grade: 'goed',
    description: 'iPhone 13 in goede staat',
    specifications: {},
    stock_quantity: 8,
    image_urls: [],
    warranty_months: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'MacBook Pro 14 inch M3 512GB',
    slug: 'macbook-pro-14-m3-512gb',
    category_id: '2',
    brand: 'Apple',
    price: 1699,
    original_price: 2199,
    condition_grade: 'als_nieuw',
    description: 'MacBook Pro 14 inch met M3 chip',
    specifications: {},
    stock_quantity: 2,
    image_urls: [],
    warranty_months: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Samsung Galaxy Tab S9 128GB',
    slug: 'samsung-galaxy-tab-s9-128gb',
    category_id: '3',
    brand: 'Samsung',
    price: 549,
    original_price: 849,
    condition_grade: 'zeer_goed',
    description: 'Samsung Galaxy Tab S9',
    specifications: {},
    stock_quantity: 5,
    image_urls: [],
    warranty_months: 12,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Lenovo ThinkPad X1 Carbon',
    slug: 'lenovo-thinkpad-x1-carbon',
    category_id: '2',
    brand: 'Lenovo',
    price: 1099,
    original_price: 1799,
    condition_grade: 'zeer_goed',
    description: 'Lenovo ThinkPad X1 Carbon Gen 11',
    specifications: {},
    stock_quantity: 3,
    image_urls: [],
    warranty_months: 12,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'iPhone 12 64GB Wit',
    slug: 'iphone-12-64gb-wit',
    category_id: '1',
    brand: 'Apple',
    price: 399,
    original_price: 699,
    condition_grade: 'goed',
    description: 'iPhone 12 in goede staat',
    specifications: {},
    stock_quantity: 12,
    image_urls: [],
    warranty_months: 12,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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

  // Filter products based on search params (mock implementation)
  let filteredProducts = [...mockProducts];

  if (categorie) {
    const cat = mockCategories.find((c) => c.slug === categorie);
    if (cat) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category_id === cat.id
      );
    }
  }

  if (merk) {
    filteredProducts = filteredProducts.filter(
      (p) => p.brand.toLowerCase() === merk.toLowerCase()
    );
  }

  if (min) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseFloat(min)
    );
  }

  if (max) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseFloat(max)
    );
  }

  if (conditie) {
    const conditions = conditie.split(',') as ConditionGrade[];
    filteredProducts = filteredProducts.filter((p) =>
      conditions.includes(p.condition_grade)
    );
  }

  if (zoek) {
    const searchLower = zoek.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
    );
  }

  // Sort products
  switch (sorteer) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      filteredProducts.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  // Pagination
  const currentPage = parseInt(pagina) || 1;
  const itemsPerPage = 9;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get category name for header
  const categoryName = categorie
    ? mockCategories.find((c) => c.slug === categorie)?.name
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
                  categories={mockCategories}
                  brands={mockBrands}
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
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
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
