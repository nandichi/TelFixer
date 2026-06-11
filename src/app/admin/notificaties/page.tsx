'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ShoppingCart,
  RefreshCw,
  CheckCheck,
  Trash2,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { AdminButton } from '@/components/admin/ui/admin-button';
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
  if (m < 1) return 'zojuist';
  if (m < 60) return `${m} min geleden`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} uur geleden`;
  const d = Math.floor(h / 24);
  return `${d} dag${d === 1 ? '' : 'en'} geleden`;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchItems = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, title, body, link, read, created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (!error && data) setItems(data as NotificationRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const unreadCount = items.filter((i) => !i.read).length;

  const filtered = useMemo(
    () => (filter === 'unread' ? items.filter((i) => !i.read) : items),
    [items, filter]
  );

  const markRead = async (id: string, read = true) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read } : i)));
    const supabase = createClient();
    await supabase.from('notifications').update({ read }).eq('id', id);
  };

  const markAllRead = async () => {
    const unreadIds = items.filter((i) => !i.read).map((i) => i.id);
    if (unreadIds.length === 0) return;
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds);
    if (error) showError('Markeren mislukt');
    else success('Alle notificaties gelezen');
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const supabase = createClient();
    await supabase.from('notifications').delete().eq('id', id);
  };

  const open = (n: NotificationRow) => {
    if (!n.read) markRead(n.id);
    if (n.link) router.push(n.link);
  };

  const Icon = (type: string) => (type === 'order' ? ShoppingCart : RefreshCw);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notificaties"
        description={
          unreadCount > 0
            ? `${unreadCount} ongelezen notificatie${unreadCount === 1 ? '' : 's'}`
            : 'Alles is gelezen'
        }
        actions={
          <AdminButton
            variant="secondary"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Alles als gelezen
          </AdminButton>
        }
      />

      <FilterBar
        filters={{
          value: filter,
          onChange: setFilter,
          options: [
            { value: 'all', label: 'Alle', count: items.length },
            { value: 'unread', label: 'Ongelezen', count: unreadCount },
          ],
        }}
      />

      <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] overflow-hidden">
        {loading ? (
          <div className="divide-y divide-[var(--a-border)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[var(--a-surface-2)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-1/3 rounded bg-[var(--a-surface-2)] animate-pulse" />
                  <div className="h-2.5 w-1/2 rounded bg-[var(--a-surface-2)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'Geen ongelezen notificaties' : 'Nog geen notificaties'}
            description="Nieuwe bestellingen en inleveringen verschijnen hier automatisch."
            variant="compact"
          />
        ) : (
          <div className="divide-y divide-[var(--a-border)]">
            {filtered.map((n) => {
              const TypeIcon = Icon(n.type);
              return (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors group',
                    !n.read && 'bg-[var(--a-accent-soft)]/40'
                  )}
                >
                  <button
                    onClick={() => open(n)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <div className="w-9 h-9 rounded-md bg-[var(--a-surface-2)] text-[var(--a-text-3)] flex items-center justify-center shrink-0 relative">
                      <TypeIcon className="h-4 w-4" />
                      {!n.read && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--a-accent)]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
                        {n.type === 'order' ? 'Nieuwe bestelling' : 'Nieuwe inlevering'}
                        {n.title ? ` - ${n.title}` : ''}
                      </div>
                      <div className="text-[11.5px] text-[var(--a-text-3)] truncate">
                        {n.body || 'Bekijk de details'}
                      </div>
                    </div>
                  </button>
                  <span className="text-[11px] text-[var(--a-text-4)] admin-num inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <Clock className="h-2.5 w-2.5" />
                    {relTime(n.created_at)}
                  </span>
                  <button
                    onClick={() => remove(n.id)}
                    className="p-1.5 rounded-md text-[var(--a-text-4)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)] transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                    aria-label="Verwijderen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
