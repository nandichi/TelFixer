import { createClient as createServerSupabase } from './server';
import { createServiceClient } from './service';

export interface AdminContext {
  userId: string;
  email: string;
  role: 'admin' | 'support';
}

/**
 * Resolve the currently authenticated admin (if any) from the request cookies.
 * Returns null when the visitor is not logged in or is not an admin.
 *
 * Use this in API routes that perform privileged actions. The lookup itself
 * runs with the service role so it works regardless of the admins table RLS.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  try {
    const authed = await createServerSupabase();
    const {
      data: { user },
    } = await authed.auth.getUser();

    if (!user) return null;

    const service = createServiceClient();
    const { data } = await service
      .from('admins')
      .select('email, role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!data) return null;

    return {
      userId: user.id,
      email: data.email,
      role: data.role as 'admin' | 'support',
    };
  } catch {
    return null;
  }
}
