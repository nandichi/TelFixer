'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, RefreshCw, Settings, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { useAuth } from '@/context/auth-context';
import { formatPrice, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/badge';
import { Order, DeviceSubmission, OrderStatus, PaymentStatus, SubmissionStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function AccountPage() {
  const { profile, user, loading } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<DeviceSubmission[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    } else if (!loading) {
      setDataLoading(false);
    }
  }, [user, loading]);

  const fetchData = async () => {
    const supabase = createClient();

    // Fetch recent orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(2);

    if (ordersData) {
      setRecentOrders(
        ordersData.map((item) => ({
          id: item.id,
          order_number: item.order_number,
          user_id: item.user_id,
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

    // Fetch recent submissions by email
    if (profile?.email) {
      const { data: submissionsData } = await supabase
        .from('device_submissions')
        .select('*')
        .eq('customer_email', profile.email)
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
    }

    setDataLoading(false);
  };

  if (loading || dataLoading) {
    return (
      <div className="py-12">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Log in om je account te bekijken
            </h1>
            <Link
              href="/login"
              className="text-[#094543] hover:underline"
            >
              Naar inloggen
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C3E48]">
            Welkom terug{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>
          <p className="mt-2 text-gray-600">
            Beheer je bestellingen, inleveringen en accountinstellingen
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/account/bestellingen"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#094543] hover:shadow-md transition-all group"
          >
            <Package className="h-8 w-8 text-[#094543] mb-3" />
            <h3 className="font-semibold text-[#2C3E48] group-hover:text-[#094543]">
              Mijn bestellingen
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Bekijk en volg je bestellingen
            </p>
          </Link>
          <Link
            href="/account/inleveringen"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#094543] hover:shadow-md transition-all group"
          >
            <RefreshCw className="h-8 w-8 text-[#094543] mb-3" />
            <h3 className="font-semibold text-[#2C3E48] group-hover:text-[#094543]">
              Mijn inleveringen
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Status van ingeleverde apparaten
            </p>
          </Link>
          <Link
            href="/account/instellingen"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#094543] hover:shadow-md transition-all group"
          >
            <Settings className="h-8 w-8 text-[#094543] mb-3" />
            <h3 className="font-semibold text-[#2C3E48] group-hover:text-[#094543]">
              Instellingen
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Accountgegevens en voorkeuren
            </p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2C3E48]">
                Recente bestellingen
              </h2>
              <Link
                href="/account/bestellingen"
                className="text-sm text-[#094543] hover:underline flex items-center"
              >
                Bekijk alles
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} size="sm" />
                      <p className="text-sm font-medium text-[#094543] mt-1">
                        {formatPrice(order.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nog geen bestellingen</p>
                <Link
                  href="/producten"
                  className="text-[#094543] hover:underline text-sm"
                >
                  Bekijk producten
                </Link>
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2C3E48]">
                Recente inleveringen
              </h2>
              <Link
                href="/account/inleveringen"
                className="text-sm text-[#094543] hover:underline flex items-center"
              >
                Bekijk alles
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {submission.device_brand} {submission.device_model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {submission.reference_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={submission.status} size="sm" />
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(submission.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nog geen inleveringen</p>
                <Link
                  href="/inleveren"
                  className="text-[#094543] hover:underline text-sm"
                >
                  Apparaat inleveren
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#094543] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#2C3E48]">
                {profile?.first_name} {profile?.last_name}
              </h3>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
            <Link href="/account/instellingen">
              <button className="text-sm text-[#094543] hover:underline">
                Profiel bewerken
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
