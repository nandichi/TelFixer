'use client';

import { useState } from 'react';
import { X, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { SubmissionStatus } from '@/types';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    status: SubmissionStatus;
    offeredPrice?: number;
    evaluationNotes?: string;
  }) => Promise<void>;
  currentStatus: SubmissionStatus;
  currentOfferedPrice?: number | null;
  currentEvaluationNotes?: string | null;
  mode: 'status' | 'offer';
}

const statusOptions = [
  { value: 'ontvangen', label: 'Ontvangen' },
  { value: 'evaluatie', label: 'In evaluatie' },
  { value: 'aanbieding_gemaakt', label: 'Aanbieding gemaakt' },
  { value: 'aanbieding_geaccepteerd', label: 'Geaccepteerd' },
  { value: 'aanbieding_afgewezen', label: 'Afgewezen' },
  { value: 'afgehandeld', label: 'Afgehandeld' },
];

export function OfferModal({
  isOpen,
  onClose,
  onSave,
  currentStatus,
  currentOfferedPrice,
  currentEvaluationNotes,
  mode,
}: OfferModalProps) {
  const [status, setStatus] = useState<SubmissionStatus>(
    mode === 'offer' ? 'aanbieding_gemaakt' : currentStatus
  );
  const [offeredPrice, setOfferedPrice] = useState(
    currentOfferedPrice?.toString() || ''
  );
  const [evaluationNotes, setEvaluationNotes] = useState(
    currentEvaluationNotes || ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave({
        status,
        offeredPrice: offeredPrice ? parseFloat(offeredPrice) : undefined,
        evaluationNotes: evaluationNotes || undefined,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-soft-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sand">
          <h2 className="text-xl font-display font-bold text-soft-black flex items-center gap-2">
            {mode === 'offer' ? (
              <>
                <Euro className="h-5 w-5 text-primary" />
                Aanbieding maken
              </>
            ) : (
              'Status bijwerken'
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-soft-black transition-colors rounded-lg hover:bg-champagne"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'status' && (
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          )}

          {(mode === 'offer' || status === 'aanbieding_gemaakt') && (
            <Input
              label="Aangeboden prijs"
              type="number"
              step="0.01"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder="0.00"
              helperText="De prijs die je aanbiedt voor het apparaat"
              required={mode === 'offer'}
            />
          )}

          <Textarea
            label="Evaluatie notities"
            value={evaluationNotes}
            onChange={(e) => setEvaluationNotes(e.target.value)}
            placeholder="Notities over de staat van het apparaat, waardebepalende factoren, etc."
            rows={4}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuleren
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              {mode === 'offer' ? 'Aanbieding versturen' : 'Opslaan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
