'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  RefreshCw,
  Euro,
  Eye,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
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

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerWithStats | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'submissions'>('orders');

  useEffect(() => {
    fetchCustomerData();
  }, [params.id]);

  const fetchCustomerData = async () => {
    const supabase = createClient();

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !user) {
      router.push('/admin/klanten');
      return;
    }

    // Get orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, order_items(id)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const ordersCount = ordersData?.length || 0;
    const totalSpent =
      ordersData?.reduce(
        (sum, order) => sum + parseFloat(order.total_price),
        0
      ) || 0;

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

    // Get submissions
    const { data: submissionsData } = await supabase
      .from('device_submissions')
      .select('*')
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false });

    const submissionsSummary: SubmissionSummary[] =
      submissionsData?.map((submission) => ({
        id: submission.id,
        reference_number: submission.reference_number,
        device_brand: submission.device_brand,
        device_model: submission.device_model,
        status: submission.status,
        offered_price: submission.offered_price
          ? parseFloat(submission.offered_price)
          : null,
        created_at: submission.created_at,
      })) || [];

    setCustomer({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      created_at: user.created_at,
      orders_count: ordersCount,
      total_spent: totalSpent,
      submissions_count: submissionsData?.length || 0,
    });
    setOrders(ordersSummary);
    setSubmissions(submissionsSummary);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-slate">Klant laden...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const customerName =
    customer.first_name || customer.last_name
      ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
      : 'Geen naam';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/klanten"
          className="p-2 text-slate hover:text-soft-black hover:bg-champagne rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-soft-black">
            {customerName}
          </h1>
          <p className="text-slate">{customer.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {customer.first_name?.[0]?.toUpperCase() ||
                  customer.email[0].toUpperCase()}
                {customer.last_name?.[0]?.toUpperCase() || ''}
              </div>
              <div>
                <h2 className="font-semibold text-soft-black">{customerName}</h2>
                <p className="text-sm text-slate">Klant</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-slate hover:text-primary"
                >
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted" />
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-slate hover:text-primary"
                  >
                    {customer.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted" />
                <span className="text-slate">
                  Lid sinds {formatDate(customer.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <h3 className="font-semibold text-soft-black">Statistieken</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-champagne/50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-muted mb-1">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-soft-black">
                  {customer.orders_count}
                </p>
                <p className="text-xs text-slate">Bestellingen</p>
              </div>

              <div className="p-4 bg-champagne/50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-muted mb-1">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-soft-black">
                  {customer.submissions_count}
                </p>
                <p className="text-xs text-slate">Inleveringen</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-primary/10 to-copper/10 rounded-xl text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Euro className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(customer.total_spent)}
              </p>
              <p className="text-xs text-slate">Totaal besteed</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-primary text-white'
                  : 'bg-champagne text-slate hover:bg-sand'
              }`}
            >
              Bestellingen ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'submissions'
                  ? 'bg-primary text-white'
                  : 'bg-champagne text-slate hover:bg-sand'
              }`}
            >
              Inleveringen ({submissions.length})
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-sand overflow-hidden">
              {orders.length > 0 ? (
                <div className="divide-y divide-sand">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 flex items-center justify-between hover:bg-champagne/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-champagne rounded-xl flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted" />
                        </div>
                        <div>
                          <p className="font-medium text-soft-black">
                            {order.order_number}
                          </p>
                          <p className="text-sm text-slate">
                            {order.items_count} product(en) -{' '}
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {formatPrice(order.total_price)}
                          </p>
                          <StatusBadge status={order.status} size="sm" />
                        </div>
                        <Link href={`/admin/bestellingen/${order.id}`}>
                          <button className="p-2 text-slate hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ShoppingCart className="h-12 w-12 text-muted mx-auto mb-4" />
                  <p className="text-slate">Nog geen bestellingen</p>
                </div>
              )}
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div className="bg-white rounded-2xl border border-sand overflow-hidden">
              {submissions.length > 0 ? (
                <div className="divide-y divide-sand">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 flex items-center justify-between hover:bg-champagne/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-champagne rounded-xl flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-muted" />
                        </div>
                        <div>
                          <p className="font-medium text-soft-black">
                            {submission.device_brand} {submission.device_model}
                          </p>
                          <p className="text-sm text-slate">
                            {submission.reference_number} -{' '}
                            {formatDate(submission.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {submission.offered_price && (
                            <p className="font-semibold text-primary">
                              {formatPrice(submission.offered_price)}
                            </p>
                          )}
                          <StatusBadge status={submission.status} size="sm" />
                        </div>
                        <Link href={`/admin/inleveringen/${submission.id}`}>
                          <button className="p-2 text-slate hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <RefreshCw className="h-12 w-12 text-muted mx-auto mb-4" />
                  <p className="text-slate">Nog geen inleveringen</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
