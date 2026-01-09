'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SubmissionStatus } from '@/types';

// Mock submission data
const mockSubmissions: Record<string, {
  reference_number: string;
  device_type: string;
  device_brand: string;
  device_model: string;
  status: SubmissionStatus;
  offered_price: number | null;
  created_at: string;
  updated_at: string;
  timeline: { status: string; date: string; description: string }[];
}> = {
  'TF-ABC123': {
    reference_number: 'TF-ABC123',
    device_type: 'telefoon',
    device_brand: 'Apple',
    device_model: 'iPhone 14 Pro',
    status: 'aanbieding_gemaakt',
    offered_price: 650,
    created_at: '2026-01-05T10:30:00Z',
    updated_at: '2026-01-07T14:20:00Z',
    timeline: [
      { status: 'ontvangen', date: '2026-01-05T10:30:00Z', description: 'Inlevering ontvangen' },
      { status: 'evaluatie', date: '2026-01-06T09:15:00Z', description: 'Apparaat wordt beoordeeld' },
      { status: 'aanbieding_gemaakt', date: '2026-01-07T14:20:00Z', description: 'Prijsaanbod: 650 EUR' },
    ],
  },
};

const statusIcons: Record<string, typeof CheckCircle> = {
  ontvangen: Package,
  evaluatie: Clock,
  aanbieding_gemaakt: AlertCircle,
  aanbieding_geaccepteerd: CheckCircle,
  aanbieding_afgewezen: XCircle,
  afgehandeld: CheckCircle,
};

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  
  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [submission, setSubmission] = useState<typeof mockSubmissions[string] | null>(
    initialRef ? mockSubmissions[initialRef] || null : null
  );
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const found = mockSubmissions[referenceNumber.toUpperCase()];
    if (found) {
      setSubmission(found);
    } else {
      setSubmission(null);
      setError('Geen inlevering gevonden met dit referentienummer');
    }

    setIsSearching(false);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <div className="py-8 lg:py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E48]">
              Inlevering Volgen
            </h1>
            <p className="mt-2 text-gray-600">
              Voer je referentienummer in om de status van je inlevering te bekijken
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Bijv. TF-ABC123"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button type="submit" isLoading={isSearching}>
                <Search className="h-5 w-5 mr-2" />
                Zoeken
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </form>

          {/* Results */}
          {submission && (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Referentienummer</p>
                    <p className="text-xl font-bold text-[#094543]">
                      {submission.reference_number}
                    </p>
                  </div>
                  <StatusBadge status={submission.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Apparaat</p>
                    <p className="font-medium text-[#2C3E48]">
                      {submission.device_brand} {submission.device_model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ingediend op</p>
                    <p className="font-medium text-[#2C3E48]">
                      {formatDate(submission.created_at)}
                    </p>
                  </div>
                </div>

                {submission.offered_price && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-600 font-medium">Ons aanbod</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {new Intl.NumberFormat('nl-NL', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(submission.offered_price)}
                    </p>
                    {submission.status === 'aanbieding_gemaakt' && (
                      <div className="mt-3 flex gap-2">
                        <Button size="sm">Accepteren</Button>
                        <Button size="sm" variant="outline">Afwijzen</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2C3E48] mb-6">
                  Status Timeline
                </h2>
                <div className="space-y-6">
                  {submission.timeline.map((item, index) => {
                    const Icon = statusIcons[item.status] || Clock;
                    const isLast = index === submission.timeline.length - 1;

                    return (
                      <div key={index} className="flex gap-4">
                        <div className="relative">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center',
                              isLast
                                ? 'bg-[#094543] text-white'
                                : 'bg-gray-100 text-gray-500'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {index < submission.timeline.length - 1 && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-medium text-[#2C3E48]">
                            {item.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E48] mb-2">
                  Vragen over je inlevering?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Neem contact met ons op als je vragen hebt over je inlevering of het aanbod.
                </p>
                <Button variant="outline" size="sm">
                  Contact opnemen
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!submission && !error && !initialRef && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Voer je referentienummer in om de status te bekijken
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
