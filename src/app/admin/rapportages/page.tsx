'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Euro,
  ShoppingCart,
  TrendingUp,
  Boxes,
  Download,
  Trophy,
  Layers,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { KpiCard } from '@/components/admin/ui/kpi-card';
import { BarChart } from '@/components/admin/ui/bar-chart';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { AdminButton } from '@/components/admin/ui/admin-button';

interface OrderRow {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  status: string;
  payment_status: string;
  total_price: string | number;
}

interface ItemRow {
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price_at_purchase: string | number;
}

interface UserRow {
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
}

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  price: string | number;
  stock_quantity: number | null;
  active: boolean | null;
  categories: { name: string } | null;
}

function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const escape = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows]
    .map((r) => r.map(escape).join(';'))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const num = (v: string | number | null | undefined) =>
  parseFloat(String(v ?? '0')) || 0;

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient();
      const { data: ordersData } = await supabase
        .from('orders')
        .select(
          'id, order_number, created_at, customer_name, customer_email, status, payment_status, total_price'
        )
        .order('created_at', { ascending: false });

      const allOrders = (ordersData ?? []) as OrderRow[];
      const paidIds = allOrders
        .filter((o) => o.payment_status === 'paid')
        .map((o) => o.id);

      // Use a non-matching placeholder id when there are no paid orders yet,
      // so all three queries share the same type for Promise.all.
      const itemOrderIds = paidIds.length
        ? paidIds
        : ['00000000-0000-0000-0000-000000000000'];

      const [{ data: itemsData }, { data: usersData }, { data: productsData }] =
        await Promise.all([
          supabase
            .from('order_items')
            .select(
              'order_id, product_id, product_name, quantity, price_at_purchase'
            )
            .in('order_id', itemOrderIds),
          supabase
            .from('users')
            .select('email, first_name, last_name, phone, created_at')
            .order('created_at', { ascending: false }),
          supabase
            .from('products')
            .select('id, name, brand, price, stock_quantity, active, categories(name)')
            .order('created_at', { ascending: false }),
        ]);

      setOrders(allOrders);
      setItems((itemsData ?? []) as ItemRow[]);
      setUsers((usersData ?? []) as UserRow[]);
      setProducts((productsData ?? []) as unknown as ProductRow[]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const paidOrders = useMemo(
    () => orders.filter((o) => o.payment_status === 'paid'),
    [orders]
  );

  const totalRevenue = useMemo(
    () => paidOrders.reduce((s, o) => s + num(o.total_price), 0),
    [paidOrders]
  );
  const aov = paidOrders.length ? totalRevenue / paidOrders.length : 0;
  const itemsSold = useMemo(
    () => items.reduce((s, i) => s + (i.quantity || 0), 0),
    [items]
  );

  const monthly = useMemo(() => {
    const buckets: { key: string; label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('nl-NL', { month: 'short' }),
        value: 0,
      });
    }
    const idx = new Map(buckets.map((b, i) => [b.key, i]));
    paidOrders.forEach((o) => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const i = idx.get(key);
      if (i != null) buckets[i].value += num(o.total_price);
    });
    return buckets;
  }, [paidOrders]);

  const bestSellers = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>();
    items.forEach((i) => {
      const cur = map.get(i.product_name) ?? {
        name: i.product_name,
        qty: 0,
        revenue: 0,
      };
      cur.qty += i.quantity || 0;
      cur.revenue += num(i.price_at_purchase) * (i.quantity || 0);
      map.set(i.product_name, cur);
    });
    return Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);
  }, [items]);

  const revenueByCategory = useMemo(() => {
    const productCat = new Map<string, string>();
    products.forEach((p) =>
      productCat.set(p.id, p.categories?.name ?? 'Overig')
    );
    const map = new Map<string, number>();
    items.forEach((i) => {
      const cat = (i.product_id && productCat.get(i.product_id)) || 'Overig';
      map.set(cat, (map.get(cat) ?? 0) + num(i.price_at_purchase) * (i.quantity || 0));
    });
    return Array.from(map.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [items, products]);

  const maxCatRevenue = Math.max(...revenueByCategory.map((c) => c.revenue), 1);

  const exportOrders = () => {
    downloadCsv(
      `bestellingen-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Ordernummer', 'Datum', 'Klant', 'E-mail', 'Status', 'Betaling', 'Totaal'],
      orders.map((o) => [
        o.order_number,
        new Date(o.created_at).toLocaleString('nl-NL'),
        o.customer_name ?? '',
        o.customer_email ?? '',
        o.status,
        o.payment_status,
        num(o.total_price).toFixed(2),
      ])
    );
  };

  const exportCustomers = () => {
    downloadCsv(
      `klanten-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Naam', 'E-mail', 'Telefoon', 'Lid sinds'],
      users.map((u) => [
        [u.first_name, u.last_name].filter(Boolean).join(' '),
        u.email,
        u.phone ?? '',
        new Date(u.created_at).toLocaleDateString('nl-NL'),
      ])
    );
  };

  const exportProducts = () => {
    downloadCsv(
      `producten-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Naam', 'Merk', 'Categorie', 'Prijs', 'Voorraad', 'Actief'],
      products.map((p) => [
        p.name,
        p.brand,
        p.categories?.name ?? '',
        num(p.price).toFixed(2),
        p.stock_quantity ?? 0,
        p.active ? 'ja' : 'nee',
      ])
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Rapportages"
        description="Inzicht in omzet, bestsellers en exports"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Omzet (totaal)"
          value={formatPrice(totalRevenue)}
          icon={Euro}
          loading={loading}
        />
        <KpiCard
          label="Betaalde bestellingen"
          value={String(paidOrders.length)}
          icon={ShoppingCart}
          loading={loading}
        />
        <KpiCard
          label="Gem. orderwaarde"
          value={formatPrice(aov)}
          icon={TrendingUp}
          loading={loading}
        />
        <KpiCard
          label="Producten verkocht"
          value={String(itemsSold)}
          icon={Boxes}
          loading={loading}
        />
      </div>

      <Section
        title="Omzet per maand"
        description="Laatste 12 maanden, betaalde bestellingen"
      >
        <BarChart
          data={monthly.map((m) => ({ label: m.label, value: m.value }))}
          height={220}
          formatValue={(v) => formatPrice(v)}
        />
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section
          title="Bestverkochte producten"
          description="Top 10 op aantal verkocht"
          action={<Trophy className="h-4 w-4 text-[var(--a-text-3)]" />}
          padding="none"
        >
          {loading ? (
            <div className="p-4 text-[12px] text-[var(--a-text-4)]">Laden...</div>
          ) : bestSellers.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="Nog geen verkopen"
              description="Zodra er betaalde bestellingen zijn, zie je hier de bestsellers."
              variant="compact"
            />
          ) : (
            <div className="divide-y divide-[var(--a-border)]">
              {bestSellers.map((p, i) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="w-5 text-[12px] font-semibold text-[var(--a-text-4)] admin-num shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
                      {p.name}
                    </div>
                  </div>
                  <span className="text-[12px] text-[var(--a-text-3)] admin-num shrink-0">
                    {p.qty}x
                  </span>
                  <span className="text-[13px] font-semibold text-[var(--a-text)] admin-num shrink-0 w-20 text-right">
                    {formatPrice(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section
          title="Omzet per categorie"
          description="Verdeling van betaalde omzet"
          action={<Layers className="h-4 w-4 text-[var(--a-text-3)]" />}
        >
          {loading ? (
            <div className="text-[12px] text-[var(--a-text-4)]">Laden...</div>
          ) : revenueByCategory.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="Nog geen data"
              variant="compact"
            />
          ) : (
            <div className="space-y-3">
              {revenueByCategory.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12.5px] text-[var(--a-text-2)]">
                      {c.name}
                    </span>
                    <span className="text-[12.5px] font-semibold text-[var(--a-text)] admin-num">
                      {formatPrice(c.revenue)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--a-surface-2)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--a-accent)]"
                      style={{
                        width: `${(c.revenue / maxCatRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Section
        title="Exporteren"
        description="Download je data als CSV (te openen in Excel)"
      >
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={exportOrders}>
            <Download className="h-3.5 w-3.5" />
            Bestellingen ({orders.length})
          </AdminButton>
          <AdminButton variant="secondary" onClick={exportCustomers}>
            <Download className="h-3.5 w-3.5" />
            Klanten ({users.length})
          </AdminButton>
          <AdminButton variant="secondary" onClick={exportProducts}>
            <Download className="h-3.5 w-3.5" />
            Producten ({products.length})
          </AdminButton>
        </div>
      </Section>
    </div>
  );
}
