'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Users, Mail, Phone, Eye, ShoppingCart, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDate, formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

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
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const supabase = createClient();

    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !users) {
      console.error('Error fetching customers:', error);
      setLoading(false);
      return;
    }

    // Get stats for each user
    const customersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get order count and total spent
        const { data: orders } = await supabase
          .from('orders')
          .select('total_price')
          .eq('user_id', user.id);

        const ordersCount = orders?.length || 0;
        const totalSpent =
          orders?.reduce(
            (sum, order) => sum + parseFloat(order.total_price),
            0
          ) || 0;

        // Get submissions count
        const { count: submissionsCount } = await supabase
          .from('device_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('customer_email', user.email);

        return {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          created_at: user.created_at,
          orders_count: ordersCount,
          total_spent: totalSpent,
          submissions_count: submissionsCount || 0,
        };
      })
    );

    setCustomers(customersWithStats);
    setLoading(false);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.first_name?.toLowerCase() || '').includes(
        searchQuery.toLowerCase()
      ) ||
      (customer.last_name?.toLowerCase() || '').includes(
        searchQuery.toLowerCase()
      ) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-2xl font-display font-bold text-soft-black">
          Klanten
        </h1>
        <p className="text-slate">{customers.length} geregistreerde klanten</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <Input
          placeholder="Zoek op naam of e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-sand overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-champagne/50 border-b border-sand">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Klant
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Lid sinds
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate">
                  Bestellingen
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate">
                  Inleveringen
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Totaal besteed
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Actie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-champagne/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-medium text-sm">
                        {customer.first_name?.[0]?.toUpperCase() ||
                          customer.email[0].toUpperCase()}
                        {customer.last_name?.[0]?.toUpperCase() || ''}
                      </div>
                      <div>
                        <p className="font-medium text-soft-black">
                          {customer.first_name || customer.last_name
                            ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                            : 'Geen naam'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="text-sm text-slate flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted" />
                        {customer.email}
                      </p>
                      {customer.phone && (
                        <p className="text-sm text-slate flex items-center gap-1">
                          <Phone className="h-4 w-4 text-muted" />
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate text-sm">
                    {formatDate(customer.created_at)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-champagne rounded-full text-sm">
                      <ShoppingCart className="h-3 w-3 text-muted" />
                      <span className="font-medium text-soft-black">
                        {customer.orders_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-champagne rounded-full text-sm">
                      <RefreshCw className="h-3 w-3 text-muted" />
                      <span className="font-medium text-soft-black">
                        {customer.submissions_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-primary">
                      {formatPrice(customer.total_spent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/klanten/${customer.id}`}>
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

        {filteredCustomers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted" />
            </div>
            <p className="text-slate">Geen klanten gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
