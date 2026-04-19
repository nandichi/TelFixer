/**
 * Bouwt OIDC / OAuth 2.0 discovery metadata die wijst naar de Supabase
 * Auth endpoints. Supabase Auth is de authorization server voor TelFixer.
 */

const SITE_ORIGIN = 'https://telfixer.nl';

export type OidcMetadata = ReturnType<typeof buildOidcMetadata>;

function getSupabaseAuthBase(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  return `${url.replace(/\/$/, '')}/auth/v1`;
}

export function buildOidcMetadata() {
  const base = getSupabaseAuthBase();
  if (!base) return null;

  return {
    issuer: base,
    authorization_endpoint: `${base}/authorize`,
    token_endpoint: `${base}/token`,
    userinfo_endpoint: `${base}/user`,
    jwks_uri: `${base}/.well-known/jwks.json`,
    end_session_endpoint: `${base}/logout`,
    response_types_supported: ['code', 'token', 'id_token'],
    grant_types_supported: [
      'authorization_code',
      'refresh_token',
      'password',
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
    ],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256', 'HS256'],
    scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post', 'none'],
    code_challenge_methods_supported: ['S256', 'plain'],
    service_documentation: `${SITE_ORIGIN}/api/v1/public/docs`,
  };
}
