'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree, Package, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/modal';
import { CategoryModal } from '@/components/admin/category-modal';
import { useToast } from '@/components/ui/toast';
import { Category } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface CategoryWithCount extends Category {
  product_count: number;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEdit = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-champagne rounded-lg w-48 animate-pulse" />
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-champagne rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-soft-black">
            Categorieen
          </h1>
          <p className="text-slate">{categories.length} categorieen in totaal</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe categorie
        </Button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-sand overflow-hidden">
        {categories.length > 0 ? (
          <div className="divide-y divide-sand">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-4 p-4 hover:bg-champagne/30 transition-colors group"
              >
                {/* Drag Handle */}
                <div className="text-muted cursor-grab">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FolderTree className="h-6 w-6 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-soft-black truncate">
                      {category.name}
                    </h3>
                    <span className="text-xs text-muted bg-champagne px-2 py-0.5 rounded-full">
                      /{category.slug}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-slate truncate mt-0.5">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Product Count */}
                <div className="flex items-center gap-2 text-sm text-slate">
                  <Package className="h-4 w-4" />
                  <span>{category.product_count} producten</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-slate hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-2 text-slate hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
              <FolderTree className="h-8 w-8 text-muted" />
            </div>
            <p className="text-slate mb-4">Nog geen categorieen</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Eerste categorie toevoegen
            </Button>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory || undefined}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
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
