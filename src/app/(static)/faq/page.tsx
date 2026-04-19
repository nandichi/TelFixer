import { Metadata } from 'next';
import { getWarrantySettings } from '@/lib/supabase/settings';
import { FaqClient } from './faq-client';

export const metadata: Metadata = {
  title: 'Veelgestelde vragen',
  description:
    'Antwoorden op veelgestelde vragen over refurbished producten, garantie, retourneren en inleveren bij TelFixer.',
};

function formatTerm(months: number): string {
  if (months <= 0) return '-';
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 jaar' : `${years} jaar`;
  }
  return months === 1 ? '1 maand' : `${months} maanden`;
}

export default async function FAQPage() {
  const warranty = await getWarrantySettings();

  return (
    <FaqClient
      warrantyTerms={{
        phones: formatTerm(warranty.phones_months),
        laptops: formatTerm(warranty.laptops_months),
        tablets: formatTerm(warranty.tablets_months),
        accessories_new: formatTerm(warranty.accessories_new_months),
        accessories_used: formatTerm(warranty.accessories_used_months),
        new_devices: formatTerm(warranty.new_devices_months),
        repairs: formatTerm(warranty.repairs_months),
      }}
      batteryMin={warranty.battery_min_percentage}
      laptopCycles={warranty.laptop_max_cycles}
    />
  );
}
