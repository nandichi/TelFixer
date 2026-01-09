'use client';

import Link from 'next/link';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { StatusBadge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';

// Mock data
const orders = [
  {
    id: '1',
    order_number: 'ORD-ABC123',
    created_at: '2026-01-05T10:30:00Z',
    status: 'verzonden',
    total_price: 799,
    tracking_number: '3SPOST12345678',
    items: [
      { name: 'iPhone 14 Pro 128GB Space Black', quantity: 1, price: 799 },
    ],
  },
  {
    id: '2',
    order_number: 'ORD-DEF456',
    created_at: '2025-12-20T14:15:00Z',
    status: 'afgeleverd',
    total_price: 549,
    tracking_number: '3SPOST87654321',
    items: [
      { name: 'iPhone 13 128GB Blauw', quantity: 1, price: 549 },
    ],
  },
  {
    id: '3',
    order_number: 'ORD-GHI789',
    created_at: '2025-11-15T09:45:00Z',
    status: 'afgeleverd',
    total_price: 1014,
    tracking_number: null,
    items: [
      { name: 'MacBook Air M2 256GB', quantity: 1, price: 999 },
      { name: 'Apple 20W USB-C Adapter', quantity: 1, price: 15 },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="text-sm text-gray-600 hover:text-[#094543] flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar account
          </Link>
          <h1 className="text-3xl font-bold text-[#2C3E48]">Mijn bestellingen</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Bestelnummer</p>
                        <p className="font-semibold text-[#2C3E48]">
                          {order.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Datum</p>
                        <p className="font-medium text-[#2C3E48]">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Totaal</p>
                        <p className="font-semibold text-[#094543]">
                          {formatPrice(order.total_price)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-[#2C3E48]">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Aantal: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-[#094543]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {order.tracking_number && (
                      <div>
                        <p className="text-sm text-gray-500">Track & Trace</p>
                        <p className="font-medium text-[#094543]">
                          {order.tracking_number}
                        </p>
                      </div>
                    )}
                    <Link
                      href={`/account/bestellingen/${order.id}`}
                      className="text-sm text-[#094543] hover:underline flex items-center"
                    >
                      Bekijk details
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#2C3E48] mb-2">
              Nog geen bestellingen
            </h2>
            <p className="text-gray-500 mb-6">
              Je hebt nog geen bestellingen geplaatst
            </p>
            <Link
              href="/producten"
              className="inline-flex items-center text-[#094543] font-medium hover:underline"
            >
              Bekijk producten
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
