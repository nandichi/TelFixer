import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  cloudinary,
  isCloudinaryConfigured,
  CLOUDINARY_PRODUCTS_FOLDER,
} from '@/lib/cloudinary';

/**
 * Genereert een korte, ondertekende upload-handtekening voor Cloudinary.
 * Alleen ingelogde admins krijgen een handtekening. Het bestand zelf gaat
 * daarna rechtstreeks van de browser naar Cloudinary (omzeilt de 4,5MB
 * request-limiet van Vercel) terwijl het api_secret server-side blijft.
 */
export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!admin) {
    return NextResponse.json({ error: 'Geen toegang' }, { status: 403 });
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      { error: 'Cloudinary is niet geconfigureerd op de server' },
      { status: 500 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);

  // Deze parameters worden ondertekend en moeten exact overeenkomen met wat
  // de client meestuurt (api_key, file en signature worden niet ondertekend).
  const paramsToSign = {
    timestamp,
    folder: CLOUDINARY_PRODUCTS_FOLDER,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: CLOUDINARY_PRODUCTS_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
