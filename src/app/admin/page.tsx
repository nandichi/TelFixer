'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  RefreshCw,
  Users,
  Euro,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { Order, DeviceSubmission, OrderStatus, PaymentStatus, SubmissionStatus } from '@/types';

interface Stats {
  totalRevenue: number;
  orderCount: number;
  customerCount: number;
  submissionCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    orderCount: 0,
    customerCount: 0,
    submissionCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<DeviceSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      try {
        // Fetch stats
        const [
          { data: revenueData },
          { count: orderCount },
          { count: customerCount },
          { count: submissionCount },
        ] = await Promise.all([
          supabase.from('orders').select('total_price').eq('payment_status', 'paid'),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('device_submissions').select('*', { count: 'exact', head: true }),
        ]);

        const totalRevenue = (revenueData || []).reduce(
          (sum, order) => sum + parseFloat(order.total_price || '0'),
          0
        );

        setStats({
          totalRevenue,
          orderCount: orderCount || 0,
          customerCount: customerCount || 0,
          submissionCount: submissionCount || 0,
        });

        // Fetch recent orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, users(id, email, first_name, last_name)')
          .order('created_at', { ascending: false })
          .limit(3);

        if (ordersData) {
          setRecentOrders(
            ordersData.map((item) => ({
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
            }))
          );
        }

        // Fetch recent submissions
        const { data: submissionsData } = await supabase
          .from('device_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(2);

        if (submissionsData) {
          setRecentSubmissions(
            submissionsData.map((item) => ({
              id: item.id,
              reference_number: item.reference_number,
              user_id: item.user_id,
              device_type: item.device_type,
              device_brand: item.device_brand,
              device_model: item.device_model,
              condition_description: item.condition_description,
              photos_urls: item.photos_urls || [],
              status: item.status as SubmissionStatus,
              evaluation_notes: item.evaluation_notes,
              offered_price: item.offered_price ? parseFloat(item.offered_price) : null,
              offer_accepted: item.offer_accepted,
              customer_name: item.customer_name,
              customer_email: item.customer_email,
              customer_phone: item.customer_phone,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsDisplay = [
    {
      name: 'Totale omzet',
      value: formatPrice(stats.totalRevenue),
      icon: Euro,
      color: 'from-primary to-primary-light',
    },
    {
      name: 'Bestellingen',
      value: stats.orderCount.toString(),
      icon: ShoppingCart,
      color: 'from-copper to-copper-light',
    },
    {
      name: 'Inleveringen',
      value: stats.submissionCount.toString(),
      icon: RefreshCw,
      color: 'from-primary-light to-primary',
    },
    {
      name: 'Klanten',
      value: stats.customerCount.toString(),
      icon: Users,
      color: 'from-copper-light to-copper',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-soft-black">Dashboard</h1>
        <p className="text-slate">Overzicht van je TelFixer platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl border border-sand p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="flex items-center text-sm font-medium text-success">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-soft-black">{stat.value}</p>
            <p className="text-sm text-slate">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/producten/nieuw"
          className="group bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
        >
          <Package className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold">Nieuw product</h3>
          <p className="text-sm text-white/80">Voeg een refurbished product toe</p>
        </Link>
        <Link
          href="/admin/bestellingen"
          className="group bg-white border border-sand rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300"
        >
          <ShoppingCart className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-soft-black">Bestellingen</h3>
          <p className="text-sm text-slate">Beheer en verwerk bestellingen</p>
        </Link>
        <Link
          href="/admin/inleveringen"
          className="group bg-white border border-sand rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300"
        >
          <RefreshCw className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-soft-black">Inleveringen</h3>
          <p className="text-sm text-slate">Beoordeel ingeleverde apparaten</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-sand overflow-hidden">
          <div className="p-4 border-b border-sand flex items-center justify-between">
            <h2 className="font-semibold text-soft-black">Recente bestellingen</h2>
            <Link
              href="/admin/bestellingen"
              className="text-sm text-primary hover:underline"
            >
              Bekijk alles
            </Link>
          </div>
          <div className="divide-y divide-sand">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/bestellingen/${order.id}`}
                  className="p-4 flex items-center justify-between hover:bg-champagne/30 transition-colors"
                >
                  <div>
                    <p className="font-medium text-soft-black">{order.order_number}</p>
                    <p className="text-sm text-slate">
                      {order.user?.first_name} {order.user?.last_name || order.user?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatPrice(order.total_price)}
                    </p>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate">
                <ShoppingCart className="h-10 w-10 text-muted mx-auto mb-3" />
                <p>Nog geen bestellingen</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-2xl border border-sand overflow-hidden">
          <div className="p-4 border-b border-sand flex items-center justify-between">
            <h2 className="font-semibold text-soft-black">Recente inleveringen</h2>
            <Link
              href="/admin/inleveringen"
              className="text-sm text-primary hover:underline"
            >
              Bekijk alles
            </Link>
          </div>
          <div className="divide-y divide-sand">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/admin/inleveringen/${submission.id}`}
                  className="p-4 flex items-center justify-between hover:bg-champagne/30 transition-colors"
                >
                  <div>
                    <p className="font-medium text-soft-black">
                      {submission.device_brand} {submission.device_model}
                    </p>
                    <p className="text-sm text-slate">
                      {submission.reference_number} - {submission.customer_name}
                    </p>
                  </div>
                  <StatusBadge status={submission.status} size="sm" />
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate">
                <RefreshCw className="h-10 w-10 text-muted mx-auto mb-3" />
                <p>Nog geen inleveringen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
