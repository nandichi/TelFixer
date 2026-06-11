'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Ticket, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';
import { AdminModal } from '@/components/admin/ui/admin-modal';
import { ConfirmModal } from '@/components/ui/modal';
import { AdminInput, AdminSelect } from '@/components/admin/ui/admin-input';

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

interface Draft {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: string;
  min_order_amount: string;
  max_uses: string;
  starts_at: string;
  expires_at: string;
  active: boolean;
}

const emptyDraft: Draft = {
  code: '',
  description: '',
  type: 'percentage',
  value: '',
  min_order_amount: '',
  max_uses: '',
  starts_at: '',
  expires_at: '',
  active: true,
};

const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : '');

export default function AdminDiscountCodesPage() {
  const { success, error: showError } = useToast();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DiscountCode | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCodes = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setCodes(data as DiscountCode[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return codes.filter((c) => {
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        (c.description?.toLowerCase() ?? '').includes(q);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && c.active) ||
        (statusFilter === 'inactive' && !c.active);
      return matchesSearch && matchesStatus;
    });
  }, [codes, searchQuery, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setEditOpen(true);
  };

  const openEdit = (c: DiscountCode) => {
    setEditing(c);
    setDraft({
      code: c.code,
      description: c.description ?? '',
      type: c.type,
      value: String(c.value),
      min_order_amount: c.min_order_amount ? String(c.min_order_amount) : '',
      max_uses: c.max_uses != null ? String(c.max_uses) : '',
      starts_at: toDateInput(c.starts_at),
      expires_at: toDateInput(c.expires_at),
      active: c.active,
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    const code = draft.code.trim().toUpperCase();
    const value = parseFloat(draft.value);
    if (!code) {
      showError('Vul een code in');
      return;
    }
    if (isNaN(value) || value <= 0) {
      showError('Vul een geldige waarde in');
      return;
    }
    if (draft.type === 'percentage' && value > 100) {
      showError('Een percentage kan niet hoger zijn dan 100');
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const payload = {
      code,
      description: draft.description.trim() || null,
      type: draft.type,
      value,
      min_order_amount: draft.min_order_amount
        ? parseFloat(draft.min_order_amount) || 0
        : 0,
      max_uses: draft.max_uses ? parseInt(draft.max_uses) || null : null,
      starts_at: draft.starts_at
        ? new Date(`${draft.starts_at}T00:00:00`).toISOString()
        : null,
      expires_at: draft.expires_at
        ? new Date(`${draft.expires_at}T23:59:59`).toISOString()
        : null,
      active: draft.active,
    };

    if (editing) {
      const { error } = await supabase
        .from('discount_codes')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editing.id);
      if (error) {
        showError(
          error.code === '23505'
            ? 'Deze code bestaat al'
            : `Opslaan mislukt: ${error.message}`
        );
        setSaving(false);
        return;
      }
      success('Kortingscode bijgewerkt');
    } else {
      const { error } = await supabase.from('discount_codes').insert(payload);
      if (error) {
        showError(
          error.code === '23505'
            ? 'Deze code bestaat al'
            : `Aanmaken mislukt: ${error.message}`
        );
        setSaving(false);
        return;
      }
      success('Kortingscode aangemaakt');
    }
    setSaving(false);
    setEditOpen(false);
    fetchCodes();
  };

  const toggleActive = async (c: DiscountCode) => {
    setCodes((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x))
    );
    const supabase = createClient();
    const { error } = await supabase
      .from('discount_codes')
      .update({ active: !c.active, updated_at: new Date().toISOString() })
      .eq('id', c.id);
    if (error) {
      showError('Wijzigen mislukt');
      fetchCodes();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      showError('Verwijderen mislukt');
      return;
    }
    success('Kortingscode verwijderd');
    setDeleteTarget(null);
    fetchCodes();
  };

  const isExpired = (c: DiscountCode) =>
    c.expires_at != null && new Date(c.expires_at).getTime() < Date.now();

  const columns: Column<DiscountCode>[] = [
    {
      key: 'code',
      header: 'Code',
      sortable: true,
      sortValue: (r) => r.code,
      cell: (r) => (
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[var(--a-text)] font-mono">
            {r.code}
          </div>
          {r.description && (
            <div className="text-[11.5px] text-[var(--a-text-3)] truncate max-w-xs">
              {r.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Korting',
      cell: (r) => (
        <span className="text-[12.5px] font-medium text-[var(--a-text)] admin-num">
          {r.type === 'percentage' ? `${r.value}%` : formatPrice(r.value)}
        </span>
      ),
    },
    {
      key: 'min',
      header: 'Vanaf',
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-3)] admin-num">
          {r.min_order_amount > 0 ? formatPrice(r.min_order_amount) : '-'}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Gebruikt',
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-3)] admin-num">
          {r.used_count}
          {r.max_uses != null && r.max_uses > 0 ? ` / ${r.max_uses}` : ''}
        </span>
      ),
    },
    {
      key: 'expires',
      header: 'Geldig tot',
      cell: (r) =>
        r.expires_at ? (
          <span
            className={`text-[12px] admin-num ${
              isExpired(r) ? 'text-[var(--a-danger)]' : 'text-[var(--a-text-3)]'
            }`}
          >
            {formatDate(r.expires_at)}
          </span>
        ) : (
          <span className="text-[12px] text-[var(--a-text-4)]">Geen einddatum</span>
        ),
    },
    {
      key: 'active',
      header: 'Status',
      cell: (r) => (
        <button onClick={() => toggleActive(r)} className="cursor-pointer">
          <StatusPill
            status={r.active ? 'active' : 'inactive'}
            tone={r.active ? 'success' : 'neutral'}
            label={r.active ? 'Actief' : 'Uit'}
            size="xs"
          />
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => toggleActive(r)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-2)] transition-colors"
            title={r.active ? 'Deactiveren' : 'Activeren'}
          >
            {r.active ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-2)] transition-colors"
            title="Bewerken"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(r)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)] transition-colors"
            title="Verwijderen"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Kortingscodes"
        description="Beheer kortingscodes voor de checkout"
        actions={
          <AdminButton variant="primary" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" />
            Nieuwe code
          </AdminButton>
        }
      />

      <FilterBar
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Zoek op code of omschrijving...',
        }}
        filters={{
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { value: 'all', label: 'Alle', count: codes.length },
            {
              value: 'active',
              label: 'Actief',
              count: codes.filter((c) => c.active).length,
            },
            {
              value: 'inactive',
              label: 'Uit',
              count: codes.filter((c) => !c.active).length,
            },
          ],
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        pageSize={20}
        empty={
          <EmptyState
            icon={Ticket}
            title="Nog geen kortingscodes"
            description="Maak een kortingscode aan die klanten bij de checkout kunnen gebruiken."
            action={
              <AdminButton variant="primary" onClick={openCreate}>
                <Plus className="h-3.5 w-3.5" />
                Nieuwe code
              </AdminButton>
            }
          />
        }
      />

      <AdminModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={editing ? 'Kortingscode bewerken' : 'Nieuwe kortingscode'}
        size="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setEditOpen(false)}>
              Annuleren
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={saving}>
              {editing ? 'Opslaan' : 'Aanmaken'}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Code"
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value })}
              placeholder="bijv. WELKOM10"
              className="font-mono uppercase"
              required
            />
            <div className="flex items-center gap-2 self-end h-9">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) =>
                    setDraft({ ...draft, active: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-[var(--a-border)] accent-[var(--a-accent)]"
                />
                <span className="text-[13px] text-[var(--a-text-2)]">Actief</span>
              </label>
            </div>
          </div>

          <AdminInput
            label="Omschrijving (optioneel)"
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            placeholder="bijv. Welkomstkorting nieuwe klanten"
          />

          <div className="grid grid-cols-2 gap-3">
            <AdminSelect
              label="Type"
              value={draft.type}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  type: e.target.value as 'percentage' | 'fixed',
                })
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Vast bedrag (EUR)</option>
            </AdminSelect>
            <AdminInput
              label={draft.type === 'percentage' ? 'Percentage' : 'Bedrag'}
              type="number"
              step="0.01"
              suffix={draft.type === 'percentage' ? '%' : undefined}
              prefix={draft.type === 'fixed' ? '€' : undefined}
              value={draft.value}
              onChange={(e) => setDraft({ ...draft, value: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Min. bestelbedrag"
              type="number"
              step="0.01"
              prefix="€"
              hint="Leeg = geen minimum"
              value={draft.min_order_amount}
              onChange={(e) =>
                setDraft({ ...draft, min_order_amount: e.target.value })
              }
            />
            <AdminInput
              label="Max. aantal keer"
              type="number"
              hint="Leeg = onbeperkt"
              value={draft.max_uses}
              onChange={(e) => setDraft({ ...draft, max_uses: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Geldig vanaf (optioneel)"
              type="date"
              value={draft.starts_at}
              onChange={(e) =>
                setDraft({ ...draft, starts_at: e.target.value })
              }
            />
            <AdminInput
              label="Geldig tot (optioneel)"
              type="date"
              value={draft.expires_at}
              onChange={(e) =>
                setDraft({ ...draft, expires_at: e.target.value })
              }
            />
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Kortingscode verwijderen"
        message={`Weet je zeker dat je "${deleteTarget?.code}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        variant="danger"
      />
    </div>
  );
}
