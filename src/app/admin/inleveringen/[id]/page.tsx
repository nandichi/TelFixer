'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Smartphone,
  User,
  Mail,
  Phone,
  FileText,
  Euro,
  Edit,
  Check,
  X as XIcon,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { OfferModal } from '@/components/admin/offer-modal';
import { useToast } from '@/components/ui/toast';
import { formatPrice, formatDate } from '@/lib/utils';
import { DeviceSubmission, SubmissionStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [submission, setSubmission] = useState<DeviceSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'status' | 'offer'>('status');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchSubmission = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('device_submissions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      router.push('/admin/inleveringen');
      return;
    }
    setSubmission({
      id: data.id,
      reference_number: data.reference_number,
      user_id: data.user_id,
      device_type: data.device_type,
      device_brand: data.device_brand,
      device_model: data.device_model,
      condition_description: data.condition_description,
      photos_urls: data.photos_urls || [],
      status: data.status as SubmissionStatus,
      evaluation_notes: data.evaluation_notes,
      offered_price: data.offered_price ? parseFloat(data.offered_price) : null,
      offer_accepted: data.offer_accepted,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const handleStatusUpdate = async (data: {
    status: SubmissionStatus;
    offeredPrice?: number;
    evaluationNotes?: string;
  }) => {
    const supabase = createClient();
    const updateData: Record<string, unknown> = { status: data.status };
    if (data.offeredPrice !== undefined) {
      updateData.offered_price = data.offeredPrice;
    }
    if (data.evaluationNotes !== undefined) {
      updateData.evaluation_notes = data.evaluationNotes;
    }
    const { error } = await supabase
      .from('device_submissions')
      .update(updateData)
      .eq('id', params.id);

    if (error) {
      showError(`Fout bij bijwerken: ${error.message}`);
      throw error;
    }
    success(modalMode === 'offer' ? 'Aanbieding verstuurd' : 'Status bijgewerkt');
    fetchSubmission();
  };

  const handleQuickStatus = async (newStatus: SubmissionStatus) => {
    const supabase = createClient();
    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'aanbieding_geaccepteerd') updateData.offer_accepted = true;
    else if (newStatus === 'aanbieding_afgewezen')
      updateData.offer_accepted = false;

    const { error } = await supabase
      .from('device_submissions')
      .update(updateData)
      .eq('id', params.id);

    if (error) {
      showError(`Fout bij bijwerken: ${error.message}`);
      return;
    }
    success('Status bijgewerkt');
    fetchSubmission();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" />
      </div>
    );
  }
  if (!submission) return null;

  const canMakeOffer =
    submission.status === 'evaluatie' || submission.status === 'ontvangen';
  const hasOffer = submission.offered_price !== null;
  const awaitingResponse = submission.status === 'aanbieding_gemaakt';

  return (
    <div className="space-y-5">
      <PageHeader
        title={submission.reference_number}
        description={`Ingediend op ${formatDate(submission.created_at)} · ${submission.device_brand} ${submission.device_model}`}
        back={{ href: '/admin/inleveringen', label: 'Alle inleveringen' }}
        meta={<StatusPill status={submission.status} />}
        actions={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => {
                setModalMode('status');
                setModalOpen(true);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
              Status
            </AdminButton>
            {canMakeOffer && (
              <AdminButton
                onClick={() => {
                  setModalMode('offer');
                  setModalOpen(true);
                }}
              >
                <Euro className="h-3.5 w-3.5" />
                Aanbieding
              </AdminButton>
            )}
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section title="Apparaat">
            <div className="grid sm:grid-cols-3 gap-3">
              <Field
                icon={Smartphone}
                label="Type"
                value={submission.device_type}
              />
              <Field
                icon={Smartphone}
                label="Merk"
                value={submission.device_brand}
              />
              <Field
                icon={Smartphone}
                label="Model"
                value={submission.device_model}
              />
            </div>
          </Section>

          <Section
            title="Conditie"
            action={
              <FileText className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
            }
          >
            <p className="text-[13px] text-[var(--a-text-2)] whitespace-pre-wrap leading-relaxed">
              {submission.condition_description}
            </p>
          </Section>

          {submission.photos_urls.length > 0 && (
            <Section
              title={`Foto's (${submission.photos_urls.length})`}
              description="Klik op een foto om te vergroten"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {submission.photos_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(url)}
                    className="aspect-square bg-[var(--a-surface-2)] rounded-md overflow-hidden hover:ring-2 hover:ring-[var(--a-accent)] transition-all"
                  >
                    <Image
                      src={url}
                      alt={`Foto ${index + 1}`}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </Section>
          )}

          {submission.evaluation_notes && (
            <Section title="Evaluatie notities">
              <p className="text-[13px] text-[var(--a-text-2)] whitespace-pre-wrap">
                {submission.evaluation_notes}
              </p>
            </Section>
          )}
        </div>

        <div className="space-y-4">
          {hasOffer && (
            <Section title="Aanbieding">
              <div className="rounded-md bg-[var(--a-accent-soft)] p-4 text-center mb-3">
                <div className="text-[11px] uppercase tracking-wider text-[var(--a-accent)] font-semibold mb-1">
                  Aangeboden prijs
                </div>
                <div className="text-[28px] font-semibold text-[var(--a-accent)] admin-num leading-none">
                  {formatPrice(submission.offered_price!)}
                </div>
              </div>

              {awaitingResponse && (
                <div className="space-y-2">
                  <p className="text-[12px] text-center text-[var(--a-text-3)]">
                    Wacht op reactie klant
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <AdminButton
                      variant="success"
                      size="sm"
                      onClick={() =>
                        handleQuickStatus('aanbieding_geaccepteerd')
                      }
                    >
                      <Check className="h-3.5 w-3.5" />
                      Geaccepteerd
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleQuickStatus('aanbieding_afgewezen')
                      }
                    >
                      <XIcon className="h-3.5 w-3.5" />
                      Afgewezen
                    </AdminButton>
                  </div>
                </div>
              )}

              {submission.offer_accepted === true && (
                <StatusPill
                  status="aanbieding_geaccepteerd"
                  size="sm"
                  className="w-full justify-center"
                />
              )}
              {submission.offer_accepted === false && (
                <StatusPill
                  status="aanbieding_afgewezen"
                  size="sm"
                  className="w-full justify-center"
                />
              )}
            </Section>
          )}

          <Section title="Klant">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <span className="text-[13px] font-medium text-[var(--a-text)]">
                  {submission.customer_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <a
                  href={`mailto:${submission.customer_email}`}
                  className="text-[13px] text-[var(--a-text-2)] hover:text-[var(--a-accent)] truncate"
                >
                  {submission.customer_email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[var(--a-text-3)]" />
                <a
                  href={`tel:${submission.customer_phone}`}
                  className="text-[13px] text-[var(--a-text-2)] hover:text-[var(--a-accent)]"
                >
                  {submission.customer_phone}
                </a>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-[var(--a-border)]">
              <a
                href={`https://wa.me/${submission.customer_phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AdminButton variant="success" size="sm" fullWidth>
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </AdminButton>
              </a>
            </div>
          </Section>

          <Section title="Snelle acties">
            <div className="space-y-1.5">
              <AdminButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => handleQuickStatus('evaluatie')}
              >
                Start evaluatie
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => handleQuickStatus('afgehandeld')}
              >
                Markeer als afgehandeld
              </AdminButton>
            </div>
          </Section>
        </div>
      </div>

      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleStatusUpdate}
        currentStatus={submission.status}
        currentOfferedPrice={submission.offered_price}
        currentEvaluationNotes={submission.evaluation_notes}
        mode={modalMode}
      />

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <Image
            src={selectedImage}
            alt="Foto"
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

function Field({
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
