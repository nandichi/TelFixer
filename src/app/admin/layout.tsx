'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCw,
  Wrench,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  FolderTree,
  Loader2,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { createClient } from '@/lib/supabase/client';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Producten', href: '/admin/producten', icon: Package },
  { name: 'Categorieen', href: '/admin/categorieen', icon: FolderTree },
  { name: 'Bestellingen', href: '/admin/bestellingen', icon: ShoppingCart },
  { name: 'Inleveringen', href: '/admin/inleveringen', icon: RefreshCw },
  { name: 'Reparaties', href: '/admin/reparaties', icon: Wrench },
  { name: 'Klanten', href: '/admin/klanten', icon: Users },
  { name: 'Instellingen', href: '/admin/instellingen', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAdminStatus = async () => {
      console.log('=== ADMIN CHECK START ===');
      console.log('Auth loading:', authLoading);
      console.log('User:', user?.id, user?.email);

      // Wait for auth to be ready
      if (authLoading) {
        console.log('Still loading auth, waiting...');
        return;
      }

      // No user = redirect to login
      if (!user) {
        console.log('No user, redirecting to login');
        if (mounted) {
          setIsAdmin(false);
          router.push('/login?redirect=/admin');
        }
        return;
      }

      // Start checking
      if (mounted) {
        setCheckingAdmin(true);
        setErrorMessage(null);
      }

      console.log('Starting admin check for user:', user.id);

      // Set timeout that will trigger after 3 seconds
      timeoutId = setTimeout(() => {
        console.log('TIMEOUT: Admin check took too long');
        if (mounted) {
          setErrorMessage('Admin check timeout - probeer opnieuw');
          setIsAdmin(false);
          setCheckingAdmin(false);
        }
      }, 3000);

      try {
        const supabase = createClient();
        console.log('Supabase client created, executing query...');

        const startTime = Date.now();
        const { data, error } = await supabase
          .from('admins')
          .select('id, role')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle to avoid error on no rows

        const duration = Date.now() - startTime;
        console.log(`Query completed in ${duration}ms`);
        console.log('Query result:', { data, error });

        // Clear timeout if query completes
        clearTimeout(timeoutId);

        if (!mounted) return;

        if (error) {
          console.error('Database error:', error);
          setErrorMessage(`Database fout: ${error.message}`);
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }

        if (data) {
          console.log('✓ User IS admin with role:', data.role);
          setIsAdmin(true);
          setAdminRole(data.role);
        } else {
          console.log('✗ User is NOT an admin');
          setIsAdmin(false);
          router.push('/');
        }

        setCheckingAdmin(false);
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error('Unexpected error in admin check:', err);
        if (mounted) {
          setErrorMessage(`Onverwachte fout: ${err.message}`);
          setIsAdmin(false);
          setCheckingAdmin(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, authLoading, router]);

  // Show loading while auth is loading OR admin check is in progress
  if (authLoading || checkingAdmin || isAdmin === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-soft-black mb-2">
            {authLoading ? 'Authenticatie laden...' : 'Admin status controleren...'}
          </p>
          <p className="text-sm text-muted">
            Even geduld, we controleren je toegangsrechten.
          </p>
          {user && (
            <p className="text-xs text-muted mt-3">
              User ID: {user.id}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show error if there was one
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-soft-black mb-2">Fout</h2>
          <p className="text-slate mb-6">{errorMessage}</p>
          {user && (
            <p className="text-xs text-muted mb-4">User: {user.email}</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
            >
              Opnieuw proberen
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-sand text-soft-black rounded-xl hover:bg-sand/80 transition-colors font-medium"
            >
              Terug naar home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-soft-black mb-2">
            Geen toegang
          </h2>
          <p className="text-slate mb-6">
            Je hebt geen toegang tot het admin dashboard. Neem contact op met
            een administrator om toegang te krijgen.
          </p>
          {user && (
            <p className="text-xs text-muted mb-4">Ingelogd als: {user.email}</p>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" />
            Terug naar site
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  // Get breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentPath = '';

    for (const path of paths) {
      currentPath += `/${path}`;
      const navItem = navigation.find((n) => n.href === currentPath);
      breadcrumbs.push({
        name: navItem?.name || path.charAt(0).toUpperCase() + path.slice(1),
        href: currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-soft-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-primary to-primary-dark transform transition-transform duration-300 lg:translate-x-0 shadow-xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Image
                src="/telfixer-logo.png"
                alt="TelFixer"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-display font-bold text-white">
                TelFixer
              </span>
              <span className="block text-xs text-white/60 -mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group',
                isActive(item.href)
                  ? 'bg-white text-primary shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-transform group-hover:scale-110',
                  isActive(item.href) ? 'text-primary' : ''
                )}
              />
              <span>{item.name}</span>
              {isActive(item.href) && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* Admin Info & Back Link */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          {/* Admin badge */}
          <div className="mb-3 px-4 py-2 bg-white/5 rounded-xl">
            <p className="text-xs text-white/50 uppercase tracking-wider">
              Ingelogd als
            </p>
            <p className="text-sm text-white font-medium truncate">
              {profile?.first_name || profile?.email || 'Admin'}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-copper/20 text-copper-light text-xs rounded-full font-medium">
              {adminRole === 'admin' ? 'Administrator' : 'Support'}
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Terug naar site</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-sand flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate hover:text-soft-black transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4 text-muted" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-soft-black">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* Admin user info */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate hidden sm:inline">
              {profile?.first_name || profile?.email || 'Admin'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-sm font-bold shadow-md">
              {profile?.first_name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
