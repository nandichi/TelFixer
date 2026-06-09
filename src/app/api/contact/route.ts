import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  sendContactNotificationEmail,
  sendContactConfirmationEmail,
} from '@/lib/email';

const subjectLabels: Record<string, string> = {
  vraag: 'Algemene vraag',
  bestelling: 'Vraag over mijn bestelling',
  inlevering: 'Vraag over mijn inlevering',
  garantie: 'Garantie of reparatie',
  zakelijk: 'Zakelijke samenwerking',
  anders: 'Anders',
};

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  subject: z.enum(Object.keys(subjectLabels) as [string, ...string[]]),
  message: z.string().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ongeldige invoer', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const emailData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subjectLabel: subjectLabels[data.subject],
      message: data.message,
    };

    const notification = await sendContactNotificationEmail(emailData);

    if (!notification.success) {
      console.error('Contact notification failed:', notification.error);
      return NextResponse.json(
        { error: 'Bericht kon niet worden verzonden. Probeer het later opnieuw.' },
        { status: 500 }
      );
    }

    // Auto-reply naar de klant is secundair; een fout hier mag de aanvraag niet laten falen.
    sendContactConfirmationEmail(emailData).catch((err) => {
      console.error('Contact confirmation dispatch failed:', err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Serverfout' },
      { status: 500 }
    );
  }
}
