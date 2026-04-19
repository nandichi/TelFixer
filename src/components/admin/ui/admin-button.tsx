'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<string, string> = {
  primary:
    'bg-[var(--a-accent)] text-white border-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] hover:border-[var(--a-accent-hover)]',
  secondary:
    'bg-[var(--a-surface)] text-[var(--a-text)] border-[var(--a-border)] hover:bg-[var(--a-surface-2)] hover:border-[var(--a-border-strong)]',
  ghost:
    'bg-transparent text-[var(--a-text-2)] border-transparent hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]',
  danger:
    'bg-[var(--a-danger)] text-white border-[var(--a-danger)] hover:bg-[#b91c1c] hover:border-[#b91c1c]',
  success:
    'bg-[var(--a-success)] text-white border-[var(--a-success)] hover:bg-[#15803d] hover:border-[#15803d]',
};

const sizes: Record<string, string> = {
  xs: 'h-7 px-2 text-[12px] gap-1',
  sm: 'h-8 px-2.5 text-[12.5px] gap-1.5',
  md: 'h-9 px-3.5 text-[13px] gap-2',
};

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  function AdminButton(
    {
      className,
      variant = 'primary',
      size = 'sm',
      loading,
      fullWidth,
      disabled,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...rest}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);
