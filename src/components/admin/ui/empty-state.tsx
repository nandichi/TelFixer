'use client';

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const compact = variant === 'compact';
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8 px-4 gap-2' : 'py-16 px-6 gap-3',
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'rounded-full bg-[var(--a-surface-2)] flex items-center justify-center text-[var(--a-text-4)]',
            compact ? 'w-9 h-9' : 'w-12 h-12'
          )}
        >
          <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
        </div>
      )}
      <h3
        className={cn(
          'font-semibold text-[var(--a-text)]',
          compact ? 'text-[13px]' : 'text-[15px]'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'text-[var(--a-text-3)] max-w-sm',
            compact ? 'text-[12px]' : 'text-[13px]'
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
