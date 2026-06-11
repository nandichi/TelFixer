'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ShoppingCart,
  RefreshCw,
  CheckCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'nu';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}u`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const [{ data }, { count }] = await Promise.all([
      supabase
        .from('notifications')
        .select('id, type, title, body, link, read, created_at')
        .order('created_at', { ascending: false })
        .limit(8),
      supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false),
    ]);
    if (data) setItems(data as NotificationRow[]);
    setUnread(count ?? 0);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 45000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    if (unread === 0) return;
    const ids = items.filter((i) => !i.read).map((i) => i.id);
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    setUnread(0);
    const supabase = createClient();
    // Mark every unread row read (not just the visible 8)
    await supabase.from('notifications').update({ read: true }).eq('read', false);
    if (ids.length === 0) await fetchData();
  };

  const openItem = async (n: NotificationRow) => {
    setOpen(false);
    if (!n.read) {
      setItems((prev) =>
        prev.map((i) => (i.id === n.id ? { ...i, read: true } : i))
      );
      setUnread((u) => Math.max(0, u - 1));
      const supabase = createClient();
      await supabase.from('notifications').update({ read: true }).eq('id', n.id);
    }
    if (n.link) router.push(n.link);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative h-8 w-8 inline-flex items-center justify-center rounded-md text-[var(--a-text-3)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)] transition-colors"
        title="Notificaties"
        aria-label={`Notificaties${unread > 0 ? ` (${unread} ongelezen)` : ''}`}
      >
        <Bell className="h-3.5 w-3.5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[15px] h-[15px] px-1 text-[9px] font-bold text-white bg-[var(--a-accent)] rounded-full admin-num">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-[340px] max-h-[460px] overflow-hidden flex flex-col rounded-md border bg-[var(--a-surface)] shadow-[var(--a-shadow-lg)] z-50"
          style={{ borderColor: 'var(--a-border)' }}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--a-border)]">
            <span className="text-[13px] font-semibold text-[var(--a-text)]">
              Notificaties
            </span>
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="inline-flex items-center gap-1 text-[11.5px] text-[var(--a-text-3)] hover:text-[var(--a-accent)] disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              <CheckCheck className="h-3 w-3" />
              Alles gelezen
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {items.length === 0 ? (
              <div className="px-3 py-8 text-center text-[12px] text-[var(--a-text-4)]">
                Geen notificaties
              </div>
            ) : (
              items.map((n) => {
                const Icon = n.type === 'order' ? ShoppingCart : RefreshCw;
                return (
                  <button
                    key={n.id}
                    onClick={() => openItem(n)}
                    className={cn(
                      'w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--a-surface-2)] transition-colors border-b border-[var(--a-border)] last:border-0',
                      !n.read && 'bg-[var(--a-accent-soft)]/40'
                    )}
                  >
                    <div className="w-7 h-7 rounded-md bg-[var(--a-surface-2)] text-[var(--a-text-3)] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-medium text-[var(--a-text)] truncate">
                        {n.type === 'order' ? 'Nieuwe bestelling' : 'Nieuwe inlevering'}
                        {n.title ? ` - ${n.title}` : ''}
                      </div>
                      {n.body && (
                        <div className="text-[11px] text-[var(--a-text-3)] truncate">
                          {n.body}
                        </div>
                      )}
                    </div>
                    <span className="text-[10.5px] text-[var(--a-text-4)] admin-num inline-flex items-center gap-0.5 shrink-0">
                      <Clock className="h-2.5 w-2.5" />
                      {relTime(n.created_at)}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <Link
            href="/admin/notificaties"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 px-3 py-2.5 text-[12px] font-medium text-[var(--a-text-2)] hover:text-[var(--a-accent)] border-t border-[var(--a-border)] transition-colors"
          >
            Alle notificaties bekijken
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
