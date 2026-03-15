'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { OrderStatus } from '@/types';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    status: OrderStatus;
    trackingNumber?: string;
    notes?: string;
  }) => Promise<void>;
  currentStatus: OrderStatus;
  currentTrackingNumber?: string | null;
  currentNotes?: string | null;
}

const statusOptions = [
  { value: 'in_behandeling', label: 'In behandeling' },
  { value: 'betaald', label: 'Betaald' },
  { value: 'verzonden', label: 'Verzonden' },
  { value: 'afgeleverd', label: 'Afgeleverd' },
  { value: 'geannuleerd', label: 'Geannuleerd' },
];

export function OrderStatusModal({
  isOpen,
  onClose,
  onSave,
  currentStatus,
  currentTrackingNumber,
  currentNotes,
}: OrderStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(
    currentTrackingNumber || ''
  );
  const [notes, setNotes] = useState(currentNotes || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave({
        status,
        trackingNumber: trackingNumber || undefined,
        notes: notes || undefined,
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
          <h2 className="text-xl font-display font-bold text-soft-black">
            Status bijwerken
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
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          {(status === 'verzonden' || status === 'afgeleverd') && (
            <Input
              label="Track & trace nummer"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="bijv. 3STEST1234567890"
            />
          )}

          <Textarea
            label="Notities (optioneel)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interne notities over deze bestelling..."
            rows={3}
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
              Opslaan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
