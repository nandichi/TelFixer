'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'in_behandeling', label: 'In behandeling' },
  { value: 'betaald', label: 'Betaald' },
  { value: 'verzonden', label: 'Verzonden' },
  { value: 'afgeleverd', label: 'Afgeleverd' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(id, email, first_name, last_name), order_items(id)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(
        data.map((item) => ({
          id: item.id,
          order_number: item.order_number,
          user_id: item.user_id,
          user: item.users,
          total_price: parseFloat(item.total_price),
          shipping_cost: parseFloat(item.shipping_cost || '0'),
          tax: parseFloat(item.tax || '0'),
          status: item.status as OrderStatus,
          shipping_address: item.shipping_address,
          billing_address: item.billing_address,
          payment_status: item.payment_status as PaymentStatus,
          payment_method: item.payment_method,
          tracking_number: item.tracking_number,
          notes: item.notes,
          created_at: item.created_at,
          updated_at: item.updated_at,
          items: item.order_items || [],
        }))
      );
    }
    setLoading(false);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
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
        <h1 className="text-2xl font-display font-bold text-soft-black">Bestellingen</h1>
        <p className="text-slate">{orders.length} bestellingen in totaal</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
          <Input
            placeholder="Zoek op ordernummer, klant..."
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

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-sand overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-champagne/50 border-b border-sand">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Bestelling
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
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Betaling
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Totaal
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Actie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-champagne/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-soft-black">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-slate">
                        {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'product' : 'producten'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-soft-black">
                        {order.user?.first_name} {order.user?.last_name}
                      </p>
                      <p className="text-sm text-slate">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.payment_status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-primary">
                      {formatPrice(order.total_price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/bestellingen/${order.id}`}>
                      <button className="p-2 text-slate hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-muted" />
            </div>
            <p className="text-slate">Geen bestellingen gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
