import { createClient, isSupabaseConfigured } from "./server";

export interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  kvk_number?: string;
  vat_number?: string;
}

export interface ShippingSettings {
  standard_cost: number;
  free_threshold: number;
  estimated_days: string;
}

export interface SocialSettings {
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  tiktok_url?: string;
}

export interface TaxSettings {
  rate: number;
}

export async function getSetting<T>(key: string): Promise<T | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) {
    return null;
  }

  return data.value as T;
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  if (!isSupabaseConfigured()) {
    return {};
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("site_settings").select("*");

  if (error || !data) {
    return {};
  }

  const settings: Record<string, unknown> = {};
  data.forEach((item) => {
    settings[item.key] = item.value;
  });

  return settings;
}

export async function updateSetting(
  key: string,
  value: unknown
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  // Check if setting exists
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .eq("key", key)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from("site_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (error) {
      console.error("Error updating setting:", error);
      return { error: new Error(error.message) };
    }
  } else {
    // Insert new
    const { error } = await supabase.from("site_settings").insert({
      key,
      value,
    });

    if (error) {
      console.error("Error inserting setting:", error);
      return { error: new Error(error.message) };
    }
  }

  return { error: null };
}

export async function getCompanySettings(): Promise<CompanySettings> {
  const settings = await getSetting<CompanySettings>("company");
  return (
    settings || {
      name: "TelFixer",
      email: "info@telfixer.nl",
      phone: "+31 6 44642162",
      address: "Houtrakbos 34, 6718HD, Ede",
    }
  );
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  const settings = await getSetting<ShippingSettings>("shipping");
  return (
    settings || {
      standard_cost: 6.95,
      free_threshold: 50,
      estimated_days: "2-4 werkdagen",
    }
  );
}

export async function getSocialSettings(): Promise<SocialSettings> {
  const settings = await getSetting<SocialSettings>("social");
  return settings || {};
}

export async function getTaxSettings(): Promise<TaxSettings> {
  const settings = await getSetting<TaxSettings>("tax");
  return settings || { rate: 21 };
}

export async function updateCompanySettings(
  settings: CompanySettings
): Promise<{ error: Error | null }> {
  return updateSetting("company", settings);
}

export async function updateShippingSettings(
  settings: ShippingSettings
): Promise<{ error: Error | null }> {
  return updateSetting("shipping", settings);
}

export async function updateSocialSettings(
  settings: SocialSettings
): Promise<{ error: Error | null }> {
  return updateSetting("social", settings);
}

export async function updateTaxSettings(
  settings: TaxSettings
): Promise<{ error: Error | null }> {
  return updateSetting("tax", settings);
}
