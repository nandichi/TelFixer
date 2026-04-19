'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  RefreshCw,
  Wrench,
  Users,
  Euro,
  ArrowRight,
  AlertTriangle,
  Activity,
  Clock,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { KpiCard } from '@/components/admin/ui/kpi-card';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { BarChart } from '@/components/admin/ui/bar-chart';

interface DashboardStats {
  revenue30d: number;
  revenuePrev30d: number;
  orders30d: number;
  ordersPrev30d: number;
  customers: number;
  newCustomers30d: number;
  pendingOrders: number;
  pendingRepairs: number;
  pendingSubmissions: number;
  outOfStockProducts: number;
}

interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  amount?: number;
  createdAt: string;
  href: string;
  type: 'order' | 'submission' | 'repair';
}

interface DayBucket {
  label: string;
  date: string;
  value: number;
}

const DAYS = 30;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildBuckets(days: number): DayBucket[] {
  const out: DayBucket[] = [];
  const today = startOfDay(new Date());
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push({
      label: d.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: 'short',
      }),
      date: d.toISOString().slice(0, 10),
      value: 0,
    });
  }
  return out;
}

function pctChange(current: number, prev: number) {
  if (prev === 0) {
    if (current === 0) return { dir: 'flat' as const, value: '0%' };
    return { dir: 'up' as const, value: '+100%' };
  }
  const change = ((current - prev) / prev) * 100;
  if (Math.abs(change) < 0.5) return { dir: 'flat' as const, value: '0%' };
  return {
    dir: change > 0 ? ('up' as const) : ('down' as const),
    value: `${change > 0 ? '+' : ''}${change.toFixed(0)}%`,
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue30d: 0,
    revenuePrev30d: 0,
    orders30d: 0,
    ordersPrev30d: 0,
    customers: 0,
    newCustomers30d: 0,
    pendingOrders: 0,
    pendingRepairs: 0,
    pendingSubmissions: 0,
    outOfStockProducts: 0,
  });
  const [revenueBuckets, setRevenueBuckets] = useState<DayBucket[]>([]);
  const [orderBuckets, setOrderBuckets] = useState<DayBucket[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const now = new Date();
      const since30 = new Date(now);
      since30.setDate(now.getDate() - 30);
      const since60 = new Date(now);
      since60.setDate(now.getDate() - 60);

      try {
        const [
          revRes,
          revPrevRes,
          ordersAllRes,
          customersRes,
          newCustomersRes,
          pendingOrdersRes,
          pendingRepairsRes,
          pendingSubsRes,
          outStockRes,
          recentOrdersRes,
          recentRepairsRes,
          recentSubsRes,
        ] = await Promise.all([
          supabase
            .from('orders')
            .select('total_price, created_at')
            .eq('payment_status', 'paid')
            .gte('created_at', since30.toISOString()),
          supabase
            .from('orders')
            .select('total_price, created_at')
            .eq('payment_status', 'paid')
            .gte('created_at', since60.toISOString())
            .lt('created_at', since30.toISOString()),
          supabase
            .from('orders')
            .select('id, created_at'),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', since30.toISOString()),
          supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'in_behandeling'),
          supabase
            .from('repair_requests')
            .select('*', { count: 'exact', head: true })
            .in('status', ['ontvangen', 'in_behandeling']),
          supabase
            .from('device_submissions')
            .select('*', { count: 'exact', head: true })
            .in('status', ['ontvangen', 'evaluatie']),
          supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .or('stock_quantity.eq.0,in_stock.eq.false')
            .eq('active', true),
          supabase
            .from('orders')
            .select(
              'id, order_number, customer_email, total_price, status, created_at'
            )
            .order('created_at', { ascending: false })
            .limit(6),
          supabase
            .from('repair_requests')
            .select(
              'id, reference_number, customer_name, device_brand, device_model, status, created_at'
            )
            .order('created_at', { ascending: false })
            .limit(6),
          supabase
            .from('device_submissions')
            .select(
              'id, reference_number, customer_name, device_brand, device_model, status, created_at'
            )
            .order('created_at', { ascending: false })
            .limit(6),
        ]);

        const revRows = revRes.data ?? [];
        const revenue30d = revRows.reduce(
          (s, o) => s + parseFloat(o.total_price ?? '0'),
          0
        );
        const revenuePrev30d = (revPrevRes.data ?? []).reduce(
          (s, o) => s + parseFloat(o.total_price ?? '0'),
          0
        );

        const ordersAll = ordersAllRes.data ?? [];
        const orders30d = ordersAll.filter(
          (o) => new Date(o.created_at) >= since30
        ).length;
        const ordersPrev30d = ordersAll.filter((o) => {
          const d = new Date(o.created_at);
          return d >= since60 && d < since30;
        }).length;

        // Build day buckets for chart
        const revBuckets = buildBuckets(DAYS);
        const orderBucketsArr = buildBuckets(DAYS);

        const bucketIndex = new Map<string, number>();
        revBuckets.forEach((b, i) => bucketIndex.set(b.date, i));

        revRows.forEach((o) => {
          const k = new Date(o.created_at).toISOString().slice(0, 10);
          const idx = bucketIndex.get(k);
          if (idx != null) {
            revBuckets[idx].value += parseFloat(o.total_price ?? '0');
          }
        });
        ordersAll.forEach((o) => {
          const k = new Date(o.created_at).toISOString().slice(0, 10);
          const idx = bucketIndex.get(k);
          if (idx != null) orderBucketsArr[idx].value += 1;
        });

        setStats({
          revenue30d,
          revenuePrev30d,
          orders30d,
          ordersPrev30d,
          customers: customersRes.count ?? 0,
          newCustomers30d: newCustomersRes.count ?? 0,
          pendingOrders: pendingOrdersRes.count ?? 0,
          pendingRepairs: pendingRepairsRes.count ?? 0,
          pendingSubmissions: pendingSubsRes.count ?? 0,
          outOfStockProducts: outStockRes.count ?? 0,
        });
        setRevenueBuckets(revBuckets);
        setOrderBuckets(orderBucketsArr);

        const merged: RecentItem[] = [];
        (recentOrdersRes.data ?? []).forEach((o) =>
          merged.push({
            id: o.id,
            type: 'order',
            title: o.order_number,
            subtitle: o.customer_email ?? 'Onbekend',
            status: o.status,
            amount: parseFloat(o.total_price ?? '0'),
            createdAt: o.created_at,
            href: `/admin/bestellingen/${o.id}`,
          })
        );
        (recentRepairsRes.data ?? []).forEach((r) =>
          merged.push({
            id: r.id,
            type: 'repair',
            title: `${r.device_brand} ${r.device_model}`,
            subtitle: `${r.reference_number} · ${r.customer_name}`,
            status: r.status,
            createdAt: r.created_at,
            href: `/admin/reparaties/${r.id}`,
          })
        );
        (recentSubsRes.data ?? []).forEach((s) =>
          merged.push({
            id: s.id,
            type: 'submission',
            title: `${s.device_brand} ${s.device_model}`,
            subtitle: `${s.reference_number} · ${s.customer_name}`,
            status: s.status,
            createdAt: s.created_at,
            href: `/admin/inleveringen/${s.id}`,
          })
        );

        merged.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecent(merged.slice(0, 10));
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const revenueTrend = useMemo(
    () => pctChange(stats.revenue30d, stats.revenuePrev30d),
    [stats.revenue30d, stats.revenuePrev30d]
  );
  const ordersTrend = useMemo(
    () => pctChange(stats.orders30d, stats.ordersPrev30d),
    [stats.orders30d, stats.ordersPrev30d]
  );

  const totalActions =
    stats.pendingOrders +
    stats.pendingRepairs +
    stats.pendingSubmissions +
    stats.outOfStockProducts;

  const formatRelTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'zojuist';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}u`;
    const d = Math.floor(h / 24);
    return `${d}d`;
  };

  const typeIcon = (t: RecentItem['type']) => {
    if (t === 'order') return ShoppingCart;
    if (t === 'repair') return Wrench;
    return RefreshCw;
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description={`Overzicht van de laatste 30 dagen · ${new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Omzet (30d)"
          value={formatPrice(stats.revenue30d)}
          icon={Euro}
          trend={{
            direction: revenueTrend.dir,
            value: revenueTrend.value,
            label: 'vs vorige 30d',
          }}
          spark={revenueBuckets.slice(-14).map((b) => b.value)}
          loading={loading}
        />
        <KpiCard
          label="Bestellingen (30d)"
          value={String(stats.orders30d)}
          icon={ShoppingCart}
          trend={{
            direction: ordersTrend.dir,
            value: ordersTrend.value,
            label: 'vs vorige 30d',
          }}
          spark={orderBuckets.slice(-14).map((b) => b.value)}
          loading={loading}
        />
        <KpiCard
          label="Klanten totaal"
          value={String(stats.customers)}
          icon={Users}
          hint={`${stats.newCustomers30d} nieuwe in 30 dagen`}
          loading={loading}
        />
        <KpiCard
          label="Open acties"
          value={String(totalActions)}
          icon={Activity}
          hint={`${stats.pendingOrders} best. · ${stats.pendingRepairs} rep. · ${stats.pendingSubmissions} inl.`}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section
          title="Omzet"
          description="Laatste 30 dagen, betaalde bestellingen"
          className="lg:col-span-2"
        >
          <BarChart
            data={revenueBuckets.map((b) => ({
              label: b.label,
              value: b.value,
              date: b.date,
            }))}
            height={200}
            formatValue={(v) => formatPrice(v)}
          />
          <div className="mt-3 pt-3 border-t border-[var(--a-border)] grid grid-cols-3 gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold">
                Totaal
              </div>
              <div className="text-[16px] font-semibold text-[var(--a-text)] admin-num">
                {formatPrice(stats.revenue30d)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold">
                Gemiddeld
              </div>
              <div className="text-[16px] font-semibold text-[var(--a-text)] admin-num">
                {formatPrice(stats.revenue30d / 30)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold">
                AOV
              </div>
              <div className="text-[16px] font-semibold text-[var(--a-text)] admin-num">
                {stats.orders30d > 0
                  ? formatPrice(stats.revenue30d / stats.orders30d)
                  : formatPrice(0)}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Actie nodig" description="Werk dat wacht op behandeling">
          <div className="space-y-1">
            <ActionRow
              icon={ShoppingCart}
              label="Bestellingen in behandeling"
              count={stats.pendingOrders}
              href="/admin/bestellingen?status=in_behandeling"
              tone="warning"
            />
            <ActionRow
              icon={Wrench}
              label="Reparaties open"
              count={stats.pendingRepairs}
              href="/admin/reparaties"
              tone="info"
            />
            <ActionRow
              icon={RefreshCw}
              label="Inleveringen te beoordelen"
              count={stats.pendingSubmissions}
              href="/admin/inleveringen"
              tone="accent"
            />
            <ActionRow
              icon={AlertTriangle}
              label="Producten uitverkocht"
              count={stats.outOfStockProducts}
              href="/admin/producten"
              tone="danger"
            />
          </div>
        </Section>
      </div>

      {/* Recent activity */}
      <Section
        title="Recente activiteit"
        description="Laatste 10 acties op het platform"
        action={
          <Link
            href="/admin/bestellingen"
            className="inline-flex items-center gap-1 text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-accent)] font-medium"
          >
            Alle bestellingen <ArrowRight className="h-3 w-3" />
          </Link>
        }
        padding="none"
      >
        {loading ? (
          <div className="divide-y divide-[var(--a-border)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[var(--a-surface-2)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-1/3 rounded bg-[var(--a-surface-2)] animate-pulse" />
                  <div className="h-2.5 w-1/2 rounded bg-[var(--a-surface-2)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="Nog geen activiteit"
            description="Zodra er bestellingen, reparaties of inleveringen binnenkomen, verschijnen ze hier."
          />
        ) : (
          <div className="divide-y divide-[var(--a-border)]">
            {recent.map((r) => {
              const Icon = typeIcon(r.type);
              return (
                <Link
                  key={`${r.type}-${r.id}`}
                  href={r.href}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--a-surface-2)] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-md bg-[var(--a-surface-2)] text-[var(--a-text-3)] flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
                      {r.title}
                    </div>
                    <div className="text-[11.5px] text-[var(--a-text-3)] truncate">
                      {r.subtitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {r.amount != null && (
                      <span className="text-[13px] font-medium text-[var(--a-text)] admin-num">
                        {formatPrice(r.amount)}
                      </span>
                    )}
                    <StatusPill status={r.status} size="xs" />
                    <span className="text-[11px] text-[var(--a-text-4)] admin-num inline-flex items-center gap-1 w-12 justify-end">
                      <Clock className="h-2.5 w-2.5" />
                      {formatRelTime(r.createdAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      {/* Quick add */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickLink
          href="/admin/producten/nieuw"
          icon={Package}
          title="Product toevoegen"
          desc="Voeg een refurbished telefoon toe"
        />
        <QuickLink
          href="/admin/categorieen"
          icon={Package}
          title="Categorie beheren"
          desc="Organiseer je productcatalogus"
        />
        <QuickLink
          href="/admin/instellingen"
          icon={Activity}
          title="Instellingen"
          desc="Bedrijfsgegevens, verzending, BTW"
        />
      </div>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  label,
  count,
  href,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  href: string;
  tone: 'warning' | 'info' | 'accent' | 'danger';
}) {
  const toneText: Record<string, string> = {
    warning: 'text-[var(--a-warning)]',
    info: 'text-[var(--a-info)]',
    accent: 'text-[var(--a-accent)]',
    danger: 'text-[var(--a-danger)]',
  };
  const toneBg: Record<string, string> = {
    warning: 'bg-[var(--a-warning-soft)]',
    info: 'bg-[var(--a-info-soft)]',
    accent: 'bg-[var(--a-accent-soft)]',
    danger: 'bg-[var(--a-danger-soft)]',
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-3 -mx-1 px-2 py-2 rounded-md hover:bg-[var(--a-surface-2)] transition-colors group"
    >
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${toneBg[tone]}`}
      >
        <Icon className={`h-3.5 w-3.5 ${toneText[tone]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[var(--a-text)] truncate">
          {label}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[14px] font-semibold admin-num ${count > 0 ? 'text-[var(--a-text)]' : 'text-[var(--a-text-4)]'}`}
        >
          {count}
        </span>
        <ArrowRight className="h-3 w-3 text-[var(--a-text-4)] group-hover:text-[var(--a-text-2)] transition-colors" />
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] p-4 hover:border-[var(--a-border-strong)] transition-colors flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded-md bg-[var(--a-accent-soft)] text-[var(--a-accent)] flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-[var(--a-text)] leading-tight">
          {title}
        </div>
        <div className="text-[12px] text-[var(--a-text-3)] mt-0.5">
          {desc}
        </div>
      </div>
    </Link>
  );
}
