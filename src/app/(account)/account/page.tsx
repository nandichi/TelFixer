'use client';

import Link from 'next/link';
import { Package, RefreshCw, Settings, ChevronRight, User } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { useAuth } from '@/context/auth-context';
import { formatPrice, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/badge';

// Mock data
const recentOrders = [
  {
    id: '1',
    order_number: 'ORD-ABC123',
    created_at: '2026-01-05T10:30:00Z',
    status: 'verzonden',
    total_price: 799,
  },
  {
    id: '2',
    order_number: 'ORD-DEF456',
    created_at: '2025-12-20T14:15:00Z',
    status: 'afgeleverd',
    total_price: 549,
  },
];

const recentSubmissions = [
  {
    id: '1',
    reference_number: 'TF-XYZ789',
    device_model: 'iPhone 12 Pro',
    created_at: '2026-01-03T09:00:00Z',
    status: 'aanbieding_gemaakt',
  },
];

export default function AccountPage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-12">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C3E48]">
            Welkom terug{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>
          <p className="mt-2 text-gray-600">
            Beheer je bestellingen, inleveringen en accountinstellingen
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/account/bestellingen"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#094543] hover:shadow-md transition-all group"
          >
            <Package className="h-8 w-8 text-[#094543] mb-3" />
            <h3 className="font-semibold text-[#2C3E48] group-hover:text-[#094543]">
              Mijn bestellingen
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Bekijk en volg je bestellingen
            </p>
          </Link>
          <Link
            href="/account/inleveringen"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#094543] hover:shadow-md transition-all group"
          >
            <RefreshCw className="h-8 w-8 text-[#094543] mb-3" />
            <h3 className="font-semibold text-[#2C3E48] group-hover:text-[#094543]">
              Mijn inleveringen
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Status van ingeleverde apparaten
            </p>
          </Link>
          <Link
            href="/account/instellingen"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#094543] hover:shadow-md transition-all group"
          >
            <Settings className="h-8 w-8 text-[#094543] mb-3" />
            <h3 className="font-semibold text-[#2C3E48] group-hover:text-[#094543]">
              Instellingen
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Accountgegevens en voorkeuren
            </p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2C3E48]">
                Recente bestellingen
              </h2>
              <Link
                href="/account/bestellingen"
                className="text-sm text-[#094543] hover:underline flex items-center"
              >
                Bekijk alles
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} size="sm" />
                      <p className="text-sm font-medium text-[#094543] mt-1">
                        {formatPrice(order.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nog geen bestellingen</p>
                <Link
                  href="/producten"
                  className="text-[#094543] hover:underline text-sm"
                >
                  Bekijk producten
                </Link>
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2C3E48]">
                Recente inleveringen
              </h2>
              <Link
                href="/account/inleveringen"
                className="text-sm text-[#094543] hover:underline flex items-center"
              >
                Bekijk alles
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-[#2C3E48]">
                        {submission.device_model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {submission.reference_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={submission.status} size="sm" />
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(submission.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nog geen inleveringen</p>
                <Link
                  href="/inleveren"
                  className="text-[#094543] hover:underline text-sm"
                >
                  Apparaat inleveren
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#094543] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#2C3E48]">
                {profile?.first_name} {profile?.last_name}
              </h3>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
            <Link href="/account/instellingen">
              <button className="text-sm text-[#094543] hover:underline">
                Profiel bewerken
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
