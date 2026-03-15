'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Edit,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { OrderStatusModal } from '@/components/admin/order-status-modal';
import { useToast } from '@/components/ui/toast';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(
        '*, users(id, email, first_name, last_name, phone), order_items(*, products(id, name, slug, image_urls))'
      )
      .eq('id', params.id)
      .single();

    if (error || !data) {
      router.push('/admin/bestellingen');
      return;
    }

    setOrder({
      id: data.id,
      order_number: data.order_number,
      user_id: data.user_id,
      user: data.users,
      total_price: parseFloat(data.total_price),
      shipping_cost: parseFloat(data.shipping_cost || '0'),
      tax: parseFloat(data.tax || '0'),
      status: data.status as OrderStatus,
      shipping_address: data.shipping_address,
      billing_address: data.billing_address,
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      tracking_number: data.tracking_number,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      items:
        data.order_items?.map((item: Record<string, unknown>) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          product: item.products,
          product_name: item.product_name,
          quantity: item.quantity,
          price_at_purchase: parseFloat(item.price_at_purchase as string),
          created_at: item.created_at,
        })) || [],
    });
    setLoading(false);
  };

  const handleStatusUpdate = async (data: {
    status: OrderStatus;
    trackingNumber?: string;
    notes?: string;
  }) => {
    const supabase = createClient();

    const updateData: Record<string, unknown> = { status: data.status };
    if (data.trackingNumber !== undefined) {
      updateData.tracking_number = data.trackingNumber;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id);

    if (error) {
      showError(`Fout bij bijwerken: ${error.message}`);
      throw error;
    }

    success('Status bijgewerkt');
    fetchOrder();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-slate">Bestelling laden...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const subtotal = order.items?.reduce(
    (sum, item) => sum + item.price_at_purchase * item.quantity,
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bestellingen"
            className="p-2 text-slate hover:text-soft-black hover:bg-champagne rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-soft-black">
                {order.order_number}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-slate">
              Geplaatst op {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Afdrukken
          </Button>
          <Button size="sm" onClick={() => setStatusModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Status wijzigen
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-sand overflow-hidden">
            <div className="p-4 border-b border-sand">
              <h2 className="font-semibold text-soft-black flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Bestelde producten
              </h2>
            </div>
            <div className="divide-y divide-sand">
              {order.items?.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-16 h-16 bg-champagne rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product?.image_urls?.[0] ? (
                      <Image
                        src={item.product.image_urls[0]}
                        alt={item.product_name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-soft-black truncate">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-slate">
                      Aantal: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatPrice(item.price_at_purchase * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-slate">
                        {formatPrice(item.price_at_purchase)} per stuk
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-4 bg-champagne/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate">Subtotaal</span>
                <span className="text-soft-black">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate">Verzendkosten</span>
                <span className="text-soft-black">
                  {order.shipping_cost === 0
                    ? 'Gratis'
                    : formatPrice(order.shipping_cost)}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate">BTW</span>
                  <span className="text-soft-black">
                    {formatPrice(order.tax)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-sand">
                <span className="font-semibold text-soft-black">Totaal</span>
                <span className="font-bold text-primary text-lg">
                  {formatPrice(order.total_price)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {order.tracking_number && (
            <div className="bg-white rounded-2xl border border-sand p-6">
              <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                Verzending
              </h2>
              <div className="flex items-center justify-between p-4 bg-champagne/50 rounded-xl">
                <div>
                  <p className="text-sm text-slate">Track & trace nummer</p>
                  <p className="font-mono font-medium text-soft-black">
                    {order.tracking_number}
                  </p>
                </div>
                <a
                  href={`https://postnl.nl/tracktrace/?L=NL&T=${order.tracking_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    Volgen
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl border border-sand p-6">
              <h2 className="font-semibold text-soft-black mb-3">Notities</h2>
              <p className="text-slate whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              Klant
            </h2>
            <div className="space-y-3">
              <p className="font-medium text-soft-black">
                {order.user?.first_name} {order.user?.last_name}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${order.user?.email}`}
                  className="hover:text-primary"
                >
                  {order.user?.email}
                </a>
              </div>
              {order.user?.phone && (
                <div className="flex items-center gap-2 text-sm text-slate">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${order.user.phone}`}
                    className="hover:text-primary"
                  >
                    {order.user.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              Verzendadres
            </h2>
            <div className="text-sm text-slate space-y-1">
              <p>
                {order.shipping_address?.street}{' '}
                {order.shipping_address?.house_number}
              </p>
              <p>
                {order.shipping_address?.postal_code}{' '}
                {order.shipping_address?.city}
              </p>
              <p>{order.shipping_address?.country || 'Nederland'}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              Betaling
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate">Methode</span>
                <span className="text-sm font-medium text-soft-black capitalize">
                  {order.payment_method || 'Onbekend'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate">Status</span>
                <StatusBadge status={order.payment_status} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <OrderStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onSave={handleStatusUpdate}
        currentStatus={order.status}
        currentTrackingNumber={order.tracking_number}
        currentNotes={order.notes}
      />
    </div>
  );
}
