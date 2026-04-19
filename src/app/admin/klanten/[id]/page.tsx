'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  RefreshCw,
  Euro,
  Package,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { KpiCard } from '@/components/admin/ui/kpi-card';

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
  repairs_count: number;
}

interface OrderSummary {
  id: string;
  order_number: string;
  total_price: number;
  status: string;
  payment_status: string;
  items_count: number;
  created_at: string;
}

interface SubmissionSummary {
  id: string;
  reference_number: string;
  device_brand: string;
  device_model: string;
  status: string;
  offered_price: number | null;
  created_at: string;
}

interface RepairSummary {
  id: string;
  reference_number: string;
  device_brand: string;
  device_model: string;
  repair_type: string;
  status: string;
  estimated_price: number | null;
  created_at: string;
}

type Tab = 'orders' | 'submissions' | 'repairs';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerWithStats | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [repairs, setRepairs] = useState<RepairSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const fetchCustomerData = useCallback(async () => {
    const supabase = createClient();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !user) {
      router.push('/admin/klanten');
      return;
    }

    const ordersOr = `user_id.eq.${user.id},customer_email.eq.${user.email}`;

    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, order_items(id)')
      .or(ordersOr)
      .order('created_at', { ascending: false });

    const { data: submissionsData } = await supabase
      .from('device_submissions')
      .select('*')
      .or(ordersOr)
      .order('created_at', { ascending: false });

    const { data: repairsData } = await supabase
      .from('repair_requests')
      .select('*')
      .or(ordersOr)
      .order('created_at', { ascending: false });

    const ordersSummary: OrderSummary[] =
      ordersData?.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        total_price: parseFloat(order.total_price),
        status: order.status,
        payment_status: order.payment_status,
        items_count: order.order_items?.length || 0,
        created_at: order.created_at,
      })) || [];

    const submissionsSummary: SubmissionSummary[] =
      submissionsData?.map((s) => ({
        id: s.id,
        reference_number: s.reference_number,
        device_brand: s.device_brand,
        device_model: s.device_model,
        status: s.status,
        offered_price: s.offered_price ? parseFloat(s.offered_price) : null,
        created_at: s.created_at,
      })) || [];

    const repairsSummary: RepairSummary[] =
      repairsData?.map((r) => ({
        id: r.id,
        reference_number: r.reference_number,
        device_brand: r.device_brand,
        device_model: r.device_model,
        repair_type: r.repair_type,
        status: r.status,
        estimated_price: r.estimated_price
          ? parseFloat(r.estimated_price)
          : null,
        created_at: r.created_at,
      })) || [];

    const totalSpent = ordersSummary
      .filter((o) => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total_price, 0);

    setCustomer({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      created_at: user.created_at,
      orders_count: ordersSummary.length,
      total_spent: totalSpent,
      submissions_count: submissionsSummary.length,
      repairs_count: repairsSummary.length,
    });
    setOrders(ordersSummary);
    setSubmissions(submissionsSummary);
    setRepairs(repairsSummary);
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" />
      </div>
    );
  }
  if (!customer) return null;

  const customerName =
    customer.first_name || customer.last_name
      ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
      : customer.email;

  const initials =
    (customer.first_name?.[0] ?? customer.email[0] ?? '?').toUpperCase() +
    (customer.last_name?.[0]?.toUpperCase() ?? '');

  const orderColumns: Column<OrderSummary>[] = [
    {
      key: 'order_number',
      header: 'Bestelling',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
          <span className="font-medium text-[var(--a-text)] admin-num">
            {r.order_number}
          </span>
        </div>
      ),
      sortable: true,
      sortValue: (r) => r.order_number,
    },
    {
      key: 'items',
      header: 'Items',
      align: 'right',
      cell: (r) => <span className="admin-num">{r.items_count}</span>,
      sortable: true,
      sortValue: (r) => r.items_count,
    },
    {
      key: 'total',
      header: 'Bedrag',
      align: 'right',
      cell: (r) => (
        <span className="admin-num font-medium text-[var(--a-text)]">
          {formatPrice(r.total_price)}
        </span>
      ),
      sortable: true,
      sortValue: (r) => r.total_price,
    },
    {
      key: 'payment',
      header: 'Betaling',
      cell: (r) => <StatusPill status={r.payment_status} size="xs" />,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (r) => <StatusPill status={r.status} size="xs" />,
    },
    {
      key: 'date',
      header: 'Datum',
      cell: (r) => (
        <span className="text-[var(--a-text-3)] admin-num">
          {formatDate(r.created_at)}
        </span>
      ),
      sortable: true,
      sortValue: (r) => new Date(r.created_at).getTime(),
    },
    {
      key: 'open',
      header: '',
      align: 'right',
      width: '40px',
      cell: () => (
        <ExternalLink className="h-3.5 w-3.5 text-[var(--a-text-3)] inline-block" />
      ),
    },
  ];

  const submissionColumns: Column<SubmissionSummary>[] = [
    {
      key: 'ref',
      header: 'Referentie',
      cell: (r) => (
        <span className="font-medium text-[var(--a-text)] admin-num">
          {r.reference_number}
        </span>
      ),
      sortable: true,
      sortValue: (r) => r.reference_number,
    },
    {
      key: 'device',
      header: 'Apparaat',
      cell: (r) => (
        <span className="text-[var(--a-text)]">
          {r.device_brand} {r.device_model}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Aanbieding',
      align: 'right',
      cell: (r) =>
        r.offered_price ? (
          <span className="admin-num font-medium text-[var(--a-text)]">
            {formatPrice(r.offered_price)}
          </span>
        ) : (
          <span className="text-[var(--a-text-4)]">—</span>
        ),
      sortable: true,
      sortValue: (r) => r.offered_price ?? -1,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (r) => <StatusPill status={r.status} size="xs" />,
    },
    {
      key: 'date',
      header: 'Datum',
      cell: (r) => (
        <span className="text-[var(--a-text-3)] admin-num">
          {formatDate(r.created_at)}
        </span>
      ),
      sortable: true,
      sortValue: (r) => new Date(r.created_at).getTime(),
    },
    {
      key: 'open',
      header: '',
      align: 'right',
      width: '40px',
      cell: () => (
        <ExternalLink className="h-3.5 w-3.5 text-[var(--a-text-3)] inline-block" />
      ),
    },
  ];

  const repairColumns: Column<RepairSummary>[] = [
    {
      key: 'ref',
      header: 'Referentie',
      cell: (r) => (
        <span className="font-medium text-[var(--a-text)] admin-num">
          {r.reference_number}
        </span>
      ),
      sortable: true,
      sortValue: (r) => r.reference_number,
    },
    {
      key: 'device',
      header: 'Apparaat',
      cell: (r) => (
        <span className="text-[var(--a-text)]">
          {r.device_brand} {r.device_model}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (r) => (
        <span className="text-[var(--a-text-2)]">{r.repair_type}</span>
      ),
    },
    {
      key: 'price',
      header: 'Prijs',
      align: 'right',
      cell: (r) =>
        r.estimated_price ? (
          <span className="admin-num font-medium text-[var(--a-text)]">
            {formatPrice(r.estimated_price)}
          </span>
        ) : (
          <span className="text-[var(--a-text-4)]">—</span>
        ),
      sortable: true,
      sortValue: (r) => r.estimated_price ?? -1,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (r) => <StatusPill status={r.status} size="xs" />,
    },
    {
      key: 'date',
      header: 'Datum',
      cell: (r) => (
        <span className="text-[var(--a-text-3)] admin-num">
          {formatDate(r.created_at)}
        </span>
      ),
      sortable: true,
      sortValue: (r) => new Date(r.created_at).getTime(),
    },
    {
      key: 'open',
      header: '',
      align: 'right',
      width: '40px',
      cell: () => (
        <ExternalLink className="h-3.5 w-3.5 text-[var(--a-text-3)] inline-block" />
      ),
    },
  ];

  const tabConfig: { id: Tab; label: string; count: number }[] = [
    { id: 'orders', label: 'Bestellingen', count: orders.length },
    { id: 'submissions', label: 'Inleveringen', count: submissions.length },
    { id: 'repairs', label: 'Reparaties', count: repairs.length },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={customerName}
        description={customer.email}
        back={{ href: '/admin/klanten', label: 'Alle klanten' }}
        actions={
          <>
            <a href={`mailto:${customer.email}`}>
              <AdminButton variant="secondary">
                <Mail className="h-3.5 w-3.5" />
                E-mail
              </AdminButton>
            </a>
            {customer.phone && (
              <a
                href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AdminButton variant="success">
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </AdminButton>
              </a>
            )}
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <Section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-[var(--a-accent)] text-white flex items-center justify-center text-[15px] font-semibold uppercase">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--a-text)] truncate">
                  {customerName}
                </div>
                <div className="text-[12px] text-[var(--a-text-3)]">Klant</div>
              </div>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <ContactRow
                icon={Mail}
                value={customer.email}
                href={`mailto:${customer.email}`}
              />
              {customer.phone && (
                <ContactRow
                  icon={Phone}
                  value={customer.phone}
                  href={`tel:${customer.phone}`}
                />
              )}
              <ContactRow
                icon={Calendar}
                value={`Lid sinds ${formatDate(customer.created_at)}`}
              />
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              label="Bestellingen"
              value={String(customer.orders_count)}
              icon={ShoppingCart}
            />
            <KpiCard
              label="Inleveringen"
              value={String(customer.submissions_count)}
              icon={RefreshCw}
            />
            <KpiCard
              label="Reparaties"
              value={String(customer.repairs_count)}
              icon={Package}
            />
            <KpiCard
              label="Besteed"
              value={formatPrice(customer.total_spent)}
              icon={Euro}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-1 bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] p-1">
            {tabConfig.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                  activeTab === t.id
                    ? 'bg-[var(--a-accent)] text-white'
                    : 'text-[var(--a-text-2)] hover:bg-[var(--a-surface-2)]'
                }`}
              >
                {t.label}{' '}
                <span
                  className={`admin-num ml-1 ${
                    activeTab === t.id
                      ? 'text-white/70'
                      : 'text-[var(--a-text-4)]'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'orders' && (
            <DataTable
              columns={orderColumns}
              rows={orders}
              rowKey={(r) => r.id}
              onRowClick={(r) => router.push(`/admin/bestellingen/${r.id}`)}
              empty={
                <EmptyState
                  icon={ShoppingCart}
                  title="Nog geen bestellingen"
                  variant="compact"
                />
              }
              initialSort={{ key: 'date', direction: 'desc' }}
              pageSize={15}
            />
          )}

          {activeTab === 'submissions' && (
            <DataTable
              columns={submissionColumns}
              rows={submissions}
              rowKey={(r) => r.id}
              onRowClick={(r) => router.push(`/admin/inleveringen/${r.id}`)}
              empty={
                <EmptyState
                  icon={RefreshCw}
                  title="Nog geen inleveringen"
                  variant="compact"
                />
              }
              initialSort={{ key: 'date', direction: 'desc' }}
              pageSize={15}
            />
          )}

          {activeTab === 'repairs' && (
            <DataTable
              columns={repairColumns}
              rows={repairs}
              rowKey={(r) => r.id}
              onRowClick={(r) => router.push(`/admin/reparaties/${r.id}`)}
              empty={
                <EmptyState
                  icon={Package}
                  title="Nog geen reparaties"
                  variant="compact"
                />
              }
              initialSort={{ key: 'date', direction: 'desc' }}
              pageSize={15}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-center gap-2 text-[var(--a-text-2)] hover:text-[var(--a-accent)] transition-colors">
      <Icon className="h-3.5 w-3.5 text-[var(--a-text-3)] flex-shrink-0" />
      <span className="truncate">{value}</span>
    </span>
  );
  return href ? <a href={href}>{content}</a> : content;
}
