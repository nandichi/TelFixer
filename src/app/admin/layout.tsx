'use client';

import { useState, useEffect, useRef } from 'react';
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
  Search,
  Plus,
  Bell,
  ExternalLink,
  Command as CommandIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { createClient } from '@/lib/supabase/client';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Bestellingen', href: '/admin/bestellingen', icon: ShoppingCart },
  { name: 'Reparaties', href: '/admin/reparaties', icon: Wrench },
  { name: 'Inleveringen', href: '/admin/inleveringen', icon: RefreshCw },
  { name: 'Producten', href: '/admin/producten', icon: Package },
  { name: 'Categorieen', href: '/admin/categorieen', icon: FolderTree },
  { name: 'Klanten', href: '/admin/klanten', icon: Users },
];

const secondaryNav = [
  { name: 'Instellingen', href: '/admin/instellingen', icon: Settings },
];

const quickAdd = [
  { name: 'Nieuw product', href: '/admin/producten/nieuw' },
  { name: 'Nieuwe categorie', href: '/admin/categorieen' },
];

interface SearchResult {
  id: string;
  type: 'order' | 'submission' | 'repair' | 'product' | 'customer';
  title: string;
  subtitle?: string;
  href: string;
}

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

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAdminStatus = async () => {
      if (authLoading) return;

      if (!user) {
        if (mounted) {
          setIsAdmin(false);
          router.push('/login?redirect=/admin');
        }
        return;
      }

      if (mounted) {
        setCheckingAdmin(true);
        setErrorMessage(null);
      }

      timeoutId = setTimeout(() => {
        if (mounted) {
          setErrorMessage('Admin check timeout - probeer opnieuw');
          setIsAdmin(false);
          setCheckingAdmin(false);
        }
      }, 3000);

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('admins')
          .select('id, role')
          .eq('user_id', user.id)
          .maybeSingle();

        clearTimeout(timeoutId);
        if (!mounted) return;

        if (error) {
          setErrorMessage(`Database fout: ${error.message}`);
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }

        if (data) {
          setIsAdmin(true);
          setAdminRole(data.role);
        } else {
          setIsAdmin(false);
          router.push('/');
        }
        setCheckingAdmin(false);
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (mounted) {
          setErrorMessage(
            `Onverwachte fout: ${err instanceof Error ? err.message : 'unknown'}`
          );
          setIsAdmin(false);
          setCheckingAdmin(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, authLoading, router]);

  // Cmd/Ctrl + K shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuickAddOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Click outside search
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Global search
  useEffect(() => {
    if (!searchQuery.trim() || !isAdmin) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.trim();
    setSearching(true);
    const timer = setTimeout(async () => {
      const supabase = createClient();
      try {
        const [orders, subs, reps, prods, custs] = await Promise.all([
          supabase
            .from('orders')
            .select('id, order_number, customer_email')
            .or(
              `order_number.ilike.%${q}%,customer_email.ilike.%${q}%`
            )
            .limit(4),
          supabase
            .from('device_submissions')
            .select(
              'id, reference_number, customer_name, device_brand, device_model'
            )
            .or(
              `reference_number.ilike.%${q}%,customer_name.ilike.%${q}%,device_model.ilike.%${q}%`
            )
            .limit(4),
          supabase
            .from('repair_requests')
            .select(
              'id, reference_number, customer_name, device_brand, device_model'
            )
            .or(
              `reference_number.ilike.%${q}%,customer_name.ilike.%${q}%,device_model.ilike.%${q}%`
            )
            .limit(4),
          supabase
            .from('products')
            .select('id, name, brand')
            .or(`name.ilike.%${q}%,brand.ilike.%${q}%`)
            .limit(4),
          supabase
            .from('users')
            .select('id, email, first_name, last_name')
            .or(
              `email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`
            )
            .limit(4),
        ]);

        const results: SearchResult[] = [];
        (orders.data ?? []).forEach((o) =>
          results.push({
            id: o.id,
            type: 'order',
            title: o.order_number,
            subtitle: o.customer_email,
            href: `/admin/bestellingen/${o.id}`,
          })
        );
        (reps.data ?? []).forEach((r) =>
          results.push({
            id: r.id,
            type: 'repair',
            title: `${r.device_brand} ${r.device_model}`,
            subtitle: `${r.reference_number} · ${r.customer_name}`,
            href: `/admin/reparaties/${r.id}`,
          })
        );
        (subs.data ?? []).forEach((s) =>
          results.push({
            id: s.id,
            type: 'submission',
            title: `${s.device_brand} ${s.device_model}`,
            subtitle: `${s.reference_number} · ${s.customer_name}`,
            href: `/admin/inleveringen/${s.id}`,
          })
        );
        (prods.data ?? []).forEach((p) =>
          results.push({
            id: p.id,
            type: 'product',
            title: p.name,
            subtitle: p.brand,
            href: `/admin/producten/${p.id}`,
          })
        );
        (custs.data ?? []).forEach((c) =>
          results.push({
            id: c.id,
            type: 'customer',
            title:
              [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email,
            subtitle: c.email,
            href: `/admin/klanten/${c.id}`,
          })
        );
        setSearchResults(results);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setSearching(false);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery, isAdmin]);

  if (authLoading || checkingAdmin || isAdmin === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-soft-black mb-2">
            {authLoading
              ? 'Authenticatie laden...'
              : 'Admin status controleren...'}
          </p>
          <p className="text-sm text-muted">
            Even geduld, we controleren je toegangsrechten.
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-soft-black mb-2">Fout</h2>
          <p className="text-slate mb-6">{errorMessage}</p>
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
            Je hebt geen toegang tot het admin dashboard.
          </p>
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

  const initials =
    (profile?.first_name?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase() +
    (profile?.last_name?.[0] ?? '').toUpperCase();

  return (
    <div className="admin-shell min-h-screen flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'var(--a-overlay)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          width: 'var(--a-sidebar-w)',
          background: 'var(--a-surface)',
          borderRight: '1px solid var(--a-border)',
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center justify-between gap-2 px-4"
          style={{
            height: 'var(--a-topbar-h)',
            borderBottom: '1px solid var(--a-border)',
          }}
        >
          <Link href="/admin" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[var(--a-accent)] flex items-center justify-center shrink-0">
              <Image
                src="/telfixer-logo.png"
                alt="TelFixer"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold leading-none text-[var(--a-text)] truncate">
                TelFixer
              </div>
              <div className="text-[10.5px] text-[var(--a-text-3)] mt-0.5 uppercase tracking-wider">
                Admin
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-[var(--a-text-3)] hover:bg-[var(--a-surface-2)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick add */}
        <div className="p-3 relative">
          <button
            type="button"
            onClick={() => setQuickAddOpen((v) => !v)}
            className="w-full h-8 inline-flex items-center justify-between gap-2 px-2.5 text-[13px] font-medium rounded-md bg-[var(--a-accent)] text-white hover:bg-[var(--a-accent-hover)] transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Nieuw aanmaken
            </span>
            <kbd className="text-[10px] px-1 py-0.5 rounded bg-white/20 admin-num">
              N
            </kbd>
          </button>
          {quickAddOpen && (
            <div
              className="absolute left-3 right-3 top-12 z-20 rounded-md border bg-[var(--a-surface)] shadow-[var(--a-shadow-lg)] py-1"
              style={{ borderColor: 'var(--a-border)' }}
            >
              {quickAdd.map((q) => (
                <Link
                  key={q.name}
                  href={q.href}
                  onClick={() => setQuickAddOpen(false)}
                  className="block px-3 py-1.5 text-[12.5px] text-[var(--a-text-2)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]"
                >
                  {q.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--a-text-4)]">
            Werk
          </div>
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-[var(--a-accent-soft)] text-[var(--a-accent)]'
                      : 'text-[var(--a-text-2)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      active
                        ? 'text-[var(--a-accent)]'
                        : 'text-[var(--a-text-3)]'
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="px-2 pt-4 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--a-text-4)]">
            Beheer
          </div>
          <div className="space-y-0.5">
            {secondaryNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-[var(--a-accent-soft)] text-[var(--a-accent)]'
                      : 'text-[var(--a-text-2)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      active
                        ? 'text-[var(--a-accent)]'
                        : 'text-[var(--a-text-3)]'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User card */}
        <div
          className="p-3 border-t"
          style={{ borderColor: 'var(--a-border)' }}
        >
          <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded-md">
            <div className="w-7 h-7 rounded-full bg-[var(--a-accent)] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-medium text-[var(--a-text)] truncate leading-tight">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
                  : profile?.email ?? user?.email}
              </div>
              <div className="text-[10.5px] text-[var(--a-text-3)] truncate">
                {adminRole === 'admin' ? 'Administrator' : 'Support'}
              </div>
            </div>
            <Link
              href="/"
              title="Naar site"
              className="p-1 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-2)]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-5"
          style={{
            height: 'var(--a-topbar-h)',
            background: 'var(--a-surface)',
            borderBottom: '1px solid var(--a-border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 -ml-1 rounded-md text-[var(--a-text-3)] hover:bg-[var(--a-surface-2)]"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--a-text-4)] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Zoek bestelling, klant, product..."
              className="w-full h-8 pl-8 pr-16 text-[13px] rounded-md bg-[var(--a-surface-2)] border border-transparent text-[var(--a-text)] placeholder:text-[var(--a-text-4)] focus:bg-[var(--a-surface)] focus:border-[var(--a-border-strong)] focus:outline-none transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 pointer-events-none">
              <kbd className="text-[10px] px-1 py-0.5 rounded bg-[var(--a-surface)] border border-[var(--a-border)] text-[var(--a-text-4)]">
                <CommandIcon className="h-2.5 w-2.5 inline" />
              </kbd>
              <kbd className="text-[10px] px-1 py-0.5 rounded bg-[var(--a-surface)] border border-[var(--a-border)] text-[var(--a-text-4)] admin-num">
                K
              </kbd>
            </div>

            {searchOpen && searchQuery.trim() && (
              <div
                className="absolute top-full mt-1 left-0 right-0 max-h-[420px] overflow-y-auto rounded-md border bg-[var(--a-surface)] shadow-[var(--a-shadow-lg)] py-1"
                style={{ borderColor: 'var(--a-border)' }}
              >
                {searching && (
                  <div className="px-3 py-2 text-[12px] text-[var(--a-text-4)] flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Zoeken...
                  </div>
                )}
                {!searching && searchResults.length === 0 && (
                  <div className="px-3 py-2 text-[12px] text-[var(--a-text-4)]">
                    Geen resultaten
                  </div>
                )}
                {searchResults.map((r) => (
                  <Link
                    key={`${r.type}-${r.id}`}
                    href={r.href}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-[var(--a-surface-2)]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
                        {r.title}
                      </div>
                      {r.subtitle && (
                        <div className="text-[11.5px] text-[var(--a-text-3)] truncate">
                          {r.subtitle}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold shrink-0">
                      {r.type === 'order'
                        ? 'Best.'
                        : r.type === 'repair'
                          ? 'Rep.'
                          : r.type === 'submission'
                            ? 'Inl.'
                            : r.type === 'product'
                              ? 'Prod.'
                              : 'Klant'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 text-[12.5px] font-medium rounded-md text-[var(--a-text-2)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)] transition-colors"
              title="Open site"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Site
            </Link>
            <button
              type="button"
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-[var(--a-text-3)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)] transition-colors"
              title="Notificaties"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
