'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree, Package } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/modal';
import { CategoryModal } from '@/components/admin/category-modal';
import { useToast } from '@/components/ui/toast';
import { Category } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { AdminButton } from '@/components/admin/ui/admin-button';

interface CategoryWithCount extends Category {
  product_count: number;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithCount | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { success, error: showError } = useToast();

  const fetchCategories = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*, products(id)')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setCategories(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          created_at: item.created_at,
          sort_order: item.sort_order || 0,
          product_count: item.products?.length || 0,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (data: {
    name: string;
    slug: string;
    description: string;
    sort_order: number;
  }) => {
    const supabase = createClient();
    if (modalMode === 'create') {
      const { error } = await supabase.from('categories').insert({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        sort_order: data.sort_order,
      });
      if (error) {
        showError(`Fout bij toevoegen: ${error.message}`);
        throw error;
      }
      success('Categorie toegevoegd');
    } else if (selectedCategory) {
      const { error } = await supabase
        .from('categories')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          sort_order: data.sort_order,
        })
        .eq('id', selectedCategory.id);
      if (error) {
        showError(`Fout bij opslaan: ${error.message}`);
        throw error;
      }
      success('Categorie bijgewerkt');
    }
    fetchCategories();
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    if (selectedCategory.product_count > 0) {
      showError(
        `Deze categorie bevat ${selectedCategory.product_count} product(en). Verwijder of verplaats eerst de producten.`
      );
      setDeleteModalOpen(false);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', selectedCategory.id);
    if (error) {
      showError(`Fout bij verwijderen: ${error.message}`);
    } else {
      success('Categorie verwijderd');
      fetchCategories();
    }
    setDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Categorieen"
        description={`${categories.length} categorieen in catalogus`}
        actions={
          <AdminButton
            variant="primary"
            onClick={() => {
              setSelectedCategory(null);
              setModalMode('create');
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Nieuwe categorie
          </AdminButton>
        }
      />

      <Section padding="none">
        {loading ? (
          <div className="divide-y divide-[var(--a-border)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-md bg-[var(--a-surface-2)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-1/3 rounded bg-[var(--a-surface-2)] animate-pulse" />
                  <div className="h-2.5 w-1/2 rounded bg-[var(--a-surface-2)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="Nog geen categorieen"
            description="Categorieen helpen je producten organiseren in de catalogus."
            action={
              <AdminButton
                variant="primary"
                onClick={() => {
                  setSelectedCategory(null);
                  setModalMode('create');
                  setModalOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Eerste categorie toevoegen
              </AdminButton>
            }
          />
        ) : (
          <div className="divide-y divide-[var(--a-border)]">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 px-4 py-2.5 group hover:bg-[var(--a-surface-2)] transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-[var(--a-accent-soft)] text-[var(--a-accent)] flex items-center justify-center shrink-0">
                  <FolderTree className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-[var(--a-text)] truncate">
                      {c.name}
                    </h3>
                    <code className="text-[11px] font-mono text-[var(--a-text-3)] bg-[var(--a-surface-2)] px-1.5 py-0.5 rounded">
                      /{c.slug}
                    </code>
                  </div>
                  {c.description && (
                    <p className="text-[12px] text-[var(--a-text-3)] truncate mt-0.5">
                      {c.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[12px] text-[var(--a-text-3)] shrink-0">
                  <Package className="h-3 w-3" />
                  <span className="admin-num">{c.product_count}</span>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedCategory(c);
                      setModalMode('edit');
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-3)] transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(c);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)] transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory || undefined}
        mode={modalMode}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Categorie verwijderen"
        message={`Weet je zeker dat je "${selectedCategory?.name}" wilt verwijderen?${
          selectedCategory?.product_count
            ? ` Deze categorie bevat ${selectedCategory.product_count} product(en).`
            : ''
        }`}
        confirmText="Verwijderen"
        variant="danger"
      />
    </div>
  );
}
