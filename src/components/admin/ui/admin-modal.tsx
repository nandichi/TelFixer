'use client';

import { Fragment, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
}: AdminModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Fragment>
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'var(--a-overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={cn(
              'relative w-full bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[12px] shadow-[var(--a-shadow-lg)]',
              sizeStyles[size]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--a-border)]">
                <div className="min-w-0">
                  {title && (
                    <h3 className="text-[15px] font-semibold text-[var(--a-text)] leading-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="mt-0.5 text-[12.5px] text-[var(--a-text-3)]">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 -mr-1 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-2)] transition-colors shrink-0"
                  aria-label="Sluiten"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="px-5 py-4">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[var(--a-border)] bg-[var(--a-surface-2)]/40 rounded-b-[12px]">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
