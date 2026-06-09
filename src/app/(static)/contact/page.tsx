'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { Reveal } from '@/components/ui/reveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Selecteer een onderwerp'),
  message: z.string().min(10, 'Bericht moet minimaal 10 tekens zijn'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: 'vraag', label: 'Algemene vraag' },
  { value: 'bestelling', label: 'Vraag over mijn bestelling' },
  { value: 'inlevering', label: 'Vraag over mijn inlevering' },
  { value: 'garantie', label: 'Garantie of reparatie' },
  { value: 'zakelijk', label: 'Zakelijke samenwerking' },
  { value: 'anders', label: 'Anders' },
];

const contactDetails = [
  {
    icon: Mail,
    label: 'E-mail',
    value: 'info@telfixer.nl',
    href: 'mailto:info@telfixer.nl',
  },
  {
    icon: Phone,
    label: 'Telefoon',
    value: '+31 6 44642162',
    href: 'tel:+31644642162',
  },
  {
    icon: MapPin,
    label: 'Adres',
    value: 'Houtrakbos 34, 6718HD Ede',
    href: undefined,
  },
];

export default function ContactPage() {
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'Verzenden mislukt');
      }

      success('Bericht verzonden!', 'We nemen zo snel mogelijk contact met je op.');
      reset();
    } catch (err) {
      showError(
        'Verzenden mislukt',
        err instanceof Error ? err.message : 'Probeer het later opnieuw.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-copper/5 blur-3xl" />
        </div>
        <Container>
          <Reveal className="relative max-w-2xl mx-auto text-center">
            <span className="inline-block text-eyebrow mb-4">
              Contact
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-soft-black leading-[1.06] tracking-tight">
              We helpen je{' '}
              <em className="not-italic text-gradient-primary">graag</em>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-slate leading-relaxed">
              Heb je een vraag of wil je meer informatie? Neem gerust contact
              met ons op.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Inhoud */}
      <section className="pb-16 sm:pb-20 lg:pb-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Contactinfo */}
            <Reveal direction="left" className="lg:col-span-2 order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-3xl bg-soft-black p-6 sm:p-8">
                <div className="absolute inset-0" aria-hidden="true">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
                  <div className="absolute -top-24 -right-24 w-[280px] h-[280px] rounded-full bg-primary/25 blur-3xl" />
                </div>

                <div className="relative">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-6 sm:mb-8">
                    Contactgegevens
                  </h2>

                  <div className="space-y-5">
                    {contactDetails.map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <span className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/15 shrink-0">
                          <item.icon className="h-5 w-5 text-copper-light" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-on-dark-muted">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-white font-medium hover:text-copper-light transition-colors break-words"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-white font-medium">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* WhatsApp */}
                    <div className="pt-5 border-t border-white/10">
                      <a
                        href="https://wa.me/31644642162"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#25D366] text-white font-semibold transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.861 9.861 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                        </svg>
                        Chat via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reactietijd */}
              <div className="mt-4 flex items-start gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-sand">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 shrink-0">
                  <Clock className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-semibold text-soft-black mb-1">Reactietijd</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    We streven ernaar om binnen 24 uur te reageren op alle
                    berichten tijdens werkdagen.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Formulier */}
            <Reveal direction="right" delay={0.1} className="lg:col-span-3 order-1 lg:order-2">
              <div className="relative bg-white rounded-3xl border border-sand p-5 sm:p-8 lg:p-10 overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-copper to-gold" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-soft-black mb-6 sm:mb-8">
                  Stuur ons een bericht
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Naam"
                      {...register('name')}
                      error={errors.name?.message}
                      required
                    />
                    <Input
                      label="E-mailadres"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Telefoonnummer"
                      type="tel"
                      {...register('phone')}
                      error={errors.phone?.message}
                      helperText="Optioneel"
                    />
                    <Select
                      label="Onderwerp"
                      options={subjectOptions}
                      placeholder="Selecteer een onderwerp"
                      {...register('subject')}
                      error={errors.subject?.message}
                      required
                    />
                  </div>

                  <Textarea
                    label="Bericht"
                    rows={6}
                    {...register('message')}
                    error={errors.message?.message}
                    placeholder="Hoe kunnen we je helpen?"
                    required
                  />

                  <Button type="submit" size="lg" isLoading={isLoading} className="gap-2">
                    <Send className="h-4 w-4" strokeWidth={1.75} />
                    Versturen
                  </Button>
                </form>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
