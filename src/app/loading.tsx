import { Container } from '@/components/layout/container';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-24 bg-cream">
      <Container>
        <div className="text-center">
          {/* Premium Spinner */}
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-sand animate-spin" style={{ borderTopColor: 'var(--color-primary)' }} />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent animate-spin" style={{ borderBottomColor: 'var(--color-copper)', animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-muted font-medium">Laden...</p>
        </div>
      </Container>
    </div>
  );
}
