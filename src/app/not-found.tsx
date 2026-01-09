import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center py-16">
      <Container>
        <div className="max-w-md mx-auto text-center">
          {/* 404 Text */}
          <h1 className="text-9xl font-bold text-[#094543]/20">404</h1>
          
          <h2 className="text-2xl font-bold text-[#2C3E48] mt-4 mb-4">
            Pagina niet gevonden
          </h2>
          
          <p className="text-gray-600 mb-8">
            Sorry, de pagina die je zoekt bestaat niet of is verplaatst.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Naar homepage
              </Button>
            </Link>
            <Link href="/producten">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Bekijk producten
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
