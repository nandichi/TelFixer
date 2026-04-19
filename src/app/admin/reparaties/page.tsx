'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import { RepairRequest } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';

export default function AdminRepairsPage() {
  const router = useRouter();
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchRepairs = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('repair_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Reparaties ophalen mislukt:', error);
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
    };
    void fetchRepairs();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: repairs.length,
      ontvangen: 0,
      in_behandeling: 0,
      klaar: 0,
      afgehandeld: 0,
      afgewezen: 0,
    };
    repairs.forEach((r) => {
      if (c[r.status] != null) c[r.status]++;
    });
    return c;
  }, [repairs]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return repairs.filter((r) => {
      const matches =
        !q ||
        r.reference_number.toLowerCase().includes(q) ||
        r.customer_name.toLowerCase().includes(q) ||
        r.customer_email.toLowerCase().includes(q) ||
        r.device_model.toLowerCase().includes(q) ||
        r.repair_type.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' || r.status === statusFilter;
      return matches && matchesStatus;
    });
  }, [repairs, searchQuery, statusFilter]);

  const columns: Column<RepairRequest>[] = [
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
      key: 'repair_type',
      header: 'Reparatie',
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-2)]">
          {r.repair_type}
        </span>
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
      key: 'price',
      header: 'Prijs',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.price ?? 0,
      cell: (r) =>
        r.price != null ? (
          <span className="text-[13px] font-semibold text-[var(--a-text)] admin-num">
            {formatPrice(r.price)}
          </span>
        ) : (
          <span className="text-[12px] text-[var(--a-text-4)]">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reparaties"
        description={`${repairs.length} reparatieaanvragen totaal`}
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
            { value: 'ontvangen', label: 'Ontvangen', count: counts.ontvangen },
            {
              value: 'in_behandeling',
              label: 'In behandeling',
              count: counts.in_behandeling,
            },
            { value: 'klaar', label: 'Klaar', count: counts.klaar },
            {
              value: 'afgehandeld',
              label: 'Afgehandeld',
              count: counts.afgehandeld,
            },
            { value: 'afgewezen', label: 'Afgewezen', count: counts.afgewezen },
          ],
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        onRowClick={(r) => router.push(`/admin/reparaties/${r.id}`)}
        initialSort={{ key: 'created_at', direction: 'desc' }}
        empty={
          <EmptyState
            icon={Wrench}
            title="Geen reparaties gevonden"
            description={
              searchQuery || statusFilter !== 'all'
                ? 'Pas je zoekfilters aan om resultaten te zien.'
                : 'Reparatieverzoeken verschijnen hier zodra ze binnenkomen.'
            }
            variant="compact"
          />
        }
      />
    </div>
  );
}
