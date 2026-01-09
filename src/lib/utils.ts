import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TF-${timestamp}-${random}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp}${random}`;
}

export function getConditionLabel(grade: string): string {
  const labels: Record<string, string> = {
    als_nieuw: 'Als nieuw',
    zeer_goed: 'Zeer goed',
    goed: 'Goed',
    sterk_gebruikt: 'Sterk gebruikt',
  };
  return labels[grade] || grade;
}

export function getConditionColor(grade: string): string {
  const colors: Record<string, string> = {
    als_nieuw: 'bg-emerald-500',
    zeer_goed: 'bg-emerald-400',
    goed: 'bg-amber-500',
    sterk_gebruikt: 'bg-orange-500',
  };
  return colors[grade] || 'bg-gray-500';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Order statuses
    in_behandeling: 'In behandeling',
    betaald: 'Betaald',
    verzonden: 'Verzonden',
    afgeleverd: 'Afgeleverd',
    geannuleerd: 'Geannuleerd',
    // Submission statuses
    ontvangen: 'Ontvangen',
    evaluatie: 'In evaluatie',
    aanbieding_gemaakt: 'Aanbieding gemaakt',
    aanbieding_geaccepteerd: 'Aanbieding geaccepteerd',
    aanbieding_afgewezen: 'Aanbieding afgewezen',
    afgehandeld: 'Afgehandeld',
    // Payment statuses
    pending: 'In afwachting',
    paid: 'Betaald',
    failed: 'Mislukt',
    refunded: 'Terugbetaald',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Success states
    betaald: 'bg-emerald-100 text-emerald-800',
    afgeleverd: 'bg-emerald-100 text-emerald-800',
    aanbieding_geaccepteerd: 'bg-emerald-100 text-emerald-800',
    afgehandeld: 'bg-emerald-100 text-emerald-800',
    paid: 'bg-emerald-100 text-emerald-800',
    // Warning states
    in_behandeling: 'bg-amber-100 text-amber-800',
    evaluatie: 'bg-amber-100 text-amber-800',
    aanbieding_gemaakt: 'bg-blue-100 text-blue-800',
    pending: 'bg-amber-100 text-amber-800',
    // Info states
    verzonden: 'bg-blue-100 text-blue-800',
    ontvangen: 'bg-blue-100 text-blue-800',
    // Error states
    geannuleerd: 'bg-red-100 text-red-800',
    aanbieding_afgewezen: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function calculateSavings(originalPrice: number | null, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+31|0)[1-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validatePostalCode(postalCode: string): boolean {
  const postalRegex = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/;
  return postalRegex.test(postalCode);
}
