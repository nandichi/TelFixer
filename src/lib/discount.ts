import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';

export interface DiscountValidation {
  valid: boolean;
  error?: string;
  code?: string;
  description?: string;
  type?: 'percentage' | 'fixed';
  value?: number;
  discountAmount?: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Validate a discount code against a given subtotal and compute the discount.
 * Runs with the service role so it can read the admin-only discount_codes table.
 * Returns a structured result; never throws.
 */
export async function validateDiscountCode(
  rawCode: string,
  subtotal: number
): Promise<DiscountValidation> {
  const code = (rawCode || '').trim();
  if (!code) return { valid: false, error: 'Vul een kortingscode in' };

  try {
    const service = createServiceClient();
    const { data, error } = await service
      .from('discount_codes')
      .select(
        'code, description, type, value, active, min_order_amount, max_uses, used_count, starts_at, expires_at'
      )
      .ilike('code', code)
      .maybeSingle();

    if (error || !data) {
      return { valid: false, error: 'Deze kortingscode bestaat niet' };
    }
    if (!data.active) {
      return { valid: false, error: 'Deze kortingscode is niet meer geldig' };
    }

    const now = Date.now();
    if (data.starts_at && new Date(data.starts_at).getTime() > now) {
      return { valid: false, error: 'Deze kortingscode is nog niet geldig' };
    }
    if (data.expires_at && new Date(data.expires_at).getTime() < now) {
      return { valid: false, error: 'Deze kortingscode is verlopen' };
    }
    if (
      data.max_uses != null &&
      data.max_uses > 0 &&
      (data.used_count ?? 0) >= data.max_uses
    ) {
      return {
        valid: false,
        error: 'Deze kortingscode is niet meer beschikbaar',
      };
    }

    const minAmount = Number(data.min_order_amount ?? 0);
    if (minAmount > 0 && subtotal < minAmount) {
      return {
        valid: false,
        error: `Geldig vanaf een bestelbedrag van ${formatPrice(minAmount)}`,
      };
    }

    const value = Number(data.value);
    let discount =
      data.type === 'percentage' ? (subtotal * value) / 100 : value;
    discount = Math.min(discount, subtotal);
    discount = round2(discount);

    if (discount <= 0) {
      return { valid: false, error: 'Korting is niet van toepassing' };
    }

    return {
      valid: true,
      code: data.code,
      description: data.description ?? undefined,
      type: data.type as 'percentage' | 'fixed',
      value,
      discountAmount: discount,
    };
  } catch {
    return { valid: false, error: 'Kon kortingscode niet controleren' };
  }
}
