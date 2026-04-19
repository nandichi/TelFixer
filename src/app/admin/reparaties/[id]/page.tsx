'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Smartphone,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Wrench,
  Save,
  MapPin,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { formatDate, formatPrice } from '@/lib/utils';
import { RepairRequest, RepairStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';

const statusOptions: { value: RepairStatus; label: string }[] = [
  { value: 'ontvangen', label: 'Ontvangen' },
  { value: 'in_behandeling', label: 'In behandeling' },
  { value: 'klaar', label: 'Klaar' },
  { value: 'afgehandeld', label: 'Afgehandeld' },
  { value: 'afgewezen', label: 'Afgewezen' },
];

export default function AdminRepairDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [repair, setRepair] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState<RepairStatus>('ontvangen');
  const [priceInput, setPriceInput] = useState('');
  const [notes, setNotes] = useState('');

  const fetchRepair = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      router.push('/admin/reparaties');
      return;
    }
    const mapped: RepairRequest = {
      id: data.id,
      reference_number: data.reference_number,
      user_id: data.user_id,
      device_type: data.device_type,
      device_brand: data.device_brand,
      device_model: data.device_model,
      repair_type: data.repair_type,
      problem_description: data.problem_description,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      customer_address: data.customer_address,
      preferred_date: data.preferred_date,
      status: data.status,
      notes: data.notes,
      price: data.price ? parseFloat(data.price) : null,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    setRepair(mapped);
    setStatus(mapped.status);
    setPriceInput(mapped.price !== null ? String(mapped.price) : '');
    setNotes(mapped.notes || '');
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    void fetchRepair();
  }, [fetchRepair]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const parsedPrice = priceInput.trim() ? parseFloat(priceInput) : null;

    if (
      priceInput.trim() &&
      (isNaN(parsedPrice as number) || (parsedPrice as number) < 0)
    ) {
      showError('Ongeldige prijs');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('repair_requests')
      .update({
        status,
        price: parsedPrice,
        notes: notes || null,
      })
      .eq('id', params.id);

    setSaving(false);

    if (error) {
      showError(`Fout bij opslaan: ${error.message}`);
      return;
    }
    success('Reparatie bijgewerkt');
    void fetchRepair();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" />
      </div>
    );
  }
  if (!repair) return null;

  return (
    <div className="space-y-5">
      <PageHeader
        title={repair.reference_number}
        description={`Ingediend op ${formatDate(repair.created_at)} · ${repair.device_brand} ${repair.device_model}`}
        back={{ href: '/admin/reparaties', label: 'Alle reparaties' }}
        meta={<StatusPill status={repair.status} />}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section title="Apparaat">
            <div className="grid sm:grid-cols-3 gap-3">
              <DataField
                icon={Smartphone}
                label="Type"
                value={repair.device_type}
              />
              <DataField
                icon={Smartphone}
                label="Merk"
                value={repair.device_brand}
              />
              <DataField
                icon={Smartphone}
                label="Model"
                value={repair.device_model}
              />
            </div>
          </Section>

          <Section title="Reparatie">
            <div className="space-y-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold mb-1">
                  Type
                </div>
                <div className="text-[13px] text-[var(--a-text)] inline-flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                  {repair.repair_type}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold mb-1">
                  Probleemomschrijving
                </div>
                <p className="text-[13px] text-[var(--a-text-2)] whitespace-pre-wrap leading-relaxed">
                  {repair.problem_description}
                </p>
              </div>
            </div>
          </Section>

          <Section
            title="Status & prijs"
            description="Werk de status, prijs of interne notities bij"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as RepairStatus)
                  }
                  className="w-full h-9 px-2.5 text-[13px] rounded-md bg-[var(--a-surface)] border border-[var(--a-border)] text-[var(--a-text)] focus:border-[var(--a-accent)] focus:outline-none"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold mb-1.5">
                  Reparatieprijs (EUR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="bijv. 89.00"
                  className="w-full h-9 px-2.5 text-[13px] admin-num rounded-md bg-[var(--a-surface)] border border-[var(--a-border)] text-[var(--a-text)] focus:border-[var(--a-accent)] focus:outline-none"
                />
                <p className="mt-1 text-[11.5px] text-[var(--a-text-4)]">
                  {repair.price !== null
                    ? `Huidige prijs: ${formatPrice(repair.price)}`
                    : 'Nog geen prijs ingesteld'}
                </p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold mb-1.5">
                  Interne notities
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Notities voor interne communicatie..."
                  className="w-full px-2.5 py-2 text-[13px] rounded-md bg-[var(--a-surface)] border border-[var(--a-border)] text-[var(--a-text)] focus:border-[var(--a-accent)] focus:outline-none resize-y"
                />
              </div>

              <div className="flex justify-end pt-1">
                <AdminButton onClick={handleSave} loading={saving} size="md">
                  <Save className="h-3.5 w-3.5" />
                  Opslaan
                </AdminButton>
              </div>
            </div>
          </Section>

          {repair.notes && (
            <Section title="Opgeslagen notities">
              <p className="text-[13px] text-[var(--a-text-2)] whitespace-pre-wrap">
                {repair.notes}
              </p>
            </Section>
          )}
        </div>

        <div className="space-y-4">
          <Section title="Klant">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <span className="text-[13px] font-medium text-[var(--a-text)]">
                  {repair.customer_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <a
                  href={`mailto:${repair.customer_email}`}
                  className="text-[13px] text-[var(--a-text-2)] hover:text-[var(--a-accent)] truncate"
                >
                  {repair.customer_email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <a
                  href={`tel:${repair.customer_phone}`}
                  className="text-[13px] text-[var(--a-text-2)] hover:text-[var(--a-accent)]"
                >
                  {repair.customer_phone}
                </a>
              </div>
              {repair.customer_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[var(--a-text-3)] mt-0.5" />
                  <span className="text-[13px] text-[var(--a-text-2)]">
                    {repair.customer_address}
                  </span>
                </div>
              )}
              {repair.preferred_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                  <span className="text-[13px] text-[var(--a-text-2)] admin-num">
                    {formatDate(repair.preferred_date)}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-3 mt-3 border-t border-[var(--a-border)] flex gap-2">
              <a
                href={`https://wa.me/${repair.customer_phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <AdminButton variant="success" size="sm" fullWidth>
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </AdminButton>
              </a>
            </div>
          </Section>

          <Section title="Tijdlijn">
            <div className="space-y-2 text-[12.5px]">
              <Row label="Aangemaakt" value={formatDate(repair.created_at)} />
              <Row
                label="Laatst bijgewerkt"
                value={formatDate(repair.updated_at)}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function DataField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-[var(--a-border)] p-3 bg-[var(--a-surface-2)]/50">
      <div className="text-[10.5px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold mb-1">
        {label}
      </div>
      <div className="text-[13px] font-medium text-[var(--a-text)] capitalize inline-flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-[var(--a-text-3)]" />
        {value}
      </div>
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
    <div className="flex justify-between items-center">
      <span className="text-[var(--a-text-3)]">{label}</span>
      <span className="text-[var(--a-text-2)] admin-num">{value}</span>
    </div>
  );
}
