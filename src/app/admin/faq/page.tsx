'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { HelpCircle, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';
import { AdminModal } from '@/components/admin/ui/admin-modal';
import { AdminInput, AdminTextarea } from '@/components/admin/ui/admin-input';
import { ConfirmModal } from '@/components/ui/modal';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

const PLACEHOLDER_HINT =
  'Tip: gebruik {garantie_telefoons}, {garantie_laptops}, {garantie_tablets}, {garantie_reparaties}, {garantie_accessoires_nieuw}, {garantie_accessoires_gebruikt}, {garantie_nieuwe_apparaten}, {batterij_min} of {laptop_cycli} om garantiewaarden automatisch in te vullen. Nieuwe regels worden als losse alinea getoond.';

const emptyDraft: Omit<FaqItem, 'id'> = {
  category: '',
  question: '',
  answer: '',
  sort_order: 0,
  active: true,
};

export default function AdminFaqPage() {
  const { success, error: showError } = useToast();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [draft, setDraft] = useState<Omit<FaqItem, 'id'>>(emptyDraft);
  const [saving, setSaving] = useState(false);

  const [removeTarget, setRemoveTarget] = useState<FaqItem | null>(null);
  const [removing, setRemoving] = useState(false);

  const fetchItems = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('faq_items')
      .select('id, category, question, answer, sort_order, active')
      .order('sort_order', { ascending: true });
    if (!error && data) setItems(data as FaqItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).filter(Boolean),
    [items]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((i) => {
      const matchesSearch =
        !q ||
        i.question.toLowerCase().includes(q) ||
        i.answer.toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === 'all' || i.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    const maxSort = items.reduce((m, i) => Math.max(m, i.sort_order), 0);
    setDraft({ ...emptyDraft, sort_order: maxSort + 10 });
    setEditOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditing(item);
    setDraft({
      category: item.category,
      question: item.question,
      answer: item.answer,
      sort_order: item.sort_order,
      active: item.active,
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!draft.category.trim() || !draft.question.trim() || !draft.answer.trim()) {
      showError('Vul categorie, vraag en antwoord in');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    try {
      if (editing) {
        const { error } = await supabase
          .from('faq_items')
          .update({
            category: draft.category.trim(),
            question: draft.question.trim(),
            answer: draft.answer,
            sort_order: draft.sort_order,
            active: draft.active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editing.id);
        if (error) throw new Error(error.message);
        success('Vraag bijgewerkt');
      } else {
        const { error } = await supabase.from('faq_items').insert({
          category: draft.category.trim(),
          question: draft.question.trim(),
          answer: draft.answer,
          sort_order: draft.sort_order,
          active: draft.active,
        });
        if (error) throw new Error(error.message);
        success('Vraag toegevoegd');
      }
      setEditOpen(false);
      await fetchItems();
    } catch (e) {
      showError('Opslaan mislukt', e instanceof Error ? e.message : undefined);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: FaqItem) => {
    const previous = items;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i))
    );
    const supabase = createClient();
    const { error } = await supabase
      .from('faq_items')
      .update({ active: !item.active, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (error) {
      setItems(previous);
      showError('Wijzigen mislukt');
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('faq_items')
      .delete()
      .eq('id', removeTarget.id);
    if (error) {
      showError('Verwijderen mislukt', error.message);
    } else {
      success('Vraag verwijderd');
      setItems((prev) => prev.filter((i) => i.id !== removeTarget.id));
    }
    setRemoving(false);
    setRemoveTarget(null);
  };

  const columns: Column<FaqItem>[] = [
    {
      key: 'question',
      header: 'Vraag',
      sortable: true,
      sortValue: (r) => r.question,
      cell: (r) => (
        <div className="min-w-0 max-w-xl">
          <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
            {r.question}
          </div>
          <div className="text-[11.5px] text-[var(--a-text-3)] truncate">
            {r.category}
          </div>
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Volgorde',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.sort_order,
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-2)] admin-num">
          {r.sort_order}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      cell: (r) => (
        <button
          onClick={() => toggleActive(r)}
          className="inline-flex"
          title={r.active ? 'Zichtbaar - klik om te verbergen' : 'Verborgen - klik om te tonen'}
        >
          <StatusPill
            status={r.active ? 'active' : 'inactive'}
            tone={r.active ? 'success' : 'neutral'}
            label={r.active ? 'Zichtbaar' : 'Verborgen'}
            size="xs"
          />
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '90px',
      cell: (r) => (
        <div className="flex items-center justify-end gap-0.5">
          <button
            onClick={() => toggleActive(r)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-2)] transition-colors"
            title={r.active ? 'Verbergen' : 'Tonen'}
          >
            {r.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-2)] transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setRemoveTarget(r)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)] transition-colors"
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
        title="FAQ-beheer"
        description="Beheer de veelgestelde vragen die live op /faq verschijnen"
        actions={
          <AdminButton variant="primary" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" />
            Nieuwe vraag
          </AdminButton>
        }
      />

      <FilterBar
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Zoek in vragen en antwoorden...',
        }}
        filters={{
          value: categoryFilter,
          onChange: setCategoryFilter,
          options: [
            { value: 'all', label: 'Alle', count: items.length },
            ...categories.map((c) => ({
              value: c,
              label: c,
              count: items.filter((i) => i.category === c).length,
            })),
          ],
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        initialSort={{ key: 'order', direction: 'asc' }}
        onRowClick={(r) => openEdit(r)}
        empty={
          <EmptyState
            icon={HelpCircle}
            title="Geen vragen gevonden"
            description={
              searchQuery || categoryFilter !== 'all'
                ? 'Pas je filters aan om resultaten te zien.'
                : 'Voeg je eerste veelgestelde vraag toe.'
            }
            variant="compact"
          />
        }
      />

      <AdminModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={editing ? 'Vraag bewerken' : 'Nieuwe vraag'}
        size="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setEditOpen(false)}>
              Annuleren
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={saving}>
              {editing ? 'Opslaan' : 'Toevoegen'}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3.5">
          <AdminInput
            label="Categorie"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            placeholder="bijv. Retourneren"
            list="faq-categories"
            required
          />
          <datalist id="faq-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <AdminInput
            label="Vraag"
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            placeholder="bijv. Kan ik mijn aankoop retourneren?"
            required
          />
          <AdminTextarea
            label="Antwoord"
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            rows={6}
            hint={PLACEHOLDER_HINT}
            placeholder="Schrijf hier het antwoord..."
          />
          <div className="grid grid-cols-2 gap-3 items-end">
            <AdminInput
              label="Sorteervolgorde"
              type="number"
              value={draft.sort_order}
              onChange={(e) =>
                setDraft({ ...draft, sort_order: parseInt(e.target.value) || 0 })
              }
              hint="Lager = hoger in de lijst"
            />
            <label className="flex items-center gap-2 h-8 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.checked })
                }
                className="h-4 w-4 rounded border-[var(--a-border)] accent-[var(--a-accent)]"
              />
              <span className="text-[13px] text-[var(--a-text-2)]">
                Zichtbaar op de site
              </span>
            </label>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Vraag verwijderen"
        message={`Weet je zeker dat je "${removeTarget?.question}" wilt verwijderen?`}
        confirmText="Verwijderen"
        variant="danger"
        isLoading={removing}
      />
    </div>
  );
}
