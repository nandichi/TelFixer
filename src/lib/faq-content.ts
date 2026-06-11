import type { WarrantySettings } from '@/lib/supabase/settings';

export interface FaqRow {
  category: string;
  question: string;
  answer: string;
  sort_order?: number;
}

export interface FaqGroup {
  name: string;
  items: { id: string; question: string; answer: string }[];
}

function formatTerm(months: number): string {
  if (months <= 0) return '-';
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 jaar' : `${years} jaar`;
  }
  return months === 1 ? '1 maand' : `${months} maanden`;
}

function replaceToken(text: string, token: string, value: string): string {
  return text.split(token).join(value);
}

/**
 * Replace warranty placeholders (e.g. {garantie_telefoons}) with the actual
 * configured warranty terms so FAQ answers stay in sync with the settings.
 */
export function applyFaqPlaceholders(text: string, w: WarrantySettings): string {
  let out = text;
  out = replaceToken(out, '{garantie_telefoons}', formatTerm(w.phones_months));
  out = replaceToken(out, '{garantie_laptops}', formatTerm(w.laptops_months));
  out = replaceToken(out, '{garantie_tablets}', formatTerm(w.tablets_months));
  out = replaceToken(out, '{garantie_reparaties}', formatTerm(w.repairs_months));
  out = replaceToken(
    out,
    '{garantie_accessoires_nieuw}',
    formatTerm(w.accessories_new_months)
  );
  out = replaceToken(
    out,
    '{garantie_accessoires_gebruikt}',
    formatTerm(w.accessories_used_months)
  );
  out = replaceToken(
    out,
    '{garantie_nieuwe_apparaten}',
    formatTerm(w.new_devices_months)
  );
  out = replaceToken(out, '{batterij_min}', String(w.battery_min_percentage));
  out = replaceToken(out, '{laptop_cycli}', String(w.laptop_max_cycles));
  return out;
}

/**
 * Group FAQ rows (already ordered by sort_order) by category, preserving the
 * order in which categories first appear. Placeholders are resolved here.
 */
export function buildFaqGroups(
  rows: FaqRow[],
  warranty: WarrantySettings
): FaqGroup[] {
  const groups: FaqGroup[] = [];
  let idx = 0;
  for (const row of rows) {
    let group = groups.find((g) => g.name === row.category);
    if (!group) {
      group = { name: row.category, items: [] };
      groups.push(group);
    }
    group.items.push({
      id: `${row.category}-${idx++}`,
      question: row.question,
      answer: applyFaqPlaceholders(row.answer, warranty),
    });
  }
  return groups;
}

/**
 * Fallback content used only when the faq_items table is empty or unreachable,
 * so the public FAQ page always shows useful information.
 */
export const DEFAULT_FAQ_ROWS: FaqRow[] = [
  {
    category: 'Refurbished producten',
    question: 'Wat betekent refurbished?',
    answer:
      'Refurbished betekent dat een product is gecontroleerd, gerepareerd indien nodig, en grondig schoongemaakt. Alle refurbished producten bij TelFixer worden getest en komen met garantie.',
  },
  {
    category: 'Refurbished producten',
    question: 'Wat is het verschil tussen de conditie grades?',
    answer:
      'Als nieuw: nauwelijks of geen zichtbare gebruikssporen.\nZeer goed: minimale gebruikssporen, nauwelijks zichtbaar.\nGoed: lichte gebruikssporen zichtbaar.\nSterk gebruikt: duidelijke gebruikssporen, maar volledig functioneel.',
  },
  {
    category: 'Refurbished producten',
    question: 'Hoeveel garantie krijg ik?',
    answer:
      'Refurbished telefoons: {garantie_telefoons} garantie.\nRefurbished laptops: {garantie_laptops} garantie.\nRefurbished tablets: {garantie_tablets} garantie.\nReparaties: {garantie_reparaties} garantie.\nAccessoires (nieuw): {garantie_accessoires_nieuw} garantie.\nAccessoires (gebruikt): {garantie_accessoires_gebruikt} garantie.\nNieuwe apparaten: {garantie_nieuwe_apparaten} garantie.',
  },
  {
    category: 'Refurbished producten',
    question: 'Is de batterij ook getest?',
    answer:
      'Ja, bij telefoons en laptops controleren we de batterijconditie. Telefoons hebben minimaal {batterij_min}% batterijcapaciteit en laptops minder dan {laptop_cycli} laadcycli (tenzij anders vermeld).',
  },
  {
    category: 'Bestellen & Betalen',
    question: 'Welke betaalmethodes accepteren jullie?',
    answer:
      'iDEAL\nCreditcard (Visa, Mastercard, American Express)\nKlarna (achteraf betalen of gespreid)\nBankafschrift (handmatige overboeking)',
  },
  {
    category: 'Bestellen & Betalen',
    question: 'Hoe lang duurt de levering?',
    answer:
      'Je bestelling wordt zo snel mogelijk verzonden. Je ontvangt een track & trace code zodra je bestelling is verzonden.',
  },
  {
    category: 'Bestellen & Betalen',
    question: 'Zijn er verzendkosten?',
    answer:
      'Verzending kost EUR 6,95. Bij bestellingen vanaf EUR 50 is verzending gratis.',
  },
  {
    category: 'Bestellen & Betalen',
    question: 'Kan ik mijn bestelling annuleren?',
    answer:
      'Ja, je kunt je bestelling annuleren zolang deze nog niet is verzonden. Neem contact op met onze klantenservice.',
  },
  {
    category: 'Retourneren',
    question: 'Kan ik mijn aankoop retourneren?',
    answer:
      'Ja, je hebt 14 dagen bedenktijd. Het product moet in originele staat zijn en onbeschadigd. De verzendkosten voor het retourneren zijn voor rekening van de klant. Neem contact op voor de retourgegevens.',
  },
  {
    category: 'Retourneren',
    question: 'Hoe werkt het retourproces?',
    answer:
      'Neem contact op met onze klantenservice. Je ontvangt de retourgegevens per e-mail. De verzendkosten voor het terugsturen zijn voor rekening van de klant. Na ontvangst en controle wordt het aankoopbedrag binnen 5 werkdagen teruggestort.',
  },
  {
    category: 'Retourneren',
    question: 'Wat als mijn product defect is?',
    answer:
      'Bij defecten binnen de garantieperiode repareren of vervangen wij het product gratis. Neem contact op voor een oplossing.',
  },
  {
    category: 'Inleveren & Verkopen',
    question: 'Hoe werkt apparaat inleveren?',
    answer:
      'Vul het inleverformulier in met details over je apparaat. Binnen 2 werkdagen ontvang je een prijsaanbod per e-mail en WhatsApp. Bij akkoord ontvang je gratis verzendlabels.',
  },
  {
    category: 'Inleveren & Verkopen',
    question: 'Welke apparaten kunnen jullie inkopen?',
    answer:
      'We kopen telefoons, laptops en tablets in van populaire merken zoals Apple, Samsung, Google, Lenovo en meer.',
  },
  {
    category: 'Inleveren & Verkopen',
    question: 'Hoe wordt de prijs bepaald?',
    answer:
      'De prijs hangt af van het model, de conditie en de huidige marktwaarde. Je krijgt altijd een eerlijk en transparant aanbod.',
  },
  {
    category: 'Inleveren & Verkopen',
    question: 'Hoe word ik uitbetaald?',
    answer:
      'Na ontvangst en goedkeuring van je apparaat wordt het bedrag binnen 3 werkdagen overgemaakt naar je bankrekening.',
  },
];
