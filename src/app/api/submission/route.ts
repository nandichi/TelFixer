import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { generateReferenceNumber } from '@/lib/utils';
import { sendSubmissionConfirmationEmail } from '@/lib/email';

const bodySchema = z.object({
  deviceType: z.string().min(1),
  deviceTypeLabel: z.string().optional(),
  deviceBrand: z.string().min(1),
  deviceBrandLabel: z.string().optional(),
  deviceModel: z.string().min(1),
  conditionDescription: z.string().min(20),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  photoUrls: z.array(z.string()).default([]),
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
    const supabase = createServiceClient();

    let userId: string | null = null;
    try {
      const sessionClient = await createServerSupabaseClient();
      const {
        data: { user },
      } = await sessionClient.auth.getUser();
      userId = user?.id ?? null;
    } catch (err) {
      console.warn('Submission: kon ingelogde gebruiker niet ophalen', err);
    }

    const referenceNumber = generateReferenceNumber();

    const { error: insertError } = await supabase
      .from('device_submissions')
      .insert({
        reference_number: referenceNumber,
        device_type: data.deviceType,
        device_brand: data.deviceBrandLabel || data.deviceBrand,
        device_model: data.deviceModel,
        condition_description: data.conditionDescription,
        photos_urls: data.photoUrls,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        status: 'ontvangen',
        user_id: userId,
      });

    if (insertError) {
      console.error('Submission insert error:', insertError);
      return NextResponse.json(
        { error: 'Kon inlevering niet opslaan' },
        { status: 500 }
      );
    }

    sendSubmissionConfirmationEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      referenceNumber,
      deviceType: data.deviceTypeLabel || data.deviceType,
      deviceBrand: data.deviceBrandLabel || data.deviceBrand,
      deviceModel: data.deviceModel,
      conditionDescription: data.conditionDescription,
    }).catch((err) => {
      console.error('Submission email dispatch failed:', err);
    });

    return NextResponse.json({ success: true, referenceNumber });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Serverfout' },
      { status: 500 }
    );
  }
}
