import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'condition';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  condition: 'bg-[#094543] text-white',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
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
  als_nieuw: 'bg-emerald-500 text-white',
  zeer_goed: 'bg-emerald-400 text-white',
  goed: 'bg-amber-500 text-white',
  sterk_gebruikt: 'bg-orange-500 text-white',
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
        'inline-flex items-center font-medium rounded-full',
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
  in_behandeling: 'bg-amber-100 text-amber-800',
  betaald: 'bg-emerald-100 text-emerald-800',
  verzonden: 'bg-blue-100 text-blue-800',
  afgeleverd: 'bg-emerald-100 text-emerald-800',
  geannuleerd: 'bg-red-100 text-red-800',
  // Submission statuses
  ontvangen: 'bg-blue-100 text-blue-800',
  evaluatie: 'bg-amber-100 text-amber-800',
  aanbieding_gemaakt: 'bg-purple-100 text-purple-800',
  aanbieding_geaccepteerd: 'bg-emerald-100 text-emerald-800',
  aanbieding_afgewezen: 'bg-red-100 text-red-800',
  afgehandeld: 'bg-gray-100 text-gray-800',
  // Payment statuses
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
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
        statusStyles[status] || 'bg-gray-100 text-gray-800',
        sizeStyles[size],
        className
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}
