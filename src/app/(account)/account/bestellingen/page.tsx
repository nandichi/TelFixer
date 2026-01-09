'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { StatusBadge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface OrderWithItems extends Order {
  items?: { name: string; quantity: number; price: number }[];
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(id, product_name, quantity, price_at_purchase)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(
        data.map((item) => ({
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
          items: item.order_items?.map((oi: Record<string, unknown>) => ({
            name: oi.product_name as string,
            quantity: oi.quantity as number,
            price: parseFloat(oi.price_at_purchase as string),
          })) || [],
        }))
      );
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
        <Container>
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-sand rounded-lg w-48" />
            <div className="h-64 bg-sand rounded-3xl" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-soft-black mb-3">
              Log in om je bestellingen te bekijken
            </h1>
            <Link href="/login" className="text-primary font-medium hover:text-primary-light transition-colors">
              Naar inloggen
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
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary font-medium mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Terug naar account
          </Link>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
            Mijn bestellingen
          </h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-sand overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 bg-champagne/50 border-b border-sand">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Bestelnummer</p>
                        <p className="font-display font-semibold text-soft-black">
                          {order.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Datum</p>
                        <p className="font-medium text-soft-black">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Totaal</p>
                        <p className="font-display font-semibold text-primary">
                          {formatPrice(order.total_price)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-soft-black">
                              {item.name}
                            </p>
                            <p className="text-sm text-muted">
                              Aantal: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-6 bg-champagne/30 border-t border-sand">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {order.tracking_number && (
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">Track & Trace</p>
                        <p className="font-mono font-medium text-primary">
                          {order.tracking_number}
                        </p>
                      </div>
                    )}
                    <Link
                      href={`/account/bestellingen/${order.id}`}
                      className="ml-auto inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-light transition-colors"
                    >
                      Bekijk details
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-sand">
            <div className="w-20 h-20 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-semibold text-soft-black mb-3">
              Nog geen bestellingen
            </h2>
            <p className="text-muted mb-8">
              Je hebt nog geen bestellingen geplaatst
            </p>
            <Link
              href="/producten"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors"
            >
              Bekijk producten
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
