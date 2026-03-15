'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Loader2,
  Smartphone,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Euro,
  Edit,
  Check,
  X as XIcon,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { OfferModal } from '@/components/admin/offer-modal';
import { useToast } from '@/components/ui/toast';
import { formatPrice, formatDate } from '@/lib/utils';
import { DeviceSubmission, SubmissionStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [submission, setSubmission] = useState<DeviceSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'status' | 'offer'>('status');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmission();
  }, [params.id]);

  const fetchSubmission = async () => {
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
  };

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

    success(
      modalMode === 'offer' ? 'Aanbieding verstuurd' : 'Status bijgewerkt'
    );
    fetchSubmission();
  };

  const handleQuickStatus = async (newStatus: SubmissionStatus) => {
    const supabase = createClient();

    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'aanbieding_geaccepteerd') {
      updateData.offer_accepted = true;
    } else if (newStatus === 'aanbieding_afgewezen') {
      updateData.offer_accepted = false;
    }

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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-slate">Inlevering laden...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  const canMakeOffer =
    submission.status === 'evaluatie' || submission.status === 'ontvangen';
  const hasOffer = submission.offered_price !== null;
  const awaitingResponse = submission.status === 'aanbieding_gemaakt';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/inleveringen"
            className="p-2 text-slate hover:text-soft-black hover:bg-champagne rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-soft-black">
                {submission.reference_number}
              </h1>
              <StatusBadge status={submission.status} />
            </div>
            <p className="text-slate">
              Ingediend op {formatDate(submission.created_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {canMakeOffer && (
            <Button
              onClick={() => {
                setModalMode('offer');
                setModalOpen(true);
              }}
            >
              <Euro className="h-4 w-4 mr-2" />
              Aanbieding maken
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setModalMode('status');
              setModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Status wijzigen
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Info */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              Apparaat details
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-champagne/50 rounded-xl">
                <p className="text-sm text-slate">Type</p>
                <p className="font-medium text-soft-black capitalize">
                  {submission.device_type}
                </p>
              </div>
              <div className="p-4 bg-champagne/50 rounded-xl">
                <p className="text-sm text-slate">Merk</p>
                <p className="font-medium text-soft-black">
                  {submission.device_brand}
                </p>
              </div>
              <div className="p-4 bg-champagne/50 rounded-xl">
                <p className="text-sm text-slate">Model</p>
                <p className="font-medium text-soft-black">
                  {submission.device_model}
                </p>
              </div>
            </div>
          </div>

          {/* Condition Description */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              Omschrijving conditie
            </h2>
            <p className="text-slate whitespace-pre-wrap">
              {submission.condition_description}
            </p>
          </div>

          {/* Photos */}
          {submission.photos_urls.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand p-6">
              <h2 className="font-semibold text-soft-black mb-4">
                Foto's ({submission.photos_urls.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {submission.photos_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(url)}
                    className="aspect-square bg-champagne rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all"
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
            </div>
          )}

          {/* Evaluation Notes */}
          {submission.evaluation_notes && (
            <div className="bg-white rounded-2xl border border-sand p-6">
              <h2 className="font-semibold text-soft-black mb-3">
                Evaluatie notities
              </h2>
              <p className="text-slate whitespace-pre-wrap">
                {submission.evaluation_notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Offer Status */}
          {hasOffer && (
            <div className="bg-white rounded-2xl border border-sand p-6">
              <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
                <Euro className="h-5 w-5 text-primary" />
                Aanbieding
              </h2>
              <div className="p-4 bg-gradient-to-br from-primary/10 to-copper/10 rounded-xl text-center mb-4">
                <p className="text-sm text-slate mb-1">Aangeboden prijs</p>
                <p className="text-3xl font-display font-bold text-primary">
                  {formatPrice(submission.offered_price!)}
                </p>
              </div>

              {awaitingResponse && (
                <div className="space-y-2">
                  <p className="text-sm text-center text-slate mb-3">
                    Wachten op reactie klant
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleQuickStatus('aanbieding_geaccepteerd')
                      }
                      className="bg-success hover:bg-success/90"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accepteren
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickStatus('aanbieding_afgewezen')}
                      className="text-error border-error hover:bg-error/10"
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Afwijzen
                    </Button>
                  </div>
                </div>
              )}

              {submission.offer_accepted === true && (
                <div className="flex items-center gap-2 p-3 bg-success/10 text-success rounded-lg">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Aanbieding geaccepteerd</span>
                </div>
              )}

              {submission.offer_accepted === false && (
                <div className="flex items-center gap-2 p-3 bg-error/10 text-error rounded-lg">
                  <XIcon className="h-5 w-5" />
                  <span className="font-medium">Aanbieding afgewezen</span>
                </div>
              )}
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              Klant
            </h2>
            <div className="space-y-3">
              <p className="font-medium text-soft-black">
                {submission.customer_name}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${submission.customer_email}`}
                  className="hover:text-primary"
                >
                  {submission.customer_email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${submission.customer_phone}`}
                  className="hover:text-primary"
                >
                  {submission.customer_phone}
                </a>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              Tijdlijn
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate">Ingediend</span>
                <span className="text-soft-black">
                  {formatDate(submission.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Laatst bijgewerkt</span>
                <span className="text-soft-black">
                  {formatDate(submission.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-sand p-6">
            <h2 className="font-semibold text-soft-black mb-4">Snelle acties</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleQuickStatus('evaluatie')}
              >
                Start evaluatie
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleQuickStatus('afgehandeld')}
              >
                Markeer als afgehandeld
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleStatusUpdate}
        currentStatus={submission.status}
        currentOfferedPrice={submission.offered_price}
        currentEvaluationNotes={submission.evaluation_notes}
        mode={modalMode}
      />

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-soft-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <XIcon className="h-6 w-6" />
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
