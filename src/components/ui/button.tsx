import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'copper';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium',
      'rounded-xl transition-all duration-200 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'active:scale-[0.98]'
    );

    const variants = {
      primary: cn(
        'bg-primary text-white',
        'hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-primary'
      ),
      secondary: cn(
        'bg-soft-black text-white',
        'hover:bg-charcoal hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-soft-black'
      ),
      outline: cn(
        'border-2 border-primary text-primary bg-transparent',
        'hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5',
        'focus-visible:ring-primary'
      ),
      ghost: cn(
        'text-soft-black bg-transparent',
        'hover:bg-sand/50',
        'focus-visible:ring-muted'
      ),
      danger: cn(
        'bg-[#DC2626] text-white',
        'hover:bg-[#B91C1C] hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-[#DC2626]'
      ),
      copper: cn(
        'bg-gradient-to-r from-copper to-gold text-white',
        'hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-copper'
      ),
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-2.5',
      xl: 'px-10 py-5 text-xl gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Laden...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
