'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Package } from 'lucide-react';
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
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C3E48]">Bestellingen</h1>
        <p className="text-gray-600">{orders.length} bestellingen in totaal</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Zoek op ordernummer, klant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Bestelling
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Betaling
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Totaal
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Actie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'product' : 'producten'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {order.user?.first_name} {order.user?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.payment_status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-[#094543]">
                      {formatPrice(order.total_price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/bestellingen/${order.id}`}>
                      <button className="p-2 text-gray-400 hover:text-[#094543] transition-colors">
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
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Geen bestellingen gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
