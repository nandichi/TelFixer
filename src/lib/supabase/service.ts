import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

let cachedClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service role key.
 * Bypasses RLS - NEVER import this file from a client component.
 */
export function createServiceClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL ontbreekt');
  }
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY (of SUPABASE_SECRET_KEY) ontbreekt in de server-omgeving'
    );
  }

  if (!cachedClient) {
    cachedClient = createSupabaseClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedClient;
}

export function hasServiceRoleKey(): boolean {
  return Boolean(supabaseUrl && serviceRoleKey);
}
