import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateDiscountCode } from '@/lib/discount';

export const dynamic = 'force-dynamic';

const schema = z.object({
  code: z.string().min(1).max(60),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, error: 'Ongeldige invoer' },
      { status: 400 }
    );
  }

  const result = await validateDiscountCode(
    parsed.data.code,
    parsed.data.subtotal
  );

  // Always 200: the `valid` flag drives the UI (invalid code is not an HTTP error)
  return NextResponse.json(result);
}
