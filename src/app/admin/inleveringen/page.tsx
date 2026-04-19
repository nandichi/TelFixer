'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { DeviceSubmission, SubmissionStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<DeviceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
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
            offered_price: item.offered_price
              ? parseFloat(item.offered_price)
              : null,
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
    fetchSubmissions();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: submissions.length,
      ontvangen: 0,
      evaluatie: 0,
      aanbieding_gemaakt: 0,
      aanbieding_geaccepteerd: 0,
      aanbieding_afgewezen: 0,
      afgehandeld: 0,
    };
    submissions.forEach((s) => {
      if (c[s.status] != null) c[s.status]++;
    });
    return c;
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return submissions.filter((s) => {
      const matches =
        !q ||
        s.reference_number.toLowerCase().includes(q) ||
        s.customer_name.toLowerCase().includes(q) ||
        s.customer_email.toLowerCase().includes(q) ||
        s.device_model.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matches && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const columns: Column<DeviceSubmission>[] = [
    {
      key: 'reference',
      header: 'Referentie',
      sortable: true,
      sortValue: (r) => r.reference_number,
      cell: (r) => (
        <span className="text-[13px] font-medium text-[var(--a-accent)] admin-num">
          {r.reference_number}
        </span>
      ),
    },
    {
      key: 'device',
      header: 'Apparaat',
      cell: (r) => (
        <div>
          <div className="text-[13px] font-medium text-[var(--a-text)]">
            {r.device_brand} {r.device_model}
          </div>
          <div className="text-[11.5px] text-[var(--a-text-3)] capitalize">
            {r.device_type}
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Klant',
      cell: (r) => (
        <div className="min-w-0">
          <div className="text-[13px] text-[var(--a-text)] truncate">
            {r.customer_name}
          </div>
          <div className="text-[11.5px] text-[var(--a-text-3)] truncate">
            {r.customer_email}
          </div>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Datum',
      sortable: true,
      sortValue: (r) => new Date(r.created_at).getTime(),
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-2)] admin-num">
          {formatDate(r.created_at)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (r) => <StatusPill status={r.status} size="xs" />,
    },
    {
      key: 'offer',
      header: 'Aanbod',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.offered_price ?? 0,
      cell: (r) =>
        r.offered_price ? (
          <span className="text-[13px] font-semibold text-[var(--a-text)] admin-num">
            {formatPrice(r.offered_price)}
          </span>
        ) : (
          <span className="text-[12px] text-[var(--a-text-4)]">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Inleveringen"
        description={`${submissions.length} inleveringen totaal`}
      />

      <FilterBar
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Zoek op referentie, klant of apparaat...',
        }}
        filters={{
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { value: 'all', label: 'Alle', count: counts.all },
            {
              value: 'ontvangen',
              label: 'Ontvangen',
              count: counts.ontvangen,
            },
            {
              value: 'evaluatie',
              label: 'In evaluatie',
              count: counts.evaluatie,
            },
            {
              value: 'aanbieding_gemaakt',
              label: 'Aanbod gemaakt',
              count: counts.aanbieding_gemaakt,
            },
            {
              value: 'aanbieding_geaccepteerd',
              label: 'Geaccepteerd',
              count: counts.aanbieding_geaccepteerd,
            },
            {
              value: 'afgehandeld',
              label: 'Afgehandeld',
              count: counts.afgehandeld,
            },
          ],
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        onRowClick={(r) => router.push(`/admin/inleveringen/${r.id}`)}
        initialSort={{ key: 'created_at', direction: 'desc' }}
        empty={
          <EmptyState
            icon={RefreshCw}
            title="Geen inleveringen gevonden"
            description={
              searchQuery || statusFilter !== 'all'
                ? 'Pas je zoekfilters aan om resultaten te zien.'
                : 'Inleveringen verschijnen hier zodra klanten een apparaat inzenden.'
            }
            variant="compact"
          />
        }
      />
    </div>
  );
}
