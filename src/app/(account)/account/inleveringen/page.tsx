'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate, formatPrice } from '@/lib/utils';

// Mock data
const submissions = [
  {
    id: '1',
    reference_number: 'TF-XYZ789',
    device_type: 'Telefoon',
    device_brand: 'Apple',
    device_model: 'iPhone 12 Pro',
    created_at: '2026-01-03T09:00:00Z',
    status: 'aanbieding_gemaakt',
    offered_price: 450,
  },
  {
    id: '2',
    reference_number: 'TF-ABC123',
    device_type: 'Laptop',
    device_brand: 'Apple',
    device_model: 'MacBook Air 2020',
    created_at: '2025-12-15T14:30:00Z',
    status: 'afgehandeld',
    offered_price: 550,
  },
];

export default function SubmissionsPage() {
  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/account"
              className="text-sm text-gray-600 hover:text-[#094543] flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Terug naar account
            </Link>
            <h1 className="text-3xl font-bold text-[#2C3E48]">Mijn inleveringen</h1>
          </div>
          <Link href="/inleveren">
            <Button>Nieuw inleveren</Button>
          </Link>
        </div>

        {submissions.length > 0 ? (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Submission Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Referentie</p>
                        <p className="font-semibold text-[#2C3E48]">
                          {submission.reference_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ingediend op</p>
                        <p className="font-medium text-[#2C3E48]">
                          {formatDate(submission.created_at)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                </div>

                {/* Submission Details */}
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#2C3E48]">
                        {submission.device_brand} {submission.device_model}
                      </p>
                      <p className="text-sm text-gray-500">{submission.device_type}</p>
                    </div>
                    {submission.offered_price && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Aanbod</p>
                        <p className="text-xl font-bold text-emerald-600">
                          {formatPrice(submission.offered_price)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {submission.status === 'aanbieding_gemaakt' && (
                      <div className="flex gap-2">
                        <Button size="sm">Accepteren</Button>
                        <Button size="sm" variant="outline">
                          Afwijzen
                        </Button>
                      </div>
                    )}
                    <Link
                      href={`/tracking?ref=${submission.reference_number}`}
                      className="text-sm text-[#094543] hover:underline flex items-center ml-auto"
                    >
                      Bekijk status
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#2C3E48] mb-2">
              Nog geen inleveringen
            </h2>
            <p className="text-gray-500 mb-6">
              Je hebt nog geen apparaten ingeleverd
            </p>
            <Link href="/inleveren">
              <Button>Apparaat inleveren</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
