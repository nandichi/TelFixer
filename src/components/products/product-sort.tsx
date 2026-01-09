'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

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
    params.delete('pagina');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted hidden sm:inline">Sorteer op:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="appearance-none text-sm bg-transparent border-0 text-soft-black font-medium pr-8 py-2 focus:outline-none focus:ring-0 cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
