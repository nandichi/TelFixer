'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  function AdminInput(
    { className, label, hint, error, prefix, suffix, id, type = 'text', ...rest },
    ref
  ) {
    const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-medium text-[var(--a-text-2)] mb-1.5"
          >
            {label}
            {rest.required && (
              <span className="text-[var(--a-danger)] ml-0.5">*</span>
            )}
          </label>
        )}
        <div
          className={cn(
            'flex items-center bg-[var(--a-surface)] border rounded-md transition-colors',
            error
              ? 'border-[var(--a-danger)]'
              : 'border-[var(--a-border)] focus-within:border-[var(--a-accent)] hover:border-[var(--a-border-strong)]'
          )}
        >
          {prefix && (
            <span className="pl-2.5 text-[12.5px] text-[var(--a-text-3)] select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'flex-1 bg-transparent px-2.5 h-8 text-[13px] text-[var(--a-text)] placeholder:text-[var(--a-text-4)] outline-none admin-num',
              prefix && 'pl-1.5',
              suffix && 'pr-1.5',
              className
            )}
            {...rest}
          />
          {suffix && (
            <span className="pr-2.5 text-[12.5px] text-[var(--a-text-3)] select-none">
              {suffix}
            </span>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-[11.5px] text-[var(--a-danger)]">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-[11.5px] text-[var(--a-text-3)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

interface AdminTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  function AdminTextarea(
    { className, label, hint, error, id, rows = 3, ...rest },
    ref
  ) {
    const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-medium text-[var(--a-text-2)] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full bg-[var(--a-surface)] border rounded-md px-2.5 py-2 text-[13px] text-[var(--a-text)] placeholder:text-[var(--a-text-4)] outline-none transition-colors resize-y',
            error
              ? 'border-[var(--a-danger)]'
              : 'border-[var(--a-border)] focus:border-[var(--a-accent)] hover:border-[var(--a-border-strong)]',
            className
          )}
          {...rest}
        />
        {error ? (
          <p className="mt-1 text-[11.5px] text-[var(--a-danger)]">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-[11.5px] text-[var(--a-text-3)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);
