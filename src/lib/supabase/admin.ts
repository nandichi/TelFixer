import { createClient, isSupabaseConfigured } from "./server";

export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admins")
    .select("id, role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function getAdminByUserId(userId: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    email: data.email,
    role: data.role as "admin" | "support",
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function getAllAdmins() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    email: item.email,
    role: item.role as "admin" | "support",
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}
