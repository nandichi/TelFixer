import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getMollieClient, isMollieConfigured } from '@/lib/mollie';
import { sendOrderConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!isMollieConfigured()) {
      return NextResponse.json(
        { error: 'Mollie niet geconfigureerd' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const paymentId = formData.get('id');

    if (typeof paymentId !== 'string' || !paymentId) {
      return NextResponse.json(
        { error: 'Ongeldig payment id' },
        { status: 400 }
      );
    }

    const mollie = getMollieClient();
    const payment = await mollie.payments.get(paymentId);

    const supabase = createServiceClient();

    // Find order by mollie_payment_id OR by metadata.order_id
    const orderIdFromMeta =
      (payment.metadata as { order_id?: string } | null | undefined)?.order_id ||
      null;

    let orderQuery = supabase
      .from('orders')
      .select(
        'id, order_number, payment_status, status, total_price, shipping_cost, customer_email, customer_name, shipping_address, order_items(product_name, quantity, price_at_purchase)'
      );

    if (orderIdFromMeta) {
      orderQuery = orderQuery.eq('id', orderIdFromMeta);
    } else {
      orderQuery = orderQuery.eq('mollie_payment_id', paymentId);
    }

    const { data: order, error: orderError } = await orderQuery.maybeSingle();

    if (orderError || !order) {
      console.error('Webhook: order niet gevonden', orderError);
      return NextResponse.json({ ok: true });
    }

    // Map Mollie status to our internal statuses
    let paymentStatus:
      | 'pending'
      | 'paid'
      | 'failed'
      | 'refunded' = 'pending';
    let orderStatus: 'in_behandeling' | 'betaald' | 'geannuleerd' =
      'in_behandeling';

    const status = String(payment.status);
    if (status === 'paid') {
      paymentStatus = 'paid';
      orderStatus = 'betaald';
    } else if (
      status === 'canceled' ||
      status === 'failed' ||
      status === 'expired'
    ) {
      paymentStatus = 'failed';
      orderStatus = 'geannuleerd';
    } else if (status === 'refunded') {
      paymentStatus = 'refunded';
    }

    const paymentMethod = payment.method || null;

    const wasAlreadyPaid = order.payment_status === 'paid';

    await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        payment_method: paymentMethod,
      })
      .eq('id', order.id);

    // Send confirmation email on first successful payment
    if (paymentStatus === 'paid' && !wasAlreadyPaid && order.customer_email) {
      try {
        const shipping = order.shipping_address as Record<string, string> | null;
        const addressLines: string[] = [];
        if (shipping) {
          const fullName =
            `${shipping.first_name || ''} ${shipping.last_name || ''}`.trim();
          if (fullName) addressLines.push(fullName);
          if (shipping.company) addressLines.push(shipping.company);
          if (shipping.street || shipping.house_number) {
            addressLines.push(
              `${shipping.street || ''} ${shipping.house_number || ''}`.trim()
            );
          }
          if (shipping.postal_code || shipping.city) {
            addressLines.push(
              `${shipping.postal_code || ''} ${shipping.city || ''}`.trim()
            );
          }
          if (shipping.country) addressLines.push(shipping.country);
        }

        const totalPrice = parseFloat(String(order.total_price || 0));
        const shippingCost = parseFloat(String(order.shipping_cost || 0));
        const items = (order.order_items || []).map(
          (item: {
            product_name: string;
            quantity: number;
            price_at_purchase: string | number;
          }) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: parseFloat(String(item.price_at_purchase)),
          })
        );
        const subtotal = items.reduce(
          (sum: number, item: { price: number; quantity: number }) =>
            sum + item.price * item.quantity,
          0
        );

        await sendOrderConfirmationEmail({
          customerName: order.customer_name || '',
          customerEmail: order.customer_email,
          orderNumber: order.order_number,
          items,
          subtotal,
          shipping: shippingCost,
          total: totalPrice,
          shippingAddress: addressLines.join('\n'),
        });
      } catch (err) {
        console.error('Order email dispatch failed:', err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Mollie webhook error:', err);
    // Return 200 to avoid Mollie retry storms on transient errors, but log the error
    return NextResponse.json({ ok: false });
  }
}

// Allow Mollie HEAD/GET probes (some environments)
export async function GET() {
  return NextResponse.json({ ok: true });
}
