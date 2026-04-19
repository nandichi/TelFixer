import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';
import { generateReferenceNumber } from '@/lib/utils';
import { sendRepairRequestEmail } from '@/lib/email';

const bodySchema = z.object({
  deviceType: z.string().min(1),
  deviceBrand: z.string().min(1),
  deviceModel: z.string().min(1),
  repairType: z.string().min(1),
  problemDescription: z.string().min(10),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(/^\d{10}$/),
  customerAddress: z.string().optional().nullable(),
  preferredDate: z.string().optional().nullable(),
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

    const referenceNumber = generateReferenceNumber();

    const { error: insertError } = await supabase
      .from('repair_requests')
      .insert({
        reference_number: referenceNumber,
        device_type: data.deviceType,
        device_brand: data.deviceBrand,
        device_model: data.deviceModel,
        repair_type: data.repairType,
        problem_description: data.problemDescription,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        customer_address: data.customerAddress || null,
        preferred_date: data.preferredDate || null,
        status: 'ontvangen',
      });

    if (insertError) {
      console.error('Repair insert error:', insertError);
      return NextResponse.json(
        { error: 'Kon reparatieaanvraag niet opslaan' },
        { status: 500 }
      );
    }

    // Fire-and-forget email; don't block the response on email failures
    sendRepairRequestEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      referenceNumber,
      deviceType: data.deviceType,
      deviceBrand: data.deviceBrand,
      deviceModel: data.deviceModel,
      repairType: data.repairType,
      problemDescription: data.problemDescription,
    }).catch((err) => {
      console.error('Repair email dispatch failed:', err);
    });

    return NextResponse.json({ success: true, referenceNumber });
  } catch (err) {
    console.error('Repair request error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Serverfout' },
      { status: 500 }
    );
  }
}
