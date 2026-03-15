'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    slug: string;
    description: string;
    sort_order: number;
  }) => Promise<void>;
  category?: Category & { sort_order?: number };
  mode: 'create' | 'edit';
}

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category && mode === 'edit') {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setSortOrder(category.sort_order || 0);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setSortOrder(0);
    }
  }, [category, mode, isOpen]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (mode === 'create') {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave({ name, slug, description, sort_order: sortOrder });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-soft-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sand">
          <h2 className="text-xl font-display font-bold text-soft-black">
            {mode === 'create' ? 'Nieuwe categorie' : 'Categorie bewerken'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-soft-black transition-colors rounded-lg hover:bg-champagne"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Naam"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="bijv. Telefoons"
            required
          />

          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="bijv. telefoons"
            helperText="Wordt gebruikt in de URL"
            required
          />

          <Textarea
            label="Beschrijving"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Korte beschrijving van de categorie..."
            rows={3}
          />

          <Input
            label="Sorteervolgorde"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            helperText="Lagere nummers worden eerst getoond"
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuleren
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              {mode === 'create' ? 'Toevoegen' : 'Opslaan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
