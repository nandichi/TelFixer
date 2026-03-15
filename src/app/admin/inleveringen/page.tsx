'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, RefreshCw, Euro } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { DeviceSubmission, SubmissionStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'ontvangen', label: 'Ontvangen' },
  { value: 'evaluatie', label: 'In evaluatie' },
  { value: 'aanbieding_gemaakt', label: 'Aanbieding gemaakt' },
  { value: 'aanbieding_geaccepteerd', label: 'Geaccepteerd' },
  { value: 'afgehandeld', label: 'Afgehandeld' },
];

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<DeviceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('device_submissions')
      .select('*')
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

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.device_model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-champagne rounded-lg w-48 animate-pulse" />
        <div className="h-64 bg-champagne rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-soft-black">Inleveringen</h1>
        <p className="text-slate">{submissions.length} inleveringen in totaal</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
          <Input
            placeholder="Zoek op referentie, klant, apparaat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                statusFilter === filter.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-champagne text-slate hover:bg-sand'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-sand overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-champagne/50 border-b border-sand">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Referentie
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Apparaat
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Klant
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Datum
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Aanbod
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Actie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-champagne/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary">
                      {submission.reference_number}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-soft-black">
                        {submission.device_brand} {submission.device_model}
                      </p>
                      <p className="text-sm text-slate capitalize">{submission.device_type}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-soft-black">
                        {submission.customer_name}
                      </p>
                      <p className="text-sm text-slate">{submission.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {formatDate(submission.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={submission.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {submission.offered_price ? (
                      <span className="font-semibold text-success">
                        {formatPrice(submission.offered_price)}
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(submission.status === 'evaluatie' || submission.status === 'ontvangen') && (
                        <Link href={`/admin/inleveringen/${submission.id}`}>
                          <Button size="sm" variant="outline">
                            <Euro className="h-4 w-4 mr-1" />
                            Aanbod
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/inleveringen/${submission.id}`}>
                        <button className="p-2 text-slate hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-muted" />
            </div>
            <p className="text-slate">Geen inleveringen gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
