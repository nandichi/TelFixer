'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  padding?: 'default' | 'none';
}

export function Section({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  padding = 'default',
}: SectionProps) {
  return (
    <section
      className={cn(
        'bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] overflow-hidden',
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--a-border)]">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[14px] font-semibold text-[var(--a-text)] leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[12px] text-[var(--a-text-3)] mt-0.5">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div
        className={cn(
          padding === 'default' ? 'p-4' : '',
          bodyClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
