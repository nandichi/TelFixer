'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const styles = {
  success: 'bg-white border-l-4 border-l-[#0D9488]',
  error: 'bg-white border-l-4 border-l-[#DC2626]',
  warning: 'bg-white border-l-4 border-l-[#D97706]',
  info: 'bg-white border-l-4 border-l-[#0284C7]',
};

const iconStyles = {
  success: 'text-[#0D9488] bg-[#0D9488]/10',
  error: 'text-[#DC2626] bg-[#DC2626]/10',
  warning: 'text-[#D97706] bg-[#D97706]/10',
  info: 'text-[#0284C7] bg-[#0284C7]/10',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts, removeToast } = context;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-4 p-4 rounded-xl border border-sand min-w-[320px] max-w-[420px]',
            'animate-slide-in-right',
            styles[toast.type]
          )}
          style={{ boxShadow: 'var(--shadow-lg)' }}
          role="alert"
        >
          <div className={cn('p-2 rounded-lg shrink-0', iconStyles[toast.type])}>
            {icons[toast.type]}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="font-semibold text-soft-black">{toast.title}</p>
            {toast.message && (
              <p className="text-sm text-muted mt-1">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1.5 rounded-lg text-muted hover:text-soft-black hover:bg-sand transition-all duration-200 shrink-0"
            aria-label="Sluiten"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: context.addToast,
    success: (title: string, message?: string) =>
      context.addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      context.addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      context.addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      context.addToast({ type: 'info', title, message }),
  };
}
