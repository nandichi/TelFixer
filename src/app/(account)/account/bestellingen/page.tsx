'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
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
      <div className="py-12">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-64 bg-gray-200 rounded-xl" />
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
              Log in om je bestellingen te bekijken
            </h1>
            <Link href="/login" className="text-[#094543] hover:underline">
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
          <Link
            href="/account"
            className="text-sm text-gray-600 hover:text-[#094543] flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar account
          </Link>
          <h1 className="text-3xl font-bold text-[#2C3E48]">Mijn bestellingen</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Bestelnummer</p>
                        <p className="font-semibold text-[#2C3E48]">
                          {order.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Datum</p>
                        <p className="font-medium text-[#2C3E48]">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Totaal</p>
                        <p className="font-semibold text-[#094543]">
                          {formatPrice(order.total_price)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-[#2C3E48]">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Aantal: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-[#094543]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {order.tracking_number && (
                      <div>
                        <p className="text-sm text-gray-500">Track & Trace</p>
                        <p className="font-medium text-[#094543]">
                          {order.tracking_number}
                        </p>
                      </div>
                    )}
                    <Link
                      href={`/account/bestellingen/${order.id}`}
                      className="text-sm text-[#094543] hover:underline flex items-center"
                    >
                      Bekijk details
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#2C3E48] mb-2">
              Nog geen bestellingen
            </h2>
            <p className="text-gray-500 mb-6">
              Je hebt nog geen bestellingen geplaatst
            </p>
            <Link
              href="/producten"
              className="inline-flex items-center text-[#094543] font-medium hover:underline"
            >
              Bekijk producten
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
