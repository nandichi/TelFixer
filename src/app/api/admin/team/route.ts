import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminContext } from '@/lib/supabase/admin-auth';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const bodySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('add'),
    email: z.string().email(),
    role: z.enum(['admin', 'support']),
  }),
  z.object({
    action: z.literal('updateRole'),
    id: z.string().uuid(),
    role: z.enum(['admin', 'support']),
  }),
  z.object({
    action: z.literal('remove'),
    id: z.string().uuid(),
  }),
]);

export async function POST(request: Request) {
  const ctx = await getAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }
  if (ctx.role !== 'admin') {
    return NextResponse.json(
      { error: 'Alleen een administrator mag het team beheren' },
      { status: 403 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 });
  }

  const service = createServiceClient();
  const data = parsed.data;

  try {
    if (data.action === 'add') {
      const email = data.email.trim().toLowerCase();

      // Find the registered user by email
      const { data: userRow } = await service
        .from('users')
        .select('id, email')
        .ilike('email', email)
        .maybeSingle();

      if (!userRow) {
        return NextResponse.json(
          {
            error:
              'Geen account gevonden met dit e-mailadres. Vraag de persoon eerst een account aan te maken op de site.',
          },
          { status: 404 }
        );
      }

      const { data: existing } = await service
        .from('admins')
        .select('id')
        .eq('user_id', userRow.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: 'Deze persoon is al een teamlid' },
          { status: 409 }
        );
      }

      const { error } = await service.from('admins').insert({
        user_id: userRow.id,
        email: userRow.email,
        role: data.role,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true });
    }

    if (data.action === 'updateRole') {
      // Prevent removing the last administrator by demoting them
      if (data.role === 'support') {
        const { data: target } = await service
          .from('admins')
          .select('user_id, role')
          .eq('id', data.id)
          .maybeSingle();

        if (target?.role === 'admin') {
          const { count } = await service
            .from('admins')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'admin');

          if ((count ?? 0) <= 1) {
            return NextResponse.json(
              {
                error:
                  'Je kunt de laatste administrator niet degraderen. Maak eerst iemand anders administrator.',
              },
              { status: 400 }
            );
          }
        }
      }

      const { error } = await service
        .from('admins')
        .update({ role: data.role, updated_at: new Date().toISOString() })
        .eq('id', data.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true });
    }

    // remove
    const { data: target } = await service
      .from('admins')
      .select('user_id, role')
      .eq('id', data.id)
      .maybeSingle();

    if (!target) {
      return NextResponse.json({ error: 'Teamlid niet gevonden' }, { status: 404 });
    }

    if (target.user_id === ctx.userId) {
      return NextResponse.json(
        { error: 'Je kunt jezelf niet verwijderen' },
        { status: 400 }
      );
    }

    if (target.role === 'admin') {
      const { count } = await service
        .from('admins')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if ((count ?? 0) <= 1) {
        return NextResponse.json(
          { error: 'Je kunt de laatste administrator niet verwijderen' },
          { status: 400 }
        );
      }
    }

    const { error } = await service.from('admins').delete().eq('id', data.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Serverfout' },
      { status: 500 }
    );
  }
}
