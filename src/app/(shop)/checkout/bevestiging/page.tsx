import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

interface PageProps {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderNumber = params.order || 'UNKNOWN';

  return (
    <div className="py-16 lg:py-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#2C3E48] mb-4">
            Bedankt voor je bestelling!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Je bestelling is succesvol geplaatst. Je ontvangt binnen enkele minuten
            een bevestigingsmail.
          </p>

          {/* Order Number */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-1">Ordernummer</p>
            <p className="text-2xl font-bold text-[#094543]">{orderNumber}</p>
          </div>

          {/* Next Steps */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-left">
              <Mail className="h-8 w-8 text-[#094543] mb-3" />
              <h3 className="font-semibold text-[#2C3E48] mb-2">
                Check je inbox
              </h3>
              <p className="text-sm text-gray-600">
                Je ontvangt een bevestigingsmail met alle details van je bestelling.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-left">
              <Package className="h-8 w-8 text-[#094543] mb-3" />
              <h3 className="font-semibold text-[#2C3E48] mb-2">
                Verzending
              </h3>
              <p className="text-sm text-gray-600">
                Je bestelling wordt binnen 2-4 werkdagen verzonden met track & trace.
              </p>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-[#094543]/5 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-600 mb-1">Geschatte levering</p>
            <p className="text-lg font-semibold text-[#094543]">
              {(() => {
                const date = new Date();
                date.setDate(date.getDate() + 3);
                return new Intl.DateTimeFormat('nl-NL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }).format(date);
              })()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/producten">
              <Button variant="outline" size="lg">
                Verder winkelen
              </Button>
            </Link>
            <Link href="/account/bestellingen">
              <Button size="lg">
                Bekijk je bestellingen
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
