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

export interface WarrantySettings {
  phones_months: number;
  laptops_months: number;
  tablets_months: number;
  repairs_months: number;
  accessories_new_months: number;
  accessories_used_months: number;
  new_devices_months: number;
  battery_min_percentage: number;
  laptop_max_cycles: number;
}

export interface AboutStatsSettings {
  customers: string;
  phones_sold: string;
  devices_repaired: string;
  satisfaction: string;
  ivan_photo_url: string;
}

export interface InstagramSettings {
  profile_url: string;
  posts: string[];
}

export interface ContentSettings {
  product_stock_label: string;
  submission_followup: string;
  checkout_dispatch: string;
}

export interface GoogleReview {
  id: string;
  author_name: string;
  author_photo_url?: string;
  rating: number;
  date: string;
  text: string;
}

export interface GoogleReviewsSettings {
  enabled: boolean;
  business_name: string;
  overall_rating: number;
  total_reviews: number;
  review_url: string;
  write_review_url: string;
  reviews: GoogleReview[];
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

export const DEFAULT_WARRANTY: WarrantySettings = {
  phones_months: 6,
  laptops_months: 6,
  tablets_months: 6,
  repairs_months: 3,
  accessories_new_months: 24,
  accessories_used_months: 6,
  new_devices_months: 24,
  battery_min_percentage: 85,
  laptop_max_cycles: 250,
};

export async function getWarrantySettings(): Promise<WarrantySettings> {
  const settings = await getSetting<WarrantySettings>("warranty");
  return { ...DEFAULT_WARRANTY, ...(settings || {}) };
}

export const DEFAULT_ABOUT_STATS: AboutStatsSettings = {
  customers: "200+",
  phones_sold: "300+",
  devices_repaired: "400+",
  satisfaction: "98%",
  ivan_photo_url: "",
};

export async function getAboutStatsSettings(): Promise<AboutStatsSettings> {
  const settings = await getSetting<AboutStatsSettings>("about_stats");
  return { ...DEFAULT_ABOUT_STATS, ...(settings || {}) };
}

export const DEFAULT_INSTAGRAM: InstagramSettings = {
  profile_url: "https://www.instagram.com/telfixer/",
  posts: [
    "https://www.instagram.com/p/DQEN97EDEMK/",
    "https://www.instagram.com/p/DRW2A48DOUc/",
    "https://www.instagram.com/p/DSFJYuhjKYs/",
  ],
};

export async function getInstagramSettings(): Promise<InstagramSettings> {
  const settings = await getSetting<InstagramSettings>("instagram");
  if (!settings) return DEFAULT_INSTAGRAM;
  return {
    profile_url: settings.profile_url || DEFAULT_INSTAGRAM.profile_url,
    posts:
      Array.isArray(settings.posts) && settings.posts.length > 0
        ? settings.posts.filter((p) => typeof p === "string" && p.trim() !== "")
        : DEFAULT_INSTAGRAM.posts,
  };
}

export const DEFAULT_CONTENT: ContentSettings = {
  product_stock_label: "Direct uit voorraad leverbaar",
  submission_followup:
    "Je ontvangt binnen 2 werkdagen een prijsaanbod per e-mail en WhatsApp. Als je akkoord gaat, ontvang je gratis verzendlabels om het apparaat naar ons toe te sturen.",
  checkout_dispatch: "Je bestelling wordt zo snel mogelijk verzonden",
};

export async function getContentSettings(): Promise<ContentSettings> {
  const settings = await getSetting<ContentSettings>("content");
  return { ...DEFAULT_CONTENT, ...(settings || {}) };
}

export const DEFAULT_GOOGLE_REVIEWS: GoogleReviewsSettings = {
  enabled: true,
  business_name: "TelFixer",
  overall_rating: 5.0,
  total_reviews: 0,
  review_url:
    "https://www.google.com/search?q=TelFixer+Reviews#lkt=LocalPoiReviews",
  write_review_url: "",
  reviews: [],
};

export async function getGoogleReviewsSettings(): Promise<GoogleReviewsSettings> {
  const settings = await getSetting<GoogleReviewsSettings>("google_reviews");
  if (!settings) return DEFAULT_GOOGLE_REVIEWS;
  return {
    ...DEFAULT_GOOGLE_REVIEWS,
    ...settings,
    reviews: Array.isArray(settings.reviews) ? settings.reviews : [],
  };
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
