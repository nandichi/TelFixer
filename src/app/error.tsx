'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center py-16">
      <Container>
        <div className="max-w-md mx-auto text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-[#2C3E48] mb-4">
            Er ging iets mis
          </h1>

          <p className="text-gray-600 mb-8">
            Sorry, er is een fout opgetreden. Probeer het opnieuw of ga terug naar de homepage.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Probeer opnieuw
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Naar homepage
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
