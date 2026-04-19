'use client';

import { Search, X } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FilterChip {
  value: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  };
  filters?: {
    value: string;
    onChange: (v: string) => void;
    options: FilterChip[];
  };
  trailing?: ReactNode;
  className?: string;
}

export function FilterBar({
  search,
  filters,
  trailing,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row lg:items-center gap-3',
        className
      )}
    >
      {search && (
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--a-text-4)] pointer-events-none" />
          <input
            type="search"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder ?? 'Zoeken...'}
            className="w-full h-8 pl-8 pr-7 text-[13px] rounded-md bg-[var(--a-surface)] border border-[var(--a-border)] text-[var(--a-text)] placeholder:text-[var(--a-text-4)] focus:border-[var(--a-accent)] focus:outline-none transition-colors"
          />
          {search.value && (
            <button
              type="button"
              onClick={() => search.onChange('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--a-text-4)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-2)]"
              aria-label="Wissen"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {filters && (
        <div className="flex items-center gap-1 overflow-x-auto -mx-1 px-1 pb-1 lg:pb-0 scrollbar-none">
          {filters.options.map((opt) => {
            const active = filters.value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => filters.onChange(opt.value)}
                className={cn(
                  'h-7 px-2.5 rounded-md text-[12px] font-medium whitespace-nowrap inline-flex items-center gap-1.5 transition-colors border',
                  active
                    ? 'bg-[var(--a-accent)] text-white border-[var(--a-accent)]'
                    : 'bg-[var(--a-surface)] text-[var(--a-text-2)] border-[var(--a-border)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]'
                )}
              >
                {opt.label}
                {typeof opt.count === 'number' && (
                  <span
                    className={cn(
                      'admin-num text-[11px] px-1 rounded',
                      active
                        ? 'bg-white/15'
                        : 'bg-[var(--a-surface-2)] text-[var(--a-text-3)]'
                    )}
                  >
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {trailing && <div className="flex-1 flex items-center justify-end gap-2">{trailing}</div>}
    </div>
  );
}
