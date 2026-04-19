'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { RepairRequest } from '@/types';
import { createClient } from '@/lib/supabase/client';

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'ontvangen', label: 'Ontvangen' },
  { value: 'in_behandeling', label: 'In behandeling' },
  { value: 'klaar', label: 'Klaar' },
  { value: 'afgehandeld', label: 'Afgehandeld' },
  { value: 'afgewezen', label: 'Afgewezen' },
];

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    void fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('repair_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRepairs(
        data.map(
          (item): RepairRequest => ({
            id: item.id,
            reference_number: item.reference_number,
            user_id: item.user_id,
            device_type: item.device_type,
            device_brand: item.device_brand,
            device_model: item.device_model,
            repair_type: item.repair_type,
            problem_description: item.problem_description,
            customer_name: item.customer_name,
            customer_email: item.customer_email,
            customer_phone: item.customer_phone,
            customer_address: item.customer_address,
            preferred_date: item.preferred_date,
            status: item.status,
            notes: item.notes,
            price: item.price ? parseFloat(item.price) : null,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })
        )
      );
    }
    setLoading(false);
  };

  const filtered = repairs.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matches =
      r.reference_number.toLowerCase().includes(q) ||
      r.customer_name.toLowerCase().includes(q) ||
      r.device_model.toLowerCase().includes(q) ||
      r.repair_type.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matches && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-champagne rounded-lg w-48 animate-pulse" />
        <div className="h-64 bg-champagne rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-soft-black">
          Reparaties
        </h1>
        <p className="text-slate">{repairs.length} reparatieaanvragen in totaal</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
          <Input
            placeholder="Zoek op referentie, klant, apparaat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                statusFilter === filter.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-champagne text-slate hover:bg-sand'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-sand overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-champagne/50 border-b border-sand">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Referentie
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Apparaat
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Type reparatie
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Klant
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Datum
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Prijs
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Actie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.map((repair) => (
                <tr
                  key={repair.id}
                  className="hover:bg-champagne/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary">
                      {repair.reference_number}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-soft-black">
                        {repair.device_brand} {repair.device_model}
                      </p>
                      <p className="text-sm text-slate capitalize">
                        {repair.device_type}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">{repair.repair_type}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-soft-black">
                        {repair.customer_name}
                      </p>
                      <p className="text-sm text-slate">{repair.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {formatDate(repair.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={repair.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {repair.price !== null ? (
                      <span className="font-semibold text-success">
                        {formatPrice(repair.price)}
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/reparaties/${repair.id}`}>
                      <button className="p-2 text-slate hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-8 w-8 text-muted" />
            </div>
            <p className="text-slate">Geen reparaties gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
