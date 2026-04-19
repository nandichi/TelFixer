'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface BarChartProps {
  data: { label: string; value: number; date?: string }[];
  height?: number;
  formatValue?: (n: number) => string;
  className?: string;
  emptyText?: string;
}

export function BarChart({
  data,
  height = 180,
  formatValue,
  className,
  emptyText = 'Geen data',
}: BarChartProps) {
  const max = useMemo(() => Math.max(...data.map((d) => d.value), 0), [data]);
  const total = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data]
  );

  if (!data.length || total === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-[12px] text-[var(--a-text-4)] border border-dashed border-[var(--a-border)] rounded-md',
          className
        )}
        style={{ height }}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        className="flex items-end gap-[3px] w-full"
        style={{ height }}
      >
        {data.map((d, i) => {
          const pct = max ? (d.value / max) * 100 : 0;
          return (
            <div
              key={`${d.label}-${i}`}
              className="flex-1 min-w-0 flex flex-col items-center justify-end h-full group relative"
            >
              <div
                className="w-full bg-[var(--a-accent-soft)] hover:bg-[var(--a-accent-soft-2)] rounded-sm transition-colors min-h-[2px]"
                style={{ height: `${Math.max(pct, 1)}%` }}
              >
                <div
                  className="w-full h-full bg-[var(--a-accent)] rounded-sm origin-bottom transition-transform group-hover:scale-y-100 scale-y-0"
                  style={{ transformOrigin: 'bottom' }}
                />
              </div>

              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--a-text)] text-white text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none admin-num">
                {formatValue ? formatValue(d.value) : d.value}
                {d.date && (
                  <div className="text-[10px] text-white/70 font-normal">
                    {d.date}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-[var(--a-text-4)] uppercase tracking-wider">
        <span>{data[0]?.label}</span>
        {data.length > 4 && (
          <span>{data[Math.floor(data.length / 2)]?.label}</span>
        )}
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
