'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Package, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';

// Mock data
const mockOrders = [
  {
    id: '1',
    order_number: 'ORD-ABC123',
    customer_name: 'Jan de Vries',
    customer_email: 'jan@example.com',
    total_price: 799,
    status: 'betaald',
    payment_status: 'paid',
    items_count: 1,
    created_at: '2026-01-05T10:30:00Z',
  },
  {
    id: '2',
    order_number: 'ORD-DEF456',
    customer_name: 'Maria Jansen',
    customer_email: 'maria@example.com',
    total_price: 549,
    status: 'verzonden',
    payment_status: 'paid',
    items_count: 1,
    created_at: '2026-01-04T14:15:00Z',
  },
  {
    id: '3',
    order_number: 'ORD-GHI789',
    customer_name: 'Peter Bakker',
    customer_email: 'peter@example.com',
    total_price: 1299,
    status: 'in_behandeling',
    payment_status: 'pending',
    items_count: 2,
    created_at: '2026-01-03T09:45:00Z',
  },
  {
    id: '4',
    order_number: 'ORD-JKL012',
    customer_name: 'Anna Smit',
    customer_email: 'anna@example.com',
    total_price: 449,
    status: 'afgeleverd',
    payment_status: 'paid',
    items_count: 1,
    created_at: '2025-12-28T16:20:00Z',
  },
];

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'in_behandeling', label: 'In behandeling' },
  { value: 'betaald', label: 'Betaald' },
  { value: 'verzonden', label: 'Verzonden' },
  { value: 'afgeleverd', label: 'Afgeleverd' },
];

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C3E48]">Bestellingen</h1>
        <p className="text-gray-600">{mockOrders.length} bestellingen in totaal</p>
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
                        {order.items_count} {order.items_count === 1 ? 'product' : 'producten'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {order.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">{order.customer_email}</p>
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
