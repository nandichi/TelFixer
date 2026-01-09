'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { DeviceSubmission, SubmissionStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function SubmissionsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<DeviceSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.email) {
      fetchSubmissions();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [profile, authLoading]);

  const fetchSubmissions = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('device_submissions')
      .select('*')
      .eq('customer_email', profile?.email)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubmissions(
        data.map((item) => ({
          id: item.id,
          reference_number: item.reference_number,
          user_id: item.user_id,
          device_type: item.device_type,
          device_brand: item.device_brand,
          device_model: item.device_model,
          condition_description: item.condition_description,
          photos_urls: item.photos_urls || [],
          status: item.status as SubmissionStatus,
          evaluation_notes: item.evaluation_notes,
          offered_price: item.offered_price ? parseFloat(item.offered_price) : null,
          offer_accepted: item.offer_accepted,
          customer_name: item.customer_name,
          customer_email: item.customer_email,
          customer_phone: item.customer_phone,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }))
      );
    }
    setLoading(false);
  };

  const handleAcceptOffer = async (submissionId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('device_submissions')
      .update({
        offer_accepted: true,
        status: 'aanbieding_geaccepteerd',
      })
      .eq('id', submissionId);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, offer_accepted: true, status: 'aanbieding_geaccepteerd' as SubmissionStatus }
            : s
        )
      );
    }
  };

  const handleRejectOffer = async (submissionId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('device_submissions')
      .update({
        offer_accepted: false,
        status: 'aanbieding_afgewezen',
      })
      .eq('id', submissionId);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, offer_accepted: false, status: 'aanbieding_afgewezen' as SubmissionStatus }
            : s
        )
      );
    }
  };

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
              <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-soft-black mb-3">
              Log in om je inleveringen te bekijken
            </h1>
            <Link href="/login" className="text-primary font-medium hover:text-primary-light transition-colors">
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
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary font-medium mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Terug naar account
            </Link>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Mijn inleveringen
            </h1>
          </div>
          <Link href="/inleveren" className="hidden sm:block">
            <Button className="gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nieuw inleveren
            </Button>
          </Link>
        </div>

        {submissions.length > 0 ? (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-3xl border border-sand overflow-hidden"
              >
                {/* Submission Header */}
                <div className="p-6 bg-champagne/50 border-b border-sand">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Referentie</p>
                        <p className="font-mono font-semibold text-soft-black">
                          {submission.reference_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Ingediend op</p>
                        <p className="font-medium text-soft-black">
                          {formatDate(submission.created_at)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                </div>

                {/* Submission Details */}
                <div className="p-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-lg text-soft-black">
                        {submission.device_brand} {submission.device_model}
                      </p>
                      <p className="text-sm text-muted capitalize">{submission.device_type}</p>
                    </div>
                    {submission.offered_price && (
                      <div className="text-right">
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Aanbod</p>
                        <p className="text-2xl font-display font-bold text-gradient-primary">
                          {formatPrice(submission.offered_price)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Actions */}
                <div className="p-6 bg-champagne/30 border-t border-sand">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {submission.status === 'aanbieding_gemaakt' && (
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptOffer(submission.id)}
                          className="gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accepteren
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectOffer(submission.id)}
                          className="gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Afwijzen
                        </Button>
                      </div>
                    )}
                    <Link
                      href={`/tracking?ref=${submission.reference_number}`}
                      className="ml-auto inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-light transition-colors"
                    >
                      Bekijk status
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
              <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-semibold text-soft-black mb-3">
              Nog geen inleveringen
            </h2>
            <p className="text-muted mb-8">
              Je hebt nog geen apparaten ingeleverd
            </p>
            <Link href="/inleveren">
              <Button className="gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Apparaat inleveren
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
