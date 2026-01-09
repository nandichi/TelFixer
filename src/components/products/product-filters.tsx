'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Category, ConditionGrade } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  initialFilters?: {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string[];
  };
}

const conditionOptions: { value: ConditionGrade; label: string }[] = [
  { value: 'als_nieuw', label: 'Als nieuw' },
  { value: 'zeer_goed', label: 'Zeer goed' },
  { value: 'goed', label: 'Goed' },
  { value: 'sterk_gebruikt', label: 'Sterk gebruikt' },
];

export function ProductFilters({
  categories,
  brands,
  initialFilters = {},
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    condition: true,
  });

  // Local state for filters
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('categorie') || ''
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get('merk') || ''
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.get('conditie')?.split(',').filter(Boolean) || []
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove each parameter
    if (selectedCategory) {
      params.set('categorie', selectedCategory);
    } else {
      params.delete('categorie');
    }

    if (selectedBrand) {
      params.set('merk', selectedBrand);
    } else {
      params.delete('merk');
    }

    if (minPrice) {
      params.set('min', minPrice);
    } else {
      params.delete('min');
    }

    if (maxPrice) {
      params.set('max', maxPrice);
    } else {
      params.delete('max');
    }

    if (selectedConditions.length > 0) {
      params.set('conditie', selectedConditions.join(','));
    } else {
      params.delete('conditie');
    }

    // Reset to page 1 when filters change
    params.delete('pagina');

    router.push(`${pathname}?${params.toString()}`);
    setIsMobileOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedConditions([]);
    router.push(pathname);
    setIsMobileOpen(false);
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedBrand ||
    minPrice ||
    maxPrice ||
    selectedConditions.length > 0;

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left font-semibold text-[#2C3E48] mb-3"
        >
          Categorie
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="text-[#094543] focus:ring-[#094543]"
              />
              <span className="text-sm text-gray-700">Alle categorieen</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.slug}
                  onChange={() => setSelectedCategory(cat.slug)}
                  className="text-[#094543] focus:ring-[#094543]"
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-left font-semibold text-[#2C3E48] mb-3"
        >
          Merk
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === ''}
                onChange={() => setSelectedBrand('')}
                className="text-[#094543] focus:ring-[#094543]"
              />
              <span className="text-sm text-gray-700">Alle merken</span>
            </label>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => setSelectedBrand(brand)}
                  className="text-[#094543] focus:ring-[#094543]"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-semibold text-[#2C3E48] mb-3"
        >
          Prijs
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="text-sm"
            />
          </div>
        )}
      </div>

      {/* Condition Filter */}
      <div>
        <button
          onClick={() => toggleSection('condition')}
          className="flex items-center justify-between w-full text-left font-semibold text-[#2C3E48] mb-3"
        >
          Conditie
          {expandedSections.condition ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.condition && (
          <div className="space-y-2">
            {conditionOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(option.value)}
                  onChange={() => toggleCondition(option.value)}
                  className="rounded text-[#094543] focus:ring-[#094543]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <Button onClick={updateFilters} fullWidth>
          Filters toepassen
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" fullWidth>
            Filters wissen
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="outline"
          className="w-full"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-[#094543] text-white rounded-full">
              Actief
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#2C3E48]">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </>
  );
}
