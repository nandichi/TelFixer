'use client';

import { useState } from 'react';
import { Search, Users, Mail, Phone, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

// Mock data
const mockCustomers = [
  {
    id: '1',
    first_name: 'Jan',
    last_name: 'de Vries',
    email: 'jan@example.com',
    phone: '+31 6 12345678',
    orders_count: 3,
    total_spent: 2147,
    created_at: '2025-10-15T10:30:00Z',
  },
  {
    id: '2',
    first_name: 'Maria',
    last_name: 'Jansen',
    email: 'maria@example.com',
    phone: '+31 6 87654321',
    orders_count: 1,
    total_spent: 549,
    created_at: '2025-11-20T14:15:00Z',
  },
  {
    id: '3',
    first_name: 'Peter',
    last_name: 'Bakker',
    email: 'peter@example.com',
    phone: null,
    orders_count: 2,
    total_spent: 1848,
    created_at: '2025-09-05T09:45:00Z',
  },
  {
    id: '4',
    first_name: 'Anna',
    last_name: 'Smit',
    email: 'anna@example.com',
    phone: '+31 6 11223344',
    orders_count: 5,
    total_spent: 3456,
    created_at: '2025-06-12T16:20:00Z',
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C3E48]">Klanten</h1>
        <p className="text-gray-600">{mockCustomers.length} geregistreerde klanten</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Zoek op naam of e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Klant
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Lid sinds
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                  Bestellingen
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Totaal besteed
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Actie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#094543] rounded-full flex items-center justify-center text-white font-medium">
                        {customer.first_name[0]}{customer.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-[#2C3E48]">
                          {customer.first_name} {customer.last_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {customer.email}
                      </p>
                      {customer.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(customer.created_at)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm font-medium">
                      {customer.orders_count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-[#094543]">
                      {formatPrice(customer.total_spent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#094543] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Geen klanten gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
