import { Container } from '@/components/layout/container';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <Container>
        <div className="text-center">
          {/* Spinner */}
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[#094543] rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Laden...</p>
        </div>
      </Container>
    </div>
  );
}
