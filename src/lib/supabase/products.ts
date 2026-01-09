import { createClient, isSupabaseConfigured } from "./server";
import { Product, ProductFilters, PaginatedResponse, Category } from "@/types";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  if (!isSupabaseConfigured()) {
    return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }

  const supabase = await createClient();

  const {
    category,
    brand,
    minPrice,
    maxPrice,
    condition,
    search,
    sort = "newest",
    page = 1,
    limit = 12,
  } = filters;

  let query = supabase
    .from("products")
    .select("*, categories!inner(id, name, slug)", { count: "exact" })
    .eq("active", true);

  // Category filter
  if (category) {
    query = query.eq("categories.slug", category);
  }

  // Brand filter
  if (brand) {
    query = query.ilike("brand", brand);
  }

  // Price range filter
  if (minPrice !== undefined) {
    query = query.gte("price", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice);
  }

  // Condition filter
  if (condition && condition.length > 0) {
    query = query.in("condition_grade", condition);
  }

  // Search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  // Sorting
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  // Transform the data to match our Product type
  const products: Product[] = (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category_id: item.category_id,
    category: item.categories,
    brand: item.brand,
    price: parseFloat(item.price),
    original_price: item.original_price
      ? parseFloat(item.original_price)
      : null,
    condition_grade: item.condition_grade,
    description: item.description,
    specifications: item.specifications,
    stock_quantity: item.stock_quantity,
    image_urls: item.image_urls,
    warranty_months: item.warranty_months,
    featured: item.featured,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));

  const total = count || 0;

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) {
    console.error("Error fetching product:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    category_id: data.category_id,
    category: data.categories,
    brand: data.brand,
    price: parseFloat(data.price),
    original_price: data.original_price
      ? parseFloat(data.original_price)
      : null,
    condition_grade: data.condition_grade,
    description: data.description,
    specifications: data.specifications,
    stock_quantity: data.stock_quantity,
    image_urls: data.image_urls,
    warranty_months: data.warranty_months,
    featured: data.featured,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("active", true)
    .eq("featured", true)
    .gt("stock_quantity", 0)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category_id: item.category_id,
    category: item.categories,
    brand: item.brand,
    price: parseFloat(item.price),
    original_price: item.original_price
      ? parseFloat(item.original_price)
      : null,
    condition_grade: item.condition_grade,
    description: item.description,
    specifications: item.specifications,
    stock_quantity: item.stock_quantity,
    image_urls: item.image_urls,
    warranty_months: item.warranty_months,
    featured: item.featured,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("active", true)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .gt("stock_quantity", 0)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category_id: item.category_id,
    category: item.categories,
    brand: item.brand,
    price: parseFloat(item.price),
    original_price: item.original_price
      ? parseFloat(item.original_price)
      : null,
    condition_grade: item.condition_grade,
    description: item.description,
    specifications: item.specifications,
    stock_quantity: item.stock_quantity,
    image_urls: item.image_urls,
    warranty_months: item.warranty_months,
    featured: item.featured,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function getCategoriesWithCount(): Promise<
  (Category & { product_count: number })[]
> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (catError) {
    console.error("Error fetching categories:", catError);
    return [];
  }

  // Get product counts per category
  const categoriesWithCount = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", cat.id)
        .eq("active", true);

      return {
        ...cat,
        product_count: count || 0,
      };
    })
  );

  return categoriesWithCount;
}

export async function getBrands(categorySlug?: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("brand, categories!inner(slug)")
    .eq("active", true);

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  // Get unique brands
  const brands = [...new Set((data || []).map((item) => item.brand))].sort();
  return brands;
}
