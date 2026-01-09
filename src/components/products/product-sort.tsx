'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/select';

const sortOptions = [
  { value: 'newest', label: 'Nieuwste eerst' },
  { value: 'price_asc', label: 'Prijs: laag naar hoog' },
  { value: 'price_desc', label: 'Prijs: hoog naar laag' },
  { value: 'name', label: 'Naam: A-Z' },
];

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sorteer') || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sorteer', e.target.value);
    params.delete('pagina'); // Reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 hidden sm:inline">Sorteer op:</span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#094543]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
