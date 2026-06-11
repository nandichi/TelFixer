import { Metadata } from 'next';
import { getWarrantySettings } from '@/lib/supabase/settings';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { buildFaqGroups, DEFAULT_FAQ_ROWS, type FaqRow } from '@/lib/faq-content';
import { FaqClient } from './faq-client';

export const metadata: Metadata = {
  title: 'Veelgestelde vragen',
  description:
    'Antwoorden op veelgestelde vragen over refurbished producten, garantie, retourneren en inleveren bij TelFixer.',
};

export default async function FAQPage() {
  const warranty = await getWarrantySettings();

  let rows: FaqRow[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('faq_items')
        .select('category, question, answer, sort_order')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (data && data.length > 0) rows = data as FaqRow[];
    } catch {
      // Val terug op de standaardinhoud bij een fout
    }
  }

  if (rows.length === 0) rows = DEFAULT_FAQ_ROWS;

  const categories = buildFaqGroups(rows, warranty);

  return <FaqClient categories={categories} />;
}
