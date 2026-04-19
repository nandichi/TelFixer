'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: { direction: 'up' | 'down' | 'flat'; value: string; label?: string };
  icon?: LucideIcon;
  spark?: number[];
  loading?: boolean;
}

export function KpiCard({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  spark,
  loading,
}: KpiCardProps) {
  const trendDir = trend?.direction;
  const TrendIcon =
    trendDir === 'up' ? TrendingUp : trendDir === 'down' ? TrendingDown : Minus;
  const trendColor =
    trendDir === 'up'
      ? 'text-[var(--a-success)]'
      : trendDir === 'down'
        ? 'text-[var(--a-danger)]'
        : 'text-[var(--a-text-3)]';

  return (
    <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] p-4 flex flex-col gap-3 hover:border-[var(--a-border-strong)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold text-[var(--a-text-3)] uppercase tracking-[0.06em]">
          {label}
        </span>
        {Icon && (
          <span className="w-7 h-7 rounded-md bg-[var(--a-surface-2)] flex items-center justify-center text-[var(--a-text-3)] shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div>
        {loading ? (
          <div className="h-7 w-24 rounded-md bg-[var(--a-surface-2)] animate-pulse" />
        ) : (
          <div className="text-[26px] font-semibold text-[var(--a-text)] tracking-tight leading-none admin-num">
            {value}
          </div>
        )}
        {hint && !loading && (
          <p className="text-[12px] text-[var(--a-text-3)] mt-1.5">{hint}</p>
        )}
      </div>

      {(trend || spark) && (
        <div className="flex items-end justify-between gap-3 pt-1">
          {trend ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[12px] font-medium admin-num',
                trendColor
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {trend.value}
              {trend.label && (
                <span className="text-[var(--a-text-4)] font-normal ml-1">
                  {trend.label}
                </span>
              )}
            </span>
          ) : (
            <span />
          )}
          {spark && spark.length > 0 && <Sparkline values={spark} />}
        </div>
      )}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const step = w / Math.max(values.length - 1, 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(' ');

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible shrink-0"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke="var(--a-accent)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
