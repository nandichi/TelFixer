import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-sand text-soft-black',
  success: 'bg-[#0D9488]/10 text-[#0D9488]',
  warning: 'bg-[#D97706]/10 text-[#D97706]',
  error: 'bg-[#DC2626]/10 text-[#DC2626]',
  info: 'bg-[#0284C7]/10 text-[#0284C7]',
  premium: 'bg-gradient-to-r from-copper to-gold text-white',
};

const sizeStyles = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Condition-specific badge component
export interface ConditionBadgeProps {
  grade: 'als_nieuw' | 'zeer_goed' | 'goed' | 'sterk_gebruikt';
  size?: 'sm' | 'md';
  className?: string;
}

const conditionStyles = {
  als_nieuw: 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white',
  zeer_goed: 'bg-[#14B8A6] text-white',
  goed: 'bg-[#D97706] text-white',
  sterk_gebruikt: 'bg-[#EA580C] text-white',
};

const conditionLabels = {
  als_nieuw: 'Als nieuw',
  zeer_goed: 'Zeer goed',
  goed: 'Goed',
  sterk_gebruikt: 'Sterk gebruikt',
};

export function ConditionBadge({
  grade,
  size = 'md',
  className,
}: ConditionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full shadow-sm',
        conditionStyles[grade],
        sizeStyles[size],
        className
      )}
    >
      {conditionLabels[grade]}
    </span>
  );
}

// Status badge component
export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Order statuses
  in_behandeling: 'bg-[#D97706]/10 text-[#D97706]',
  betaald: 'bg-[#0D9488]/10 text-[#0D9488]',
  verzonden: 'bg-[#0284C7]/10 text-[#0284C7]',
  afgeleverd: 'bg-[#0D9488]/10 text-[#0D9488]',
  geannuleerd: 'bg-[#DC2626]/10 text-[#DC2626]',
  // Submission statuses
  ontvangen: 'bg-[#0284C7]/10 text-[#0284C7]',
  evaluatie: 'bg-[#D97706]/10 text-[#D97706]',
  aanbieding_gemaakt: 'bg-copper/10 text-copper',
  aanbieding_geaccepteerd: 'bg-[#0D9488]/10 text-[#0D9488]',
  aanbieding_afgewezen: 'bg-[#DC2626]/10 text-[#DC2626]',
  afgehandeld: 'bg-sand text-slate',
  // Payment statuses
  pending: 'bg-[#D97706]/10 text-[#D97706]',
  paid: 'bg-[#0D9488]/10 text-[#0D9488]',
  failed: 'bg-[#DC2626]/10 text-[#DC2626]',
  refunded: 'bg-sand text-slate',
};

const statusLabels: Record<string, string> = {
  in_behandeling: 'In behandeling',
  betaald: 'Betaald',
  verzonden: 'Verzonden',
  afgeleverd: 'Afgeleverd',
  geannuleerd: 'Geannuleerd',
  ontvangen: 'Ontvangen',
  evaluatie: 'In evaluatie',
  aanbieding_gemaakt: 'Aanbieding gemaakt',
  aanbieding_geaccepteerd: 'Geaccepteerd',
  aanbieding_afgewezen: 'Afgewezen',
  afgehandeld: 'Afgehandeld',
  pending: 'In afwachting',
  paid: 'Betaald',
  failed: 'Mislukt',
  refunded: 'Terugbetaald',
};

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        statusStyles[status] || 'bg-sand text-slate',
        sizeStyles[size],
        className
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}
