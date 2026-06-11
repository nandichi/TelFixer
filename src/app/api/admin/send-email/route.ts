import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminContext } from '@/lib/supabase/admin-auth';
import { isEmailConfigured, sendAdminCustomerEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  to: z.string().email(),
  customerName: z.string().trim().max(120).optional(),
  subject: z.string().trim().min(1).max(200),
  heading: z.string().trim().min(1).max(160),
  bodyText: z.string().trim().min(1).max(8000),
  ctaUrl: z.string().trim().max(500).optional(),
  ctaLabel: z.string().trim().max(80).optional(),
});

export async function POST(request: Request) {
  const ctx = await getAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        error:
          'E-mailservice is niet geconfigureerd (RESEND_API_KEY ontbreekt).',
      },
      { status: 503 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 });
  }

  const d = parsed.data;
  const hasCta = !!(d.ctaUrl && d.ctaUrl.trim() && d.ctaLabel && d.ctaLabel.trim());

  const result = await sendAdminCustomerEmail({
    to: d.to,
    customerName: d.customerName || undefined,
    subject: d.subject,
    heading: d.heading,
    bodyText: d.bodyText,
    ctaUrl: hasCta ? d.ctaUrl : undefined,
    ctaLabel: hasCta ? d.ctaLabel : undefined,
    replyTo: process.env.CONTACT_INBOX_EMAIL || 'info@telfixer.nl',
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Versturen mislukt' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
