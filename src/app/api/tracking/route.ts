import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = (searchParams.get('ref') || '').trim();

    if (!ref) {
      return NextResponse.json(
        { error: 'Referentienummer ontbreekt' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const upper = ref.toUpperCase();

    // 1. device_submissions
    {
      const { data } = await supabase
        .from('device_submissions')
        .select(
          'id, reference_number, device_type, device_brand, device_model, condition_description, status, offered_price, offer_accepted, evaluation_notes, created_at, updated_at'
        )
        .eq('reference_number', upper)
        .maybeSingle();

      if (data) {
        return NextResponse.json({
          kind: 'submission' as const,
          reference_number: data.reference_number,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          details: {
            device: `${data.device_brand} ${data.device_model}`.trim(),
            deviceType: data.device_type,
            condition: data.condition_description,
            offeredPrice: data.offered_price
              ? parseFloat(String(data.offered_price))
              : null,
            offerAccepted: data.offer_accepted,
            evaluationNotes: data.evaluation_notes,
          },
        });
      }
    }

    // 2. repair_requests
    {
      const { data } = await supabase
        .from('repair_requests')
        .select(
          'id, reference_number, device_type, device_brand, device_model, repair_type, problem_description, status, price, notes, created_at, updated_at'
        )
        .eq('reference_number', upper)
        .maybeSingle();

      if (data) {
        return NextResponse.json({
          kind: 'repair' as const,
          reference_number: data.reference_number,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          details: {
            device: `${data.device_brand} ${data.device_model}`.trim(),
            deviceType: data.device_type,
            repairType: data.repair_type,
            problem: data.problem_description,
            price: data.price ? parseFloat(String(data.price)) : null,
            notes: data.notes,
          },
        });
      }
    }

    // 3. orders (search on order_number)
    {
      const { data } = await supabase
        .from('orders')
        .select(
          'id, order_number, status, payment_status, total_price, tracking_number, shipping_address, created_at, updated_at, order_items(product_name, quantity, price_at_purchase)'
        )
        .eq('order_number', upper)
        .maybeSingle();

      if (data) {
        return NextResponse.json({
          kind: 'order' as const,
          reference_number: data.order_number,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          details: {
            paymentStatus: data.payment_status,
            totalPrice: data.total_price ? parseFloat(String(data.total_price)) : null,
            trackingNumber: data.tracking_number,
            shippingAddress: data.shipping_address,
            items: (data.order_items || []).map((item: {
              product_name: string;
              quantity: number;
              price_at_purchase: string | number;
            }) => ({
              name: item.product_name,
              quantity: item.quantity,
              price: parseFloat(String(item.price_at_purchase)),
            })),
          },
        });
      }
    }

    return NextResponse.json(
      { error: 'Geen resultaten gevonden voor dit referentienummer' },
      { status: 404 }
    );
  } catch (err) {
    console.error('Tracking error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Serverfout' },
      { status: 500 }
    );
  }
}
