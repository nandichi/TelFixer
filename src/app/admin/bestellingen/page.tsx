'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, ShoppingCart } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_price: number;
  status: string;
  payment_status: string;
  item_count: number;
  created_at: string;
}

function OrdersContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    params.get('status') ?? 'all'
  );

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select(
          'id, order_number, customer_name, customer_email, total_price, status, payment_status, created_at, order_items(id), users(first_name, last_name, email)'
        )
        .order('created_at', { ascending: false });

      if (!mounted) return;
      if (!error && data) {
        setOrders(
          data.map((item: Record<string, unknown>) => {
            const u = item.users as
              | { first_name?: string; last_name?: string; email?: string }
              | null;
            const name =
              (item.customer_name as string) ||
              [u?.first_name, u?.last_name].filter(Boolean).join(' ') ||
              '';
            const email =
              (item.customer_email as string) || u?.email || '';
            const items = (item.order_items as { id: string }[]) ?? [];
            return {
              id: item.id as string,
              order_number: item.order_number as string,
              customer_name: name,
              customer_email: email,
              total_price: parseFloat((item.total_price as string) ?? '0'),
              status: item.status as string,
              payment_status: item.payment_status as string,
              item_count: items.length,
              created_at: item.created_at as string,
            };
          })
        );
      }
      setLoading(false);
    };
    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: orders.length,
      in_behandeling: 0,
      betaald: 0,
      verzonden: 0,
      afgeleverd: 0,
      geannuleerd: 0,
    };
    orders.forEach((o) => {
      if (c[o.status] != null) c[o.status]++;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const totalRevenue = useMemo(
    () =>
      filtered
        .filter((o) => o.payment_status === 'paid')
        .reduce((s, o) => s + o.total_price, 0),
    [filtered]
  );

  const exportCsv = () => {
    const header = [
      'Ordernummer',
      'Klant',
      'Email',
      'Status',
      'Betaling',
      'Bedrag',
      'Items',
      'Datum',
    ];
    const rows = filtered.map((o) => [
      o.order_number,
      o.customer_name,
      o.customer_email,
      o.status,
      o.payment_status,
      o.total_price.toFixed(2),
      String(o.item_count),
      o.created_at,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bestellingen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<OrderRow>[] = [
    {
      key: 'order_number',
      header: 'Bestelling',
      sortable: true,
      sortValue: (r) => r.order_number,
      cell: (r) => (
        <div>
          <div className="text-[13px] font-medium text-[var(--a-text)] admin-num">
            {r.order_number}
          </div>
          <div className="text-[11.5px] text-[var(--a-text-3)]">
            {r.item_count}{' '}
            {r.item_count === 1 ? 'product' : 'producten'}
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Klant',
      sortable: true,
      sortValue: (r) => r.customer_name || r.customer_email,
      cell: (r) => (
        <div className="min-w-0">
          <div className="text-[13px] text-[var(--a-text)] truncate">
            {r.customer_name || '—'}
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
      key: 'payment',
      header: 'Betaling',
      cell: (r) => <StatusPill status={r.payment_status} size="xs" />,
    },
    {
      key: 'total',
      header: 'Totaal',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.total_price,
      cell: (r) => (
        <span className="text-[13px] font-semibold text-[var(--a-text)] admin-num">
          {formatPrice(r.total_price)}
        </span>
      ),
    },
  ];

  const filterOptions = [
    { value: 'all', label: 'Alle', count: counts.all },
    {
      value: 'in_behandeling',
      label: 'In behandeling',
      count: counts.in_behandeling,
    },
    { value: 'betaald', label: 'Betaald', count: counts.betaald },
    { value: 'verzonden', label: 'Verzonden', count: counts.verzonden },
    { value: 'afgeleverd', label: 'Afgeleverd', count: counts.afgeleverd },
    {
      value: 'geannuleerd',
      label: 'Geannuleerd',
      count: counts.geannuleerd,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Bestellingen"
        description={`${orders.length} totaal · ${formatPrice(totalRevenue)} aan gefilterde omzet`}
        actions={
          <AdminButton variant="secondary" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5" />
            Exporteer CSV
          </AdminButton>
        }
      />

      <FilterBar
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Zoek op nummer, naam of email...',
        }}
        filters={{
          value: statusFilter,
          onChange: (v) => {
            setStatusFilter(v);
            const q = new URLSearchParams(params.toString());
            if (v === 'all') q.delete('status');
            else q.set('status', v);
            router.replace(`/admin/bestellingen?${q.toString()}`);
          },
          options: filterOptions,
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        onRowClick={(r) => router.push(`/admin/bestellingen/${r.id}`)}
        initialSort={{ key: 'created_at', direction: 'desc' }}
        empty={
          <EmptyState
            icon={ShoppingCart}
            title="Geen bestellingen gevonden"
            description={
              searchQuery || statusFilter !== 'all'
                ? 'Pas je zoekfilters aan om resultaten te zien.'
                : 'Zodra klanten een bestelling plaatsen, verschijnen ze hier.'
            }
            variant="compact"
          />
        }
      />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersContent />
    </Suspense>
  );
}
