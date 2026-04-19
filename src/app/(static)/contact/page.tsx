'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';

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

export default function ContactPage() {
  const { success } = useToast();
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
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    success('Bericht verzonden!', 'We nemen zo snel mogelijk contact met je op.');
    reset();
    setIsLoading(false);
  };

  return (
    <div className="py-10 sm:py-12 lg:py-16">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E48] mb-3 sm:mb-4">Contact</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Heb je een vraag of wil je meer informatie? Neem gerust contact met ons op.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1 flex flex-col items-center lg:items-stretch">
            <div className="bg-[#094543] text-white rounded-xl sm:rounded-2xl p-5 sm:p-8 w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
              <h2 className="text-xl font-semibold mb-6 text-center">Contactgegevens</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <a
                      href="mailto:info@telfixer.nl"
                      className="text-gray-300 hover:text-white"
                    >
                      info@telfixer.nl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Telefoon</p>
                    <a
                      href="tel:+31644642162"
                      className="text-gray-300 hover:text-white"
                    >
                      +31 6 44642162
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="h-6 w-6 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">WhatsApp Business</p>
                    <a
                      href="https://wa.me/31644642162"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: '#25D366', color: '#ffffff' }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.861 9.861 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                      </svg>
                      Chat via WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Adres</p>
                    <p className="text-gray-300">
                      Houtrakbos 34<br />
                      6718HD, Ede
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-[#2C3E48] mb-2 text-sm sm:text-base">
                Reactietijd
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                We streven ernaar om binnen 24 uur te reageren op alle berichten 
                tijdens werkdagen.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-[#2C3E48] mb-4 sm:mb-6">
                Stuur ons een bericht
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
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

                <div className="grid sm:grid-cols-2 gap-4">
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

                <Button type="submit" isLoading={isLoading}>
                  <Send className="h-4 w-4 mr-2" />
                  Versturen
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
