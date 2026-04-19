'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  back?: { href: string; label?: string };
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  back,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 pb-5 mb-5 border-b border-[var(--a-border)]',
        className
      )}
    >
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--a-text-3)] hover:text-[var(--a-text)] transition-colors w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {back.label ?? 'Terug'}
        </Link>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[20px] font-semibold text-[var(--a-text)] tracking-tight leading-tight">
              {title}
            </h1>
            {meta}
          </div>
          {description && (
            <p className="text-[13px] text-[var(--a-text-3)] mt-1">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
