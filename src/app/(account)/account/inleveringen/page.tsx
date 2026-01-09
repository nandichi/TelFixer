'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react';
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
      <div className="py-12">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Log in om je inleveringen te bekijken
            </h1>
            <Link href="/login" className="text-[#094543] hover:underline">
              Naar inloggen
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/account"
              className="text-sm text-gray-600 hover:text-[#094543] flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Terug naar account
            </Link>
            <h1 className="text-3xl font-bold text-[#2C3E48]">Mijn inleveringen</h1>
          </div>
          <Link href="/inleveren">
            <Button>Nieuw inleveren</Button>
          </Link>
        </div>

        {submissions.length > 0 ? (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Submission Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Referentie</p>
                        <p className="font-semibold text-[#2C3E48]">
                          {submission.reference_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ingediend op</p>
                        <p className="font-medium text-[#2C3E48]">
                          {formatDate(submission.created_at)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                </div>

                {/* Submission Details */}
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#2C3E48]">
                        {submission.device_brand} {submission.device_model}
                      </p>
                      <p className="text-sm text-gray-500">{submission.device_type}</p>
                    </div>
                    {submission.offered_price && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Aanbod</p>
                        <p className="text-xl font-bold text-emerald-600">
                          {formatPrice(submission.offered_price)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {submission.status === 'aanbieding_gemaakt' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptOffer(submission.id)}
                        >
                          Accepteren
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectOffer(submission.id)}
                        >
                          Afwijzen
                        </Button>
                      </div>
                    )}
                    <Link
                      href={`/tracking?ref=${submission.reference_number}`}
                      className="text-sm text-[#094543] hover:underline flex items-center ml-auto"
                    >
                      Bekijk status
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#2C3E48] mb-2">
              Nog geen inleveringen
            </h2>
            <p className="text-gray-500 mb-6">
              Je hebt nog geen apparaten ingeleverd
            </p>
            <Link href="/inleveren">
              <Button>Apparaat inleveren</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
