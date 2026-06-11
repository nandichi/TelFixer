'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { AdminInput, AdminTextarea } from '@/components/admin/ui/admin-input';
import { AdminButton } from '@/components/admin/ui/admin-button';

interface CustomerOption {
  email: string;
  name: string;
}

export default function AdminMailPage() {
  const { success, error: showError } = useToast();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [sending, setSending] = useState(false);

  const [to, setTo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [subject, setSubject] = useState('');
  const [heading, setHeading] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('users')
        .select('email, first_name, last_name')
        .order('created_at', { ascending: false });
      if (data) {
        setCustomers(
          data.map((u) => ({
            email: u.email as string,
            name: [u.first_name, u.last_name].filter(Boolean).join(' '),
          }))
        );
      }
    };
    fetchCustomers();
  }, []);

  // Prefill from query params (?to=...&name=...) when linked from another page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qTo = params.get('to');
    const qName = params.get('name');
    if (qTo) setTo(qTo);
    if (qName) setCustomerName(qName);
  }, []);

  const onEmailChange = (value: string) => {
    setTo(value);
    const match = customers.find(
      (c) => c.email.toLowerCase() === value.trim().toLowerCase()
    );
    if (match && match.name && !customerName) setCustomerName(match.name);
  };

  const canSend =
    to.trim() !== '' &&
    subject.trim() !== '' &&
    heading.trim() !== '' &&
    bodyText.trim() !== '';

  const handleSend = async () => {
    if (!canSend) {
      showError('Vul ontvanger, onderwerp, titel en bericht in');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to.trim(),
          customerName: customerName.trim() || undefined,
          subject: subject.trim(),
          heading: heading.trim(),
          bodyText: bodyText.trim(),
          ctaUrl: ctaUrl.trim() || undefined,
          ctaLabel: ctaLabel.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(json.error || 'Versturen mislukt');
        return;
      }
      success(`E-mail verzonden naar ${to.trim()}`);
      setSubject('');
      setHeading('');
      setBodyText('');
      setCtaUrl('');
      setCtaLabel('');
    } catch {
      showError('Versturen mislukt');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Klantmail"
        description="Stuur een professioneel opgemaakte e-mail naar een klant"
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-4 items-start">
        <Section
          title="Bericht opstellen"
          action={<Mail className="h-4 w-4 text-[var(--a-text-3)]" />}
        >
          <div className="space-y-3.5">
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput
                label="Aan (e-mailadres)"
                type="email"
                placeholder="klant@voorbeeld.nl"
                list="customer-emails"
                value={to}
                onChange={(e) => onEmailChange(e.target.value)}
                required
              />
              <datalist id="customer-emails">
                {customers.map((c) => (
                  <option key={c.email} value={c.email}>
                    {c.name}
                  </option>
                ))}
              </datalist>
              <AdminInput
                label="Naam klant (optioneel)"
                placeholder="bijv. Jan Jansen"
                hint="Gebruikt voor de aanhef 'Beste ...'"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <AdminInput
              label="Onderwerp"
              placeholder="bijv. Update over je bestelling"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <AdminInput
              label="Titel in e-mail"
              hint="De grote kop bovenaan de e-mail"
              placeholder="bijv. Je bestelling is verzonden"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
            />
            <AdminTextarea
              label="Bericht"
              hint="Laat een lege regel tussen alinea's voor witruimte"
              rows={9}
              placeholder="Schrijf hier je bericht..."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              required
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput
                label="Knop-link (optioneel)"
                placeholder="https://telfixer.nl/account"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
              />
              <AdminInput
                label="Knop-tekst (optioneel)"
                placeholder="bijv. Bekijk je bestelling"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-[var(--a-border)]">
              <AdminButton onClick={handleSend} loading={sending} disabled={!canSend}>
                <Send className="h-3.5 w-3.5" />
                Versturen
              </AdminButton>
            </div>
          </div>
        </Section>

        <Section title="Tips" padding="default">
          <ul className="space-y-2.5 text-[12.5px] text-[var(--a-text-2)] leading-relaxed">
            <li className="flex gap-2">
              <Info className="h-3.5 w-3.5 text-[var(--a-text-3)] shrink-0 mt-0.5" />
              De e-mail krijgt automatisch de TelFixer-huisstijl met logo en
              footer.
            </li>
            <li className="flex gap-2">
              <Info className="h-3.5 w-3.5 text-[var(--a-text-3)] shrink-0 mt-0.5" />
              Antwoorden van de klant komen binnen op info@telfixer.nl.
            </li>
            <li className="flex gap-2">
              <Info className="h-3.5 w-3.5 text-[var(--a-text-3)] shrink-0 mt-0.5" />
              Begin te typen in het &lsquo;Aan&rsquo;-veld om een bestaande klant
              te kiezen.
            </li>
            <li className="flex gap-2">
              <Info className="h-3.5 w-3.5 text-[var(--a-text-3)] shrink-0 mt-0.5" />
              De knop verschijnt alleen als je zowel een link als knop-tekst
              invult.
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
