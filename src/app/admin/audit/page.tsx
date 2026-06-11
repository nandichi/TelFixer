'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ScrollText, RefreshCw } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';

interface AuditEntry {
  id: string;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: string | null;
  created_at: string;
}

const entityLabels: Record<string, string> = {
  products: 'Product',
  categories: 'Categorie',
  faq_items: 'FAQ',
  discount_codes: 'Kortingscode',
  admins: 'Teamlid',
  site_settings: 'Instelling',
};

const actionConfig: Record<
  string,
  { label: string; tone: 'success' | 'info' | 'danger' | 'neutral' }
> = {
  insert: { label: 'Aangemaakt', tone: 'success' },
  update: { label: 'Bijgewerkt', tone: 'info' },
  delete: { label: 'Verwijderd', tone: 'danger' },
};

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('audit_log')
      .select('id, actor_email, action, entity_type, entity_id, summary, created_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (!error && data) setEntries(data as AuditEntry[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const entityTypes = useMemo(
    () => Array.from(new Set(entries.map((e) => e.entity_type))),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesSearch =
        !q ||
        (e.actor_email?.toLowerCase() ?? '').includes(q) ||
        (e.summary?.toLowerCase() ?? '').includes(q) ||
        (e.entity_id?.toLowerCase() ?? '').includes(q);
      const matchesEntity =
        entityFilter === 'all' || e.entity_type === entityFilter;
      return matchesSearch && matchesEntity;
    });
  }, [entries, searchQuery, entityFilter]);

  const columns: Column<AuditEntry>[] = [
    {
      key: 'created_at',
      header: 'Wanneer',
      width: '180px',
      sortable: true,
      sortValue: (r) => new Date(r.created_at).getTime(),
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-2)] admin-num">
          {formatDateTime(r.created_at)}
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Wie',
      sortable: true,
      sortValue: (r) => r.actor_email ?? '',
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text)]">
          {r.actor_email || 'systeem'}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Actie',
      cell: (r) => {
        const cfg = actionConfig[r.action] ?? {
          label: r.action,
          tone: 'neutral' as const,
        };
        return (
          <StatusPill
            status={r.action}
            tone={cfg.tone}
            label={cfg.label}
            size="xs"
          />
        );
      },
    },
    {
      key: 'entity',
      header: 'Onderdeel',
      cell: (r) => (
        <div className="min-w-0">
          <div className="text-[12.5px] font-medium text-[var(--a-text)]">
            {entityLabels[r.entity_type] ?? r.entity_type}
          </div>
          {r.summary && (
            <div className="text-[11.5px] text-[var(--a-text-3)] truncate max-w-md">
              {r.summary}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Audit-log"
        description="Overzicht van wijzigingen in het adminpaneel"
        actions={
          <AdminButton variant="secondary" onClick={fetchEntries}>
            <RefreshCw className="h-3.5 w-3.5" />
            Vernieuwen
          </AdminButton>
        }
      />

      <FilterBar
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Zoek op persoon of omschrijving...',
        }}
        filters={{
          value: entityFilter,
          onChange: setEntityFilter,
          options: [
            { value: 'all', label: 'Alle', count: entries.length },
            ...entityTypes.map((t) => ({
              value: t,
              label: entityLabels[t] ?? t,
              count: entries.filter((e) => e.entity_type === t).length,
            })),
          ],
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        pageSize={30}
        initialSort={{ key: 'created_at', direction: 'desc' }}
        empty={
          <EmptyState
            icon={ScrollText}
            title="Nog geen activiteit"
            description="Zodra er wijzigingen in het adminpaneel worden gemaakt, verschijnen ze hier."
            variant="compact"
          />
        }
      />
    </div>
  );
}
