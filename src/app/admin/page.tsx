import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  RefreshCw,
  Users,
  TrendingUp,
  Euro,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Mock statistics
const stats = [
  {
    name: 'Totale omzet',
    value: formatPrice(24589),
    change: '+12.5%',
    trend: 'up',
    icon: Euro,
  },
  {
    name: 'Bestellingen',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    name: 'Inleveringen',
    value: '43',
    change: '-2.1%',
    trend: 'down',
    icon: RefreshCw,
  },
  {
    name: 'Klanten',
    value: '892',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
  },
];

const recentOrders = [
  { id: '1', number: 'ORD-ABC123', customer: 'Jan de Vries', total: 799, status: 'betaald' },
  { id: '2', number: 'ORD-DEF456', customer: 'Maria Jansen', total: 549, status: 'verzonden' },
  { id: '3', number: 'ORD-GHI789', customer: 'Peter Bakker', total: 1299, status: 'in_behandeling' },
];

const recentSubmissions = [
  { id: '1', ref: 'TF-XYZ789', device: 'iPhone 14 Pro', customer: 'Anna Smit', status: 'evaluatie' },
  { id: '2', ref: 'TF-ABC123', device: 'MacBook Air', customer: 'Tom Visser', status: 'aanbieding_gemaakt' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C3E48]">Dashboard</h1>
        <p className="text-gray-600">Overzicht van je TelFixer platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-8 w-8 text-[#094543]" />
              <span
                className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 ml-1" />
                )}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-[#2C3E48]">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/producten/nieuw"
          className="bg-[#094543] text-white rounded-xl p-6 hover:bg-[#0d5c59] transition-colors"
        >
          <Package className="h-8 w-8 mb-3" />
          <h3 className="font-semibold">Nieuw product</h3>
          <p className="text-sm text-white/80">Voeg een refurbished product toe</p>
        </Link>
        <Link
          href="/admin/bestellingen"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#094543] transition-colors"
        >
          <ShoppingCart className="h-8 w-8 text-[#094543] mb-3" />
          <h3 className="font-semibold text-[#2C3E48]">Bestellingen</h3>
          <p className="text-sm text-gray-500">Beheer en verwerk bestellingen</p>
        </Link>
        <Link
          href="/admin/inleveringen"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#094543] transition-colors"
        >
          <RefreshCw className="h-8 w-8 text-[#094543] mb-3" />
          <h3 className="font-semibold text-[#2C3E48]">Inleveringen</h3>
          <p className="text-sm text-gray-500">Beoordeel ingeleverde apparaten</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-[#2C3E48]">Recente bestellingen</h2>
            <Link
              href="/admin/bestellingen"
              className="text-sm text-[#094543] hover:underline"
            >
              Bekijk alles
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#2C3E48]">{order.number}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#094543]">
                    {formatPrice(order.total)}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'betaald'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.status === 'verzonden'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {order.status === 'in_behandeling' ? 'In behandeling' : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-[#2C3E48]">Recente inleveringen</h2>
            <Link
              href="/admin/inleveringen"
              className="text-sm text-[#094543] hover:underline"
            >
              Bekijk alles
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#2C3E48]">{submission.device}</p>
                  <p className="text-sm text-gray-500">
                    {submission.ref} - {submission.customer}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    submission.status === 'aanbieding_gemaakt'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {submission.status === 'aanbieding_gemaakt'
                    ? 'Aanbieding gemaakt'
                    : 'In evaluatie'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
