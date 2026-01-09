import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  RefreshCw,
  Users,
  Euro,
  ArrowUpRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getOrderStats, getRecentOrders } from '@/lib/supabase/orders';
import { getAllSubmissions } from '@/lib/supabase/submissions';

export default async function AdminDashboardPage() {
  const [stats, recentOrders, allSubmissions] = await Promise.all([
    getOrderStats(),
    getRecentOrders(3),
    getAllSubmissions(),
  ]);

  const recentSubmissions = allSubmissions.slice(0, 2);

  const statsDisplay = [
    {
      name: 'Totale omzet',
      value: formatPrice(stats.totalRevenue),
      icon: Euro,
    },
    {
      name: 'Bestellingen',
      value: stats.orderCount.toString(),
      icon: ShoppingCart,
    },
    {
      name: 'Inleveringen',
      value: stats.submissionCount.toString(),
      icon: RefreshCw,
    },
    {
      name: 'Klanten',
      value: stats.customerCount.toString(),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C3E48]">Dashboard</h1>
        <p className="text-gray-600">Overzicht van je TelFixer platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-8 w-8 text-[#094543]" />
              <span className="flex items-center text-sm font-medium text-emerald-600">
                <ArrowUpRight className="h-4 w-4 ml-1" />
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
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2C3E48]">{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {order.user?.first_name} {order.user?.last_name || order.user?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#094543]">
                      {formatPrice(order.total_price)}
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
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nog geen bestellingen
              </div>
            )}
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
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-[#2C3E48]">
                      {submission.device_brand} {submission.device_model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {submission.reference_number} - {submission.customer_name}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      submission.status === 'aanbieding_gemaakt'
                        ? 'bg-purple-100 text-purple-700'
                        : submission.status === 'evaluatie'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {submission.status === 'aanbieding_gemaakt'
                      ? 'Aanbieding gemaakt'
                      : submission.status === 'evaluatie'
                      ? 'In evaluatie'
                      : submission.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nog geen inleveringen
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
