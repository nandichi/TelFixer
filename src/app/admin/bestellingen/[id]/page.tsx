'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Package,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Edit,
  Printer,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { OrderStatusModal } from '@/components/admin/order-status-modal';
import { useToast } from '@/components/ui/toast';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const fetchOrder = useCallback(async () => {
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
          id: item.id as string,
          order_id: item.order_id as string,
          product_id: item.product_id as string,
          product: item.products as Order['items'] extends Array<infer T>
            ? T extends { product?: infer P }
              ? P
              : never
            : never,
          product_name: item.product_name as string,
          quantity: item.quantity as number,
          price_at_purchase: parseFloat(item.price_at_purchase as string),
          created_at: item.created_at as string,
        })) || [],
    });
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

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
    if (data.notes !== undefined) updateData.notes = data.notes;

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
        <Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" />
      </div>
    );
  }
  if (!order) return null;

  const subtotal =
    order.items?.reduce(
      (sum, item) => sum + item.price_at_purchase * item.quantity,
      0
    ) || 0;

  const customerName =
    [order.user?.first_name, order.user?.last_name].filter(Boolean).join(' ') ||
    'Gast';

  return (
    <div className="space-y-5">
      <PageHeader
        title={order.order_number}
        description={`Geplaatst op ${formatDate(order.created_at)} · ${customerName}`}
        back={{ href: '/admin/bestellingen', label: 'Alle bestellingen' }}
        meta={
          <div className="flex items-center gap-1.5">
            <StatusPill status={order.status} />
            <StatusPill status={order.payment_status} />
          </div>
        }
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              Afdrukken
            </AdminButton>
            <AdminButton onClick={() => setStatusModalOpen(true)}>
              <Edit className="h-3.5 w-3.5" />
              Status wijzigen
            </AdminButton>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section
            title="Bestelde producten"
            description={`${order.items?.length ?? 0} ${(order.items?.length ?? 0) === 1 ? 'item' : 'items'}`}
            padding="none"
          >
            <div className="divide-y divide-[var(--a-border)]">
              {order.items?.map((item) => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--a-surface-2)] rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product?.image_urls?.[0] ? (
                      <Image
                        src={item.product.image_urls[0]}
                        alt={item.product_name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Package className="h-4 w-4 text-[var(--a-text-4)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
                      {item.product_name}
                    </div>
                    <div className="text-[11.5px] text-[var(--a-text-3)] admin-num">
                      {item.quantity} × {formatPrice(item.price_at_purchase)}
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-[var(--a-text)] admin-num shrink-0">
                    {formatPrice(item.price_at_purchase * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[var(--a-border)] bg-[var(--a-surface-2)] space-y-1.5">
              <Row
                label="Subtotaal"
                value={formatPrice(subtotal)}
              />
              <Row
                label="Verzendkosten"
                value={
                  order.shipping_cost === 0
                    ? 'Gratis'
                    : formatPrice(order.shipping_cost)
                }
              />
              {order.tax > 0 && (
                <Row label="BTW" value={formatPrice(order.tax)} />
              )}
              <div className="pt-2 mt-1 border-t border-[var(--a-border)] flex justify-between items-baseline">
                <span className="text-[13px] font-semibold text-[var(--a-text)]">
                  Totaal
                </span>
                <span className="text-[18px] font-semibold text-[var(--a-text)] admin-num">
                  {formatPrice(order.total_price)}
                </span>
              </div>
            </div>
          </Section>

          {order.tracking_number && (
            <Section title="Verzending">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[var(--a-info-soft)] text-[var(--a-info)] flex items-center justify-center">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--a-text-3)]">
                      Track & trace
                    </div>
                    <div className="text-[13px] font-mono font-medium text-[var(--a-text)]">
                      {order.tracking_number}
                    </div>
                  </div>
                </div>
                <a
                  href={`https://postnl.nl/tracktrace/?L=NL&T=${order.tracking_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AdminButton variant="secondary">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Volgen
                  </AdminButton>
                </a>
              </div>
            </Section>
          )}

          {order.notes && (
            <Section title="Notities">
              <p className="text-[13px] text-[var(--a-text-2)] whitespace-pre-wrap">
                {order.notes}
              </p>
            </Section>
          )}
        </div>

        <div className="space-y-4">
          <Section title="Klant">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <span className="text-[13px] font-medium text-[var(--a-text)]">
                  {customerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <a
                  href={`mailto:${order.user?.email}`}
                  className="text-[13px] text-[var(--a-text-2)] hover:text-[var(--a-accent)] truncate"
                >
                  {order.user?.email}
                </a>
              </div>
              {order.user?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                  <a
                    href={`tel:${order.user.phone}`}
                    className="text-[13px] text-[var(--a-text-2)] hover:text-[var(--a-accent)]"
                  >
                    {order.user.phone}
                  </a>
                </div>
              )}
              {order.user_id && (
                <div className="pt-2 mt-2 border-t border-[var(--a-border)]">
                  <a
                    href={`/admin/klanten/${order.user_id}`}
                    className="text-[12px] text-[var(--a-accent)] hover:underline inline-flex items-center gap-1"
                  >
                    Klantprofiel openen
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </Section>

          {order.shipping_address && (
            <Section title="Verzendadres">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[var(--a-text-3)] mt-0.5 shrink-0" />
                <div className="text-[13px] text-[var(--a-text-2)] leading-relaxed">
                  <div>
                    {order.shipping_address.street}{' '}
                    {order.shipping_address.house_number}
                  </div>
                  <div>
                    {order.shipping_address.postal_code}{' '}
                    {order.shipping_address.city}
                  </div>
                  <div className="text-[var(--a-text-3)]">
                    {order.shipping_address.country || 'Nederland'}
                  </div>
                </div>
              </div>
            </Section>
          )}

          <Section title="Betaling">
            <div className="space-y-2">
              <Row
                label="Methode"
                value={
                  <span className="capitalize text-[var(--a-text)]">
                    {order.payment_method || 'Onbekend'}
                  </span>
                }
              />
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--a-text-3)]">
                  Status
                </span>
                <StatusPill status={order.payment_status} size="xs" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-[var(--a-text-3)] inline-flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" />
                  Bedrag
                </span>
                <span className="text-[13px] font-semibold text-[var(--a-text)] admin-num">
                  {formatPrice(order.total_price)}
                </span>
              </div>
            </div>
          </Section>
        </div>
      </div>

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

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-[12.5px]">
      <span className="text-[var(--a-text-3)]">{label}</span>
      <span className="text-[var(--a-text-2)] admin-num">{value}</span>
    </div>
  );
}
