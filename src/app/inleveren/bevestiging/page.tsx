import Link from 'next/link';
import { CheckCircle, Clock, Mail, Package } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

interface PageProps {
  searchParams: Promise<{
    ref?: string;
  }>;
}

export default async function SubmissionConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const referenceNumber = params.ref || 'UNKNOWN';

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
            Inlevering ontvangen!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We hebben je inlevering ontvangen en gaan deze zo snel mogelijk beoordelen.
          </p>

          {/* Reference Number */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-1">Referentienummer</p>
            <p className="text-2xl font-bold text-[#094543]">{referenceNumber}</p>
            <p className="text-sm text-gray-500 mt-2">
              Bewaar dit nummer om de status van je inlevering te volgen
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-[#2C3E48] mb-1">Ontvangen</h3>
              <p className="text-sm text-gray-500">Je aanvraag is ingediend</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-[#2C3E48] mb-1">Beoordeling</h3>
              <p className="text-sm text-gray-500">Binnen 2 werkdagen</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-[#2C3E48] mb-1">Aanbod</h3>
              <p className="text-sm text-gray-500">Per e-mail ontvangen</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-[#094543]/5 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-[#2C3E48] mb-3">Wat kun je verwachten?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#094543] rounded-full mt-2" />
                Je ontvangt binnen 2 werkdagen een e-mail met een prijsaanbod
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#094543] rounded-full mt-2" />
                Bij akkoord ontvang je gratis verzendlabels
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#094543] rounded-full mt-2" />
                Na ontvangst en controle wordt het bedrag uitbetaald
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/tracking?ref=${referenceNumber}`}>
              <Button variant="outline" size="lg">
                <Package className="h-5 w-5 mr-2" />
                Volg je inlevering
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg">Terug naar home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
