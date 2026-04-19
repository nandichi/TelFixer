import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { getMollieClient, getAppUrl, isMollieConfigured } from '@/lib/mollie';
import { generateOrderNumber } from '@/lib/utils';

const bodySchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    company: z.string().nullable().optional(),
    email: z.string().email(),
    phone: z.string().min(10),
  }),
  shippingAddress: z.object({
    street: z.string().min(2),
    houseNumber: z.string().min(1),
    postalCode: z.string().min(6),
    city: z.string().min(2),
    country: z.string().default('NL'),
    company: z.string().nullable().optional(),
  }),
  billingSameAsShipping: z.boolean(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
      })
    )
    .min(1),
  totals: z.object({
    subtotal: z.number().nonnegative(),
    shipping: z.number().nonnegative(),
    total: z.number().positive(),
  }),
});

export async function POST(request: Request) {
  try {
    if (!isMollieConfigured()) {
      return NextResponse.json(
        { error: 'Mollie is nog niet geconfigureerd op de server' },
        { status: 500 }
      );
    }

    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ongeldige invoer', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { customer, shippingAddress, billingSameAsShipping, items, totals } =
      parsed.data;

    // Verify the sum of items matches totals (tamper-proof)
    const serverSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const diff = Math.abs(serverSubtotal - totals.subtotal);
    if (diff > 0.02) {
      return NextResponse.json(
        { error: 'Subtotaal komt niet overeen met items' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Try to associate order with authenticated user
    let userId: string | null = null;
    try {
      const authed = await createServerSupabase();
      const { data: userRes } = await authed.auth.getUser();
      userId = userRes.user?.id || null;
    } catch {
      userId = null;
    }

    const orderNumber = generateOrderNumber();

    const addressPayload = {
      first_name: customer.firstName,
      last_name: customer.lastName,
      company: shippingAddress.company || customer.company || null,
      street: shippingAddress.street,
      house_number: shippingAddress.houseNumber,
      postal_code: shippingAddress.postalCode,
      city: shippingAddress.city,
      country: shippingAddress.country || 'NL',
      phone: customer.phone,
      email: customer.email,
    };

    const { data: orderRow, error: insertError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId,
        total_price: totals.total,
        shipping_cost: totals.shipping,
        tax: 0,
        status: 'in_behandeling',
        shipping_address: addressPayload,
        billing_address: billingSameAsShipping ? addressPayload : addressPayload,
        payment_status: 'pending',
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_phone: customer.phone,
      })
      .select('id, order_number')
      .single();

    if (insertError || !orderRow) {
      console.error('Order insert error:', insertError);
      return NextResponse.json(
        { error: 'Kon bestelling niet opslaan' },
        { status: 500 }
      );
    }

    // Insert order items
    const itemRows = items.map((item) => ({
      order_id: orderRow.id,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemRows);

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      return NextResponse.json(
        { error: 'Kon besteldetails niet opslaan' },
        { status: 500 }
      );
    }

    // Create Mollie payment
    const mollie = getMollieClient();
    const appUrl = getAppUrl();

    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: totals.total.toFixed(2),
      },
      description: `TelFixer bestelling ${orderRow.order_number}`,
      redirectUrl: `${appUrl}/checkout/bevestiging?order=${orderRow.order_number}`,
      webhookUrl: `${appUrl}/api/mollie/webhook`,
      metadata: {
        order_id: orderRow.id,
        order_number: orderRow.order_number,
      },
    });

    const { error: updateError } = await supabase
      .from('orders')
      .update({ mollie_payment_id: payment.id })
      .eq('id', orderRow.id);

    if (updateError) {
      console.error('Order update (mollie id) error:', updateError);
    }

    const checkoutUrl = payment.getCheckoutUrl();

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Mollie heeft geen checkout URL teruggegeven' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl,
      orderNumber: orderRow.order_number,
    });
  } catch (err) {
    console.error('Create payment error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Serverfout' },
      { status: 500 }
    );
  }
}
