'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';

interface CustomerWithStats {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  orders_count: number;
  total_spent: number;
  submissions_count: number;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      const supabase = createClient();

      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !users) {
        console.error('Error fetching customers:', error);
        setLoading(false);
        return;
      }

      // Bulk fetch orders + submissions to avoid N+1
      const userIds = users.map((u) => u.id);
      const userEmails = users.map((u) => u.email);

      const [{ data: ordersData }, { data: subsData }] = await Promise.all([
        supabase
          .from('orders')
          .select('user_id, customer_email, total_price')
          .or(
            `user_id.in.(${userIds.join(',')}),customer_email.in.(${userEmails.map((e) => `"${e}"`).join(',')})`
          ),
        supabase
          .from('device_submissions')
          .select('user_id, customer_email')
          .or(
            `user_id.in.(${userIds.join(',')}),customer_email.in.(${userEmails.map((e) => `"${e}"`).join(',')})`
          ),
      ]);

      const ordersByEmail = new Map<string, { count: number; total: number }>();
      (ordersData ?? []).forEach((o) => {
        const key = (o.customer_email ?? '') as string;
        const userObj = users.find(
          (u) => u.id === o.user_id || u.email === o.customer_email
        );
        const k = userObj?.email ?? key;
        if (!k) return;
        const cur = ordersByEmail.get(k) ?? { count: 0, total: 0 };
        cur.count += 1;
        cur.total += parseFloat((o.total_price as string) ?? '0');
        ordersByEmail.set(k, cur);
      });

      const subsByEmail = new Map<string, number>();
      (subsData ?? []).forEach((s) => {
        const userObj = users.find(
          (u) => u.id === s.user_id || u.email === s.customer_email
        );
        const k = userObj?.email ?? (s.customer_email as string);
        if (!k) return;
        subsByEmail.set(k, (subsByEmail.get(k) ?? 0) + 1);
      });

      setCustomers(
        users.map((u) => ({
          id: u.id,
          email: u.email,
          first_name: u.first_name,
          last_name: u.last_name,
          phone: u.phone,
          created_at: u.created_at,
          orders_count: ordersByEmail.get(u.email)?.count ?? 0,
          total_spent: ordersByEmail.get(u.email)?.total ?? 0,
          submissions_count: subsByEmail.get(u.email) ?? 0,
        }))
      );
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        (c.first_name?.toLowerCase() ?? '').includes(q) ||
        (c.last_name?.toLowerCase() ?? '').includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone?.toLowerCase() ?? '').includes(q)
    );
  }, [customers, searchQuery]);

  const columns: Column<CustomerWithStats>[] = [
    {
      key: 'customer',
      header: 'Klant',
      sortable: true,
      sortValue: (r) => `${r.first_name ?? ''} ${r.last_name ?? ''} ${r.email}`,
      cell: (r) => {
        const name =
          [r.first_name, r.last_name].filter(Boolean).join(' ') ||
          'Geen naam';
        const initials =
          (r.first_name?.[0] ?? r.email[0]).toUpperCase() +
          (r.last_name?.[0] ?? '').toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--a-accent-soft)] text-[var(--a-accent)] flex items-center justify-center text-[11px] font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
                {name}
              </div>
              <div className="text-[11.5px] text-[var(--a-text-3)] truncate">
                {r.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'phone',
      header: 'Telefoon',
      cell: (r) =>
        r.phone ? (
          <span className="text-[12.5px] text-[var(--a-text-2)] admin-num">
            {r.phone}
          </span>
        ) : (
          <span className="text-[12px] text-[var(--a-text-4)]">—</span>
        ),
    },
    {
      key: 'created_at',
      header: 'Lid sinds',
      sortable: true,
      sortValue: (r) => new Date(r.created_at).getTime(),
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-2)] admin-num">
          {formatDate(r.created_at)}
        </span>
      ),
    },
    {
      key: 'orders',
      header: 'Best.',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.orders_count,
      cell: (r) => (
        <span
          className={`text-[13px] admin-num ${r.orders_count > 0 ? 'text-[var(--a-text)] font-medium' : 'text-[var(--a-text-4)]'}`}
        >
          {r.orders_count}
        </span>
      ),
    },
    {
      key: 'subs',
      header: 'Inl.',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.submissions_count,
      cell: (r) => (
        <span
          className={`text-[13px] admin-num ${r.submissions_count > 0 ? 'text-[var(--a-text)] font-medium' : 'text-[var(--a-text-4)]'}`}
        >
          {r.submissions_count}
        </span>
      ),
    },
    {
      key: 'spent',
      header: 'Totaal besteed',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.total_spent,
      cell: (r) => (
        <span className="text-[13px] font-semibold text-[var(--a-text)] admin-num">
          {formatPrice(r.total_spent)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Klanten"
        description={`${customers.length} geregistreerde klanten`}
      />

      <FilterBar
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Zoek op naam, email of telefoon...',
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        onRowClick={(r) => router.push(`/admin/klanten/${r.id}`)}
        initialSort={{ key: 'created_at', direction: 'desc' }}
        empty={
          <EmptyState
            icon={Users}
            title="Geen klanten gevonden"
            description={
              searchQuery
                ? 'Pas je zoekfilters aan om resultaten te zien.'
                : 'Klanten verschijnen hier zodra ze zich registreren.'
            }
            variant="compact"
          />
        }
      />
    </div>
  );
}
