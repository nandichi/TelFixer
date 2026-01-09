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
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C3E48]">Inleveringen</h1>
        <p className="text-gray-600">{submissions.length} inleveringen in totaal</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Zoek op referentie, klant, apparaat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? 'bg-[#094543] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Referentie
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Apparaat
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Klant
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Datum
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Aanbod
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Actie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#094543]">
                      {submission.reference_number}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {submission.device_brand} {submission.device_model}
                      </p>
                      <p className="text-sm text-gray-500">{submission.device_type}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {submission.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">{submission.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(submission.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={submission.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {submission.offered_price ? (
                      <span className="font-medium text-emerald-600">
                        {formatPrice(submission.offered_price)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {submission.status === 'evaluatie' && (
                        <Button size="sm" variant="outline">
                          <Euro className="h-4 w-4 mr-1" />
                          Aanbod maken
                        </Button>
                      )}
                      <Link href={`/admin/inleveringen/${submission.id}`}>
                        <button className="p-2 text-gray-400 hover:text-[#094543] transition-colors">
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
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Geen inleveringen gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
