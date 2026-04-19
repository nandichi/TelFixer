'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Voornaam is verplicht'),
  lastName: z.string().min(2, 'Achternaam is verplicht'),
  company: z.string().optional(),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().min(10, 'Telefoonnummer is verplicht'),
  street: z.string().min(2, 'Straatnaam is verplicht'),
  houseNumber: z.string().min(1, 'Huisnummer is verplicht'),
  postalCode: z
    .string()
    .regex(/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/, 'Ongeldige postcode'),
  city: z.string().min(2, 'Plaats is verplicht'),
  billingSameAsShipping: z.boolean(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Je moet akkoord gaan met de voorwaarden',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, itemCount } = useCart();
  const { error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'address' | 'review'>('address');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billingSameAsShipping: true,
      acceptTerms: false,
    },
  });

  if (items.length === 0) {
    return (
      <div className="py-24 lg:py-32 bg-cream min-h-screen">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 rounded-full bg-champagne flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-16 h-16 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-soft-black mb-4">
              Je winkelwagen is leeg
            </h1>
            <p className="text-muted mb-8">
              Voeg producten toe aan je winkelwagen om af te rekenen.
            </p>
            <Link href="/producten">
              <Button size="lg">Bekijk producten</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const handleNextStep = async () => {
    if (step === 'address') {
      const isValid = await trigger([
        'firstName',
        'lastName',
        'email',
        'phone',
        'street',
        'houseNumber',
        'postalCode',
        'city',
      ]);
      if (isValid) setStep('review');
    }
  };

  const handlePrevStep = () => {
    if (step === 'review') setStep('address');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (step !== 'review') return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company || null,
            email: data.email,
            phone: data.phone,
          },
          shippingAddress: {
            street: data.street,
            houseNumber: data.houseNumber,
            postalCode: data.postalCode,
            city: data.city,
            country: 'NL',
            company: data.company || null,
          },
          billingSameAsShipping: data.billingSameAsShipping,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totals: {
            subtotal,
            shipping,
            total,
          },
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Kon betaling niet starten');
      }

      if (payload.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }

      throw new Error('Geen betalingslink ontvangen van Mollie');
    } catch (err) {
      showError(
        'Er ging iets mis',
        err instanceof Error ? err.message : 'Probeer het opnieuw'
      );
      setIsSubmitting(false);
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && target.tagName !== 'TEXTAREA' && step !== 'review') {
      e.preventDefault();
    }
  };

  const steps = [
    {
      id: 'address',
      name: 'Adres',
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    },
    {
      id: 'review',
      name: 'Overzicht',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="py-12 lg:py-20 bg-cream min-h-screen">
      <Container>
        <div className="mb-12">
          <Link
            href="/winkelwagen"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Terug naar winkelwagen
          </Link>
          <span className="block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
            Checkout
          </span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
            Afrekenen
          </h1>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-1 sm:gap-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl transition-all duration-300',
                      currentStepIndex > index
                        ? 'bg-[#0D9488] text-white'
                        : currentStepIndex === index
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-sand text-muted'
                    )}
                  >
                    {currentStepIndex > index ? (
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={s.icon}
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={cn(
                      'hidden sm:block text-sm font-medium transition-colors',
                      currentStepIndex === index ? 'text-soft-black' : 'text-muted'
                    )}
                  >
                    {s.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-8 sm:w-20 h-0.5 mx-1 sm:mx-4 rounded-full transition-colors',
                      currentStepIndex > index ? 'bg-[#0D9488]' : 'bg-sand'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              {step === 'address' && (
                <div
                  className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-soft-black mb-5 sm:mb-8">
                    Verzendadres
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      label="Voornaam"
                      {...register('firstName')}
                      error={errors.firstName?.message}
                      required
                    />
                    <Input
                      label="Achternaam"
                      {...register('lastName')}
                      error={errors.lastName?.message}
                      required
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Bedrijfsnaam"
                        {...register('company')}
                        error={errors.company?.message}
                        helperText="Optioneel - voor zakelijke bestellingen"
                        placeholder="bijv. TelFixer B.V."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        label="E-mailadres"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        label="Telefoonnummer"
                        type="tel"
                        {...register('phone')}
                        error={errors.phone?.message}
                        required
                      />
                    </div>
                    <Input
                      label="Straatnaam"
                      {...register('street')}
                      error={errors.street?.message}
                      required
                    />
                    <Input
                      label="Huisnummer"
                      {...register('houseNumber')}
                      error={errors.houseNumber?.message}
                      required
                    />
                    <Input
                      label="Postcode"
                      {...register('postalCode')}
                      error={errors.postalCode?.message}
                      placeholder="1234 AB"
                      required
                    />
                    <Input
                      label="Plaats"
                      {...register('city')}
                      error={errors.city?.message}
                      required
                    />
                  </div>

                  <div className="mt-8 pt-8 border-t border-sand">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all',
                          watch('billingSameAsShipping')
                            ? 'bg-primary border-primary'
                            : 'border-sand group-hover:border-primary'
                        )}
                      >
                        {watch('billingSameAsShipping') && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        {...register('billingSameAsShipping')}
                        className="sr-only"
                      />
                      <span className="text-slate">
                        Factuuradres is hetzelfde als verzendadres
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 'review' && (
                <div className="space-y-4 sm:space-y-6">
                  <div
                    className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8"
                    style={{ boxShadow: 'var(--shadow-sm)' }}
                  >
                    <h2 className="text-xl sm:text-2xl font-display font-semibold text-soft-black mb-4 sm:mb-6">
                      Besteloverzicht
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-cream rounded-xl sm:rounded-2xl"
                        >
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-champagne rounded-lg sm:rounded-xl overflow-hidden shrink-0">
                            {item.product.image_urls?.[0] ? (
                              <Image
                                src={item.product.image_urls[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted">
                                <svg
                                  className="w-5 h-5 sm:w-6 sm:h-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-soft-black text-sm sm:text-base truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs sm:text-sm text-muted">
                              {item.quantity}x {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <p className="font-semibold text-primary text-sm sm:text-base">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div
                      className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-4 sm:p-6"
                      style={{ boxShadow: 'var(--shadow-sm)' }}
                    >
                      <h3 className="font-semibold text-soft-black mb-3 sm:mb-4 text-sm sm:text-base">
                        Verzendadres
                      </h3>
                      <p className="text-slate leading-relaxed text-sm">
                        {watch('firstName')} {watch('lastName')}
                        <br />
                        {watch('company') && (
                          <>
                            {watch('company')}
                            <br />
                          </>
                        )}
                        {watch('street')} {watch('houseNumber')}
                        <br />
                        {watch('postalCode')} {watch('city')}
                        <br />
                        {watch('email')}
                        <br />
                        {watch('phone')}
                      </p>
                    </div>
                    <div
                      className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-4 sm:p-6"
                      style={{ boxShadow: 'var(--shadow-sm)' }}
                    >
                      <h3 className="font-semibold text-soft-black mb-3 sm:mb-4 text-sm sm:text-base">
                        Betalen via Mollie
                      </h3>
                      <p className="text-slate text-sm leading-relaxed">
                        Na het plaatsen van je bestelling word je doorgestuurd
                        naar Mollie. Daar kies je zelf je betaalmethode (iDEAL,
                        creditcard, Klarna of bankoverschrijving).
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        {['iDEAL', 'Creditcard', 'Klarna', 'Overschrijving'].map(
                          (label) => (
                            <span
                              key={label}
                              className="text-xs px-2 py-1 rounded-full bg-champagne text-slate"
                            >
                              {label}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-6"
                    style={{ boxShadow: 'var(--shadow-sm)' }}
                  >
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className={cn(
                          'shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-all flex items-center justify-center',
                          watch('acceptTerms')
                            ? 'bg-primary border-primary'
                            : 'border-sand group-hover:border-primary'
                        )}
                      >
                        {watch('acceptTerms') && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        {...register('acceptTerms')}
                        className="sr-only"
                      />
                      <span className="text-sm text-slate leading-relaxed">
                        Ik ga akkoord met de{' '}
                        <Link
                          href="/voorwaarden"
                          target="_blank"
                          className="text-primary hover:underline font-medium"
                        >
                          algemene voorwaarden
                        </Link>{' '}
                        en het{' '}
                        <Link
                          href="/privacy"
                          target="_blank"
                          className="text-primary hover:underline font-medium"
                        >
                          privacybeleid
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-2 text-sm text-[#DC2626]">
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                {step !== 'address' ? (
                  <Button type="button" variant="ghost" onClick={handlePrevStep} className="gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                    Terug
                  </Button>
                ) : (
                  <div />
                )}
                {step !== 'review' ? (
                  <Button type="button" onClick={handleNextStep} className="gap-2">
                    Volgende
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Button>
                ) : (
                  <Button type="submit" isLoading={isSubmitting} size="lg" className="gap-2">
                    Ga naar betalen
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-8 lg:mt-0 order-first lg:order-last">
              <div
                className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8 lg:sticky lg:top-28"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <h2 className="text-lg sm:text-xl font-display font-semibold text-soft-black mb-4 sm:mb-6">
                  Totaal
                </h2>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">
                      Subtotaal ({itemCount} {itemCount === 1 ? 'product' : 'producten'})
                    </span>
                    <span className="font-medium text-soft-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Verzendkosten</span>
                    <span className="font-medium text-soft-black">
                      {shipping === 0 ? (
                        <span className="text-[#0D9488]">Gratis</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                </div>
                <div className="border-t border-sand pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-display font-semibold text-soft-black">
                      Totaal
                    </span>
                    <span className="text-2xl font-display font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-2">Inclusief BTW</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
