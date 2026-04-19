'use client';

import { cn } from '@/lib/utils';

type Tone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent';

const toneStyles: Record<Tone, string> = {
  neutral:
    'bg-[var(--a-neutral-soft)] text-[var(--a-neutral-soft-text)] ring-[var(--a-border)]',
  info:
    'bg-[var(--a-info-soft)] text-[var(--a-info)] ring-[#bfdbfe]',
  success:
    'bg-[var(--a-success-soft)] text-[var(--a-success)] ring-[#bbf7d0]',
  warning:
    'bg-[var(--a-warning-soft)] text-[var(--a-warning)] ring-[#fde68a]',
  danger:
    'bg-[var(--a-danger-soft)] text-[var(--a-danger)] ring-[#fecaca]',
  accent:
    'bg-[var(--a-accent-soft)] text-[var(--a-accent)] ring-[var(--a-accent-soft-2)]',
};

const statusMap: Record<string, { tone: Tone; label: string }> = {
  // Order
  in_behandeling: { tone: 'warning', label: 'In behandeling' },
  betaald: { tone: 'success', label: 'Betaald' },
  verzonden: { tone: 'info', label: 'Verzonden' },
  afgeleverd: { tone: 'success', label: 'Afgeleverd' },
  geannuleerd: { tone: 'danger', label: 'Geannuleerd' },
  // Submission
  ontvangen: { tone: 'info', label: 'Ontvangen' },
  evaluatie: { tone: 'warning', label: 'In evaluatie' },
  aanbieding_gemaakt: { tone: 'accent', label: 'Aanbieding' },
  aanbieding_geaccepteerd: { tone: 'success', label: 'Geaccepteerd' },
  aanbieding_afgewezen: { tone: 'danger', label: 'Afgewezen' },
  afgehandeld: { tone: 'neutral', label: 'Afgehandeld' },
  // Repair
  klaar: { tone: 'success', label: 'Klaar' },
  afgewezen: { tone: 'danger', label: 'Afgewezen' },
  // Payment
  pending: { tone: 'warning', label: 'In afwachting' },
  paid: { tone: 'success', label: 'Betaald' },
  failed: { tone: 'danger', label: 'Mislukt' },
  refunded: { tone: 'neutral', label: 'Terugbetaald' },
};

interface StatusPillProps {
  status: string;
  tone?: Tone;
  label?: string;
  size?: 'xs' | 'sm';
  dot?: boolean;
  className?: string;
}

export function StatusPill({
  status,
  tone,
  label,
  size = 'sm',
  dot = true,
  className,
}: StatusPillProps) {
  const cfg = statusMap[status];
  const finalTone = tone ?? cfg?.tone ?? 'neutral';
  const finalLabel = label ?? cfg?.label ?? status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap',
        toneStyles[finalTone],
        size === 'xs'
          ? 'px-1.5 py-0.5 text-[10.5px]'
          : 'px-2 py-0.5 text-[11.5px]',
        className
      )}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current opacity-80"
          aria-hidden="true"
        />
      )}
      {finalLabel}
    </span>
  );
}

interface ConditionPillProps {
  grade: 'als_nieuw' | 'zeer_goed' | 'goed' | 'sterk_gebruikt';
  size?: 'xs' | 'sm';
}

const conditionMap: Record<string, { tone: Tone; label: string }> = {
  als_nieuw: { tone: 'success', label: 'Als nieuw' },
  zeer_goed: { tone: 'accent', label: 'Zeer goed' },
  goed: { tone: 'warning', label: 'Goed' },
  sterk_gebruikt: { tone: 'danger', label: 'Sterk gebruikt' },
};

export function ConditionPill({ grade, size = 'sm' }: ConditionPillProps) {
  const cfg = conditionMap[grade];
  return (
    <StatusPill
      status={grade}
      tone={cfg.tone}
      label={cfg.label}
      size={size}
      dot={false}
    />
  );
}
