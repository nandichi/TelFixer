'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left font-semibold text-soft-black mb-4"
        >
          <span className="text-sm uppercase tracking-widest text-copper">Categorie</span>
          <svg 
            className={cn("w-4 h-4 text-muted transition-transform", expandedSections.category && "rotate-180")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.category && (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                selectedCategory === '' ? "bg-primary border-primary" : "border-sand group-hover:border-primary"
              )}>
                {selectedCategory === '' && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="sr-only"
              />
              <span className="text-sm text-slate group-hover:text-soft-black transition-colors">Alle categorieen</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  selectedCategory === cat.slug ? "bg-primary border-primary" : "border-sand group-hover:border-primary"
                )}>
                  {selectedCategory === cat.slug && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.slug}
                  onChange={() => setSelectedCategory(cat.slug)}
                  className="sr-only"
                />
                <span className="text-sm text-slate group-hover:text-soft-black transition-colors">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-left font-semibold text-soft-black mb-4"
        >
          <span className="text-sm uppercase tracking-widest text-copper">Merk</span>
          <svg 
            className={cn("w-4 h-4 text-muted transition-transform", expandedSections.brand && "rotate-180")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.brand && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                selectedBrand === '' ? "bg-primary border-primary" : "border-sand group-hover:border-primary"
              )}>
                {selectedBrand === '' && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === ''}
                onChange={() => setSelectedBrand('')}
                className="sr-only"
              />
              <span className="text-sm text-slate group-hover:text-soft-black transition-colors">Alle merken</span>
            </label>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  selectedBrand === brand ? "bg-primary border-primary" : "border-sand group-hover:border-primary"
                )}>
                  {selectedBrand === brand && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => setSelectedBrand(brand)}
                  className="sr-only"
                />
                <span className="text-sm text-slate group-hover:text-soft-black transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-semibold text-soft-black mb-4"
        >
          <span className="text-sm uppercase tracking-widest text-copper">Prijs</span>
          <svg 
            className={cn("w-4 h-4 text-muted transition-transform", expandedSections.price && "rotate-180")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.price && (
          <div className="flex gap-3">
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
          className="flex items-center justify-between w-full text-left font-semibold text-soft-black mb-4"
        >
          <span className="text-sm uppercase tracking-widest text-copper">Conditie</span>
          <svg 
            className={cn("w-4 h-4 text-muted transition-transform", expandedSections.condition && "rotate-180")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.condition && (
          <div className="space-y-3">
            {conditionOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  selectedConditions.includes(option.value) ? "bg-primary border-primary" : "border-sand group-hover:border-primary"
                )}>
                  {selectedConditions.includes(option.value) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(option.value)}
                  onChange={() => toggleCondition(option.value)}
                  className="sr-only"
                />
                <span className="text-sm text-slate group-hover:text-soft-black transition-colors">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-6 border-t border-sand">
        <Button onClick={updateFilters} fullWidth>
          Filters toepassen
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="ghost" fullWidth>
            Filters wissen
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="outline"
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-copper to-gold text-white rounded-full">
              Actief
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-soft-black/40 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-full max-w-sm bg-cream z-50 overflow-y-auto lg:hidden animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-sand">
              <h2 className="text-xl font-display font-semibold text-soft-black">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-xl text-muted hover:text-soft-black hover:bg-sand transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
          </div>
        </>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-3xl border border-sand p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <h3 className="text-lg font-display font-semibold text-soft-black mb-6">Filters</h3>
        <FilterContent />
      </div>
    </>
  );
}
