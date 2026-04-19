'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Smartphone,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Wrench,
  Save,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatDate, formatPrice } from '@/lib/utils';
import { RepairRequest, RepairStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

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

    if (priceInput.trim() && (isNaN(parsedPrice as number) || (parsedPrice as number) < 0)) {
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-slate">Reparatie laden...</p>
        </div>
      </div>
    );
  }

  if (!repair) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reparaties"
            className="p-2 text-slate hover:text-soft-black hover:bg-champagne rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-display font-bold text-soft-black">
                {repair.reference_number}
              </h1>
              <StatusBadge status={repair.status} />
            </div>
            <p className="text-slate">
              Ingediend op {formatDate(repair.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              Apparaat details
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-champagne/50 rounded-xl">
                <p className="text-sm text-slate">Type</p>
                <p className="font-medium text-soft-black capitalize">
                  {repair.device_type}
                </p>
              </div>
              <div className="p-4 bg-champagne/50 rounded-xl">
                <p className="text-sm text-slate">Merk</p>
                <p className="font-medium text-soft-black">
                  {repair.device_brand}
                </p>
              </div>
              <div className="p-4 bg-champagne/50 rounded-xl">
                <p className="text-sm text-slate">Model</p>
                <p className="font-medium text-soft-black">
                  {repair.device_model}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <Wrench className="h-5 w-5 text-primary" />
              Type reparatie
            </h2>
            <p className="text-slate">{repair.repair_type}</p>
          </div>

          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              Probleemomschrijving
            </h2>
            <p className="text-slate whitespace-pre-wrap">
              {repair.problem_description}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <h2 className="font-semibold text-soft-black mb-2">
              Status & prijs
            </h2>

            <div>
              <label className="block text-sm font-medium text-soft-black mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RepairStatus)}
                className="w-full px-4 py-3 rounded-xl border-2 border-sand focus:border-primary focus:outline-none bg-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Reparatieprijs (EUR)"
                type="number"
                step="0.01"
                min="0"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="bijv. 89.00"
                helperText={
                  repair.price !== null
                    ? `Huidige prijs: ${formatPrice(repair.price)}`
                    : 'Nog geen prijs ingesteld'
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-soft-black mb-2">
                Interne notities
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-sand focus:border-primary focus:outline-none bg-white text-soft-black"
                placeholder="Notities voor interne communicatie..."
              />
            </div>

            <Button onClick={handleSave} isLoading={saving} className="gap-2">
              <Save className="h-4 w-4" />
              Opslaan
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              Klantgegevens
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate">Naam</p>
                <p className="font-medium text-soft-black">
                  {repair.customer_name}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-slate mt-0.5" />
                <a
                  href={`mailto:${repair.customer_email}`}
                  className="text-primary hover:underline break-all"
                >
                  {repair.customer_email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-slate mt-0.5" />
                <a
                  href={`tel:${repair.customer_phone}`}
                  className="text-primary hover:underline"
                >
                  {repair.customer_phone}
                </a>
              </div>
              {repair.customer_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate mt-0.5" />
                  <span className="text-soft-black">
                    {repair.customer_address}
                  </span>
                </div>
              )}
              {repair.preferred_date && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-slate mt-0.5" />
                  <span className="text-soft-black">
                    {formatDate(repair.preferred_date)}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-sand flex flex-col gap-2">
              <a
                href={`https://wa.me/${repair.customer_phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-center px-3 py-2 rounded-lg bg-[#25D366] text-white font-medium hover:opacity-90"
              >
                WhatsApp klant
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
