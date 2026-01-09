import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support both old anon key and new publishable key
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Controleer of de credentials correct zijn ingesteld
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("jouw-project-id") &&
  !supabaseAnonKey.includes("jouw-anon");

export function createClient() {
  if (!isConfigured) {
    throw new Error(
      "Supabase is niet geconfigureerd. " +
        "Vul je NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY (of NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) in de .env.local file. " +
        "Je vindt deze in je Supabase dashboard: https://supabase.com/dashboard/project/_/settings/api"
    );
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(isConfigured);
}
