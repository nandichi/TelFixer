import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Verificatie-callback voor e-mailbevestiging na registratie.
 *
 * Supabase stuurt de gebruiker hierheen via de bevestigingslink. We
 * ondersteunen beide varianten:
 *  - PKCE: ?code=...           -> exchangeCodeForSession
 *  - OTP : ?token_hash=&type=  -> verifyOtp
 *
 * Het profiel in public.users wordt automatisch aangemaakt door de
 * database-trigger on_auth_user_created (handle_new_user), dus hier
 * verifieren we alleen en sturen we de gebruiker door.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  // Alleen interne, relatieve paden toestaan (voorkomt open redirect).
  const nextParam = searchParams.get('next') ?? '/account';
  const next =
    nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/account';

  const supabase = await createClient();

  let verified = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    verified = !error;
  }

  if (!verified) {
    return NextResponse.redirect(`${origin}/login?error=verificatie_mislukt`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
