import { createClient, isSupabaseConfigured } from "./server";
import { Category } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    created_at: item.created_at,
  }));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching category:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    created_at: data.created_at,
  };
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    created_at: data.created_at,
  };
}

export async function createCategory(category: {
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
}): Promise<{ data: Category | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      sort_order: category.sort_order || 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      created_at: data.created_at,
    },
    error: null,
  };
}

export async function updateCategory(
  id: string,
  updates: {
    name?: string;
    slug?: string;
    description?: string;
    sort_order?: number;
  }
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function deleteCategory(id: string): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  // Check if there are products in this category
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      error: new Error(
        `Deze categorie bevat ${count} product(en). Verwijder of verplaats eerst de producten.`
      ),
    };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function getCategoriesWithProductCount(): Promise<
  (Category & { product_count: number })[]
> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*, products(id)")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Error fetching categories with count:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    created_at: item.created_at,
    product_count: item.products?.length || 0,
  }));
}
