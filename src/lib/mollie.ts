import createMollieClient, { MollieClient } from '@mollie/api-client';

let cachedClient: MollieClient | null = null;

export function getMollieClient(): MollieClient {
  if (!cachedClient) {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey || apiKey.includes('REPLACE_ME')) {
      throw new Error(
        'MOLLIE_API_KEY ontbreekt of is nog niet ingevuld in de server-omgeving'
      );
    }
    cachedClient = createMollieClient({ apiKey });
  }
  return cachedClient;
}

export function isMollieConfigured(): boolean {
  const apiKey = process.env.MOLLIE_API_KEY;
  return Boolean(apiKey && !apiKey.includes('REPLACE_ME'));
}

export function getAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  // Fallback for Vercel preview/prod
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
