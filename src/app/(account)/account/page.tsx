'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
        <Container>
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-sand rounded-lg w-64" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-sand rounded-3xl" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-soft-black mb-3">
              Log in om je account te bekijken
            </h1>
            <p className="text-muted mb-6">
              Bekijk je bestellingen, inleveringen en accountinstellingen
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors"
            >
              Naar inloggen
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
            Mijn Account
          </span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
            Welkom terug{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>
          <p className="mt-3 text-lg text-muted">
            Beheer je bestellingen, inleveringen en accountinstellingen
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <Link
            href="/account/bestellingen"
            className="group bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4 sm:mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-soft-black mb-1 sm:mb-2 group-hover:text-primary transition-colors">
              Mijn bestellingen
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Bekijk en volg je bestellingen
            </p>
          </Link>
          <Link
            href="/account/inleveringen"
            className="group bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-copper/5 flex items-center justify-center text-copper mb-4 sm:mb-5 group-hover:bg-gradient-to-br group-hover:from-copper group-hover:to-gold group-hover:text-white transition-all duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-soft-black mb-1 sm:mb-2 group-hover:text-copper transition-colors">
              Mijn inleveringen
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Status van ingeleverde apparaten
            </p>
          </Link>
          <Link
            href="/account/instellingen"
            className="group bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate/5 flex items-center justify-center text-slate mb-4 sm:mb-5 group-hover:bg-slate group-hover:text-white transition-all duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-soft-black mb-1 sm:mb-2 group-hover:text-slate transition-colors">
              Instellingen
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Accountgegevens en voorkeuren
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-soft-black">
                Recente bestellingen
              </h2>
              <Link
                href="/account/bestellingen"
                className="text-sm text-primary hover:text-primary-light flex items-center gap-1 font-medium transition-colors"
              >
                Bekijk alles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-4 border-b border-sand last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-soft-black">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-muted">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} size="sm" />
                      <p className="text-sm font-semibold text-primary mt-1">
                        {formatPrice(order.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-muted mb-2">Nog geen bestellingen</p>
                <Link
                  href="/producten"
                  className="text-primary text-sm font-medium hover:text-primary-light transition-colors"
                >
                  Bekijk producten
                </Link>
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-soft-black">
                Recente inleveringen
              </h2>
              <Link
                href="/account/inleveringen"
                className="text-sm text-primary hover:text-primary-light flex items-center gap-1 font-medium transition-colors"
              >
                Bekijk alles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between py-4 border-b border-sand last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-soft-black">
                        {submission.device_brand} {submission.device_model}
                      </p>
                      <p className="text-sm text-muted">
                        {submission.reference_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={submission.status} size="sm" />
                      <p className="text-xs text-muted mt-1">
                        {formatDate(submission.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-muted mb-2">Nog geen inleveringen</p>
                <Link
                  href="/inleveren"
                  className="text-primary text-sm font-medium hover:text-primary-light transition-colors"
                >
                  Apparaat inleveren
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mt-6 sm:mt-10 bg-white rounded-2xl sm:rounded-3xl border border-sand p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl sm:text-2xl font-display font-bold flex-shrink-0">
              {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display font-semibold text-lg sm:text-xl text-soft-black">
                {profile?.first_name} {profile?.last_name}
              </h3>
              <p className="text-sm sm:text-base text-muted">{profile?.email}</p>
            </div>
            <Link 
              href="/account/instellingen"
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-sand text-xs sm:text-sm font-medium text-soft-black hover:border-primary hover:text-primary transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Profiel bewerken
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
