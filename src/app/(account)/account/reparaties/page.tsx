'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { RepairRequest } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function AccountRepairsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRepairs = useCallback(async () => {
    if (!user?.id) return;
    const supabase = createClient();
    const userEmail = profile?.email ?? user.email ?? '';
    let query = supabase
      .from('repair_requests')
      .select('*')
      .order('created_at', { ascending: false });

    // Reparaties horen bij de ingelogde user OF bij hetzelfde e-mailadres
    // (voor aanvragen die als 'gast' zijn ingediend).
    if (userEmail) {
      query = query.or(
        `user_id.eq.${user.id},customer_email.eq.${userEmail}`
      );
    } else {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (error) {
      console.error('fetchRepairs error:', error);
    }

    if (!error && data) {
      setRepairs(
        data.map(
          (item): RepairRequest => ({
            id: item.id,
            reference_number: item.reference_number,
            user_id: item.user_id,
            device_type: item.device_type,
            device_brand: item.device_brand,
            device_model: item.device_model,
            repair_type: item.repair_type,
            problem_description: item.problem_description,
            customer_name: item.customer_name,
            customer_email: item.customer_email,
            customer_phone: item.customer_phone,
            customer_address: item.customer_address,
            preferred_date: item.preferred_date,
            status: item.status,
            notes: item.notes,
            price: item.price ? parseFloat(item.price) : null,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })
        )
      );
    }
    setLoading(false);
  }, [user?.id, user?.email, profile?.email]);

  useEffect(() => {
    if (user?.id) {
      void fetchRepairs();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, fetchRepairs]);

  if (authLoading || loading) {
    return (
      <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
        <Container>
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-sand rounded-lg w-48" />
            <div className="h-64 bg-sand rounded-3xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6V4a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h4a2 2 0 002-2v-2m8 0h-6m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-soft-black mb-3">
              Log in om je reparaties te bekijken
            </h1>
            <Link
              href="/login"
              className="text-primary font-medium hover:text-primary-light transition-colors"
            >
              Naar inloggen
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
      <Container>
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary font-medium mb-4 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Terug naar account
            </Link>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Mijn reparaties
            </h1>
          </div>
          <Link href="/reparatie" className="hidden sm:block">
            <Button className="gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nieuwe reparatie
            </Button>
          </Link>
        </div>

        {repairs.length > 0 ? (
          <div className="space-y-6">
            {repairs.map((repair) => (
              <div
                key={repair.id}
                className="bg-white rounded-3xl border border-sand overflow-hidden"
              >
                <div className="p-6 bg-champagne/50 border-b border-sand">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">
                          Referentie
                        </p>
                        <p className="font-mono font-semibold text-soft-black">
                          {repair.reference_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">
                          Aangevraagd op
                        </p>
                        <p className="font-medium text-soft-black">
                          {formatDate(repair.created_at)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={repair.status} />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-lg text-soft-black">
                        {repair.device_brand} {repair.device_model}
                      </p>
                      <p className="text-sm text-muted capitalize">
                        {repair.device_type} · {repair.repair_type}
                      </p>
                    </div>
                    {repair.price !== null && (
                      <div className="text-right">
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">
                          Prijs
                        </p>
                        <p className="text-2xl font-display font-bold text-primary">
                          {formatPrice(repair.price)}
                        </p>
                      </div>
                    )}
                  </div>

                  {repair.problem_description && (
                    <div className="mt-4 p-4 bg-champagne/30 rounded-2xl">
                      <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
                        Omschrijving
                      </p>
                      <p className="text-sm text-slate whitespace-pre-wrap">
                        {repair.problem_description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-champagne/30 border-t border-sand">
                  <div className="flex flex-wrap items-center justify-end gap-4">
                    <Link
                      href={`/tracking?ref=${repair.reference_number}`}
                      className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-light transition-colors"
                    >
                      Bekijk status
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-sand">
            <div className="w-20 h-20 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-semibold text-soft-black mb-3">
              Nog geen reparaties
            </h2>
            <p className="text-muted mb-8">
              Heb je een apparaat dat aan reparatie toe is? Vraag een reparatie aan.
            </p>
            <Link href="/reparatie">
              <Button className="gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Reparatie aanvragen
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
