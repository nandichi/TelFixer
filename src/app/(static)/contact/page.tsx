'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
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
              <h2 className="text-xl font-semibold mb-6 text-center lg:text-left">Contactgegevens</h2>
              
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
                      href="tel:+31201234567"
                      className="text-gray-300 hover:text-white"
                    >
                      +31 20 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Adres</p>
                    <p className="text-gray-300">
                      Voorbeeldstraat 123<br />
                      1234 AB Amsterdam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Openingstijden</p>
                    <p className="text-gray-300">
                      Ma - Vr: 09:00 - 17:00<br />
                      Za - Zo: Gesloten
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
