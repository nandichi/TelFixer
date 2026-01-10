'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Voornaam is verplicht'),
  lastName: z.string().min(2, 'Achternaam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().min(10, 'Telefoonnummer is verplicht'),
  street: z.string().min(2, 'Straatnaam is verplicht'),
  houseNumber: z.string().min(1, 'Huisnummer is verplicht'),
  postalCode: z.string().regex(/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/, 'Ongeldige postcode'),
  city: z.string().min(2, 'Plaats is verplicht'),
  billingSameAsShipping: z.boolean(),
  paymentMethod: z.enum(['ideal', 'creditcard', 'paypal'] as const),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  { id: 'ideal', name: 'iDEAL', description: 'Direct betalen via je bank' },
  { id: 'creditcard', name: 'Creditcard', description: 'Visa, Mastercard, Amex' },
  { id: 'paypal', name: 'PayPal', description: 'Betaal met PayPal' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart, itemCount } = useCart();
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');

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
      paymentMethod: 'ideal',
    },
  });

  const selectedPayment = watch('paymentMethod');

  if (items.length === 0) {
    return (
      <div className="py-24 lg:py-32 bg-cream min-h-screen">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 rounded-full bg-champagne flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
        'firstName', 'lastName', 'email', 'phone', 'street', 'houseNumber', 'postalCode', 'city',
      ]);
      if (isValid) setStep('payment');
    } else if (step === 'payment') {
      const isValid = await trigger(['paymentMethod']);
      if (isValid) setStep('review');
    }
  };

  const handlePrevStep = () => {
    if (step === 'payment') setStep('address');
    else if (step === 'review') setStep('payment');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const orderNumber = generateOrderNumber();
      clearCart();
      success('Bestelling geplaatst!', `Ordernummer: ${orderNumber}`);
      router.push(`/checkout/bevestiging?order=${orderNumber}`);
    } catch (err) {
      showError('Er ging iets mis', 'Probeer het opnieuw');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 'address', name: 'Adres', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'payment', name: 'Betaling', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'review', name: 'Overzicht', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="py-12 lg:py-20 bg-cream min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/winkelwagen"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Terug naar winkelwagen
          </Link>
          <span className="block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
            Checkout
          </span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">Afrekenen</h1>
        </div>

        {/* Progress Steps */}
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
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                      </svg>
                    )}
                  </div>
                  <span className={cn(
                    'hidden sm:block text-sm font-medium transition-colors',
                    currentStepIndex === index ? 'text-soft-black' : 'text-muted'
                  )}>
                    {s.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-8 sm:w-20 h-0.5 mx-1 sm:mx-4 rounded-full transition-colors',
                    currentStepIndex > index ? 'bg-[#0D9488]' : 'bg-sand'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Step 1: Address */}
              {step === 'address' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-soft-black mb-5 sm:mb-8">
                    Verzendadres
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input label="Voornaam" {...register('firstName')} error={errors.firstName?.message} required />
                    <Input label="Achternaam" {...register('lastName')} error={errors.lastName?.message} required />
                    <div className="sm:col-span-2">
                      <Input label="E-mailadres" type="email" {...register('email')} error={errors.email?.message} required />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Telefoonnummer" type="tel" {...register('phone')} error={errors.phone?.message} required />
                    </div>
                    <Input label="Straatnaam" {...register('street')} error={errors.street?.message} required />
                    <Input label="Huisnummer" {...register('houseNumber')} error={errors.houseNumber?.message} required />
                    <Input label="Postcode" {...register('postalCode')} error={errors.postalCode?.message} placeholder="1234 AB" required />
                    <Input label="Plaats" {...register('city')} error={errors.city?.message} required />
                  </div>

                  <div className="mt-8 pt-8 border-t border-sand">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className={cn(
                        'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all',
                        watch('billingSameAsShipping') ? 'bg-primary border-primary' : 'border-sand group-hover:border-primary'
                      )}>
                        {watch('billingSameAsShipping') && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" {...register('billingSameAsShipping')} className="sr-only" />
                      <span className="text-slate">Factuuradres is hetzelfde als verzendadres</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-soft-black mb-5 sm:mb-8">
                    Betaalmethode
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-center gap-3 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-200',
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-sand hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                          selectedPayment === method.id ? 'border-primary' : 'border-sand'
                        )}>
                          {selectedPayment === method.id && (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <input type="radio" value={method.id} {...register('paymentMethod')} className="sr-only" />
                        <div>
                          <p className="font-semibold text-soft-black text-sm sm:text-base">{method.name}</p>
                          <p className="text-xs sm:text-sm text-muted">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-muted">
                    * In deze demo wordt de betaling gesimuleerd.
                  </p>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 'review' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
                    <h2 className="text-xl sm:text-2xl font-display font-semibold text-soft-black mb-4 sm:mb-6">
                      Besteloverzicht
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-cream rounded-xl sm:rounded-2xl">
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-champagne rounded-lg sm:rounded-xl overflow-hidden shrink-0">
                            {item.product.image_urls?.[0] ? (
                              <Image src={item.product.image_urls[0]} alt={item.product.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-soft-black text-sm sm:text-base truncate">{item.product.name}</p>
                            <p className="text-xs sm:text-sm text-muted">{item.quantity}x {formatPrice(item.product.price)}</p>
                          </div>
                          <p className="font-semibold text-primary text-sm sm:text-base">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-4 sm:p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
                      <h3 className="font-semibold text-soft-black mb-3 sm:mb-4 text-sm sm:text-base">Verzendadres</h3>
                      <p className="text-slate leading-relaxed text-sm">
                        {watch('firstName')} {watch('lastName')}<br />
                        {watch('street')} {watch('houseNumber')}<br />
                        {watch('postalCode')} {watch('city')}<br />
                        {watch('email')}<br />
                        {watch('phone')}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-4 sm:p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
                      <h3 className="font-semibold text-soft-black mb-3 sm:mb-4 text-sm sm:text-base">Betaalmethode</h3>
                      <p className="text-slate text-sm">{paymentMethods.find((m) => m.id === selectedPayment)?.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                {step !== 'address' ? (
                  <Button type="button" variant="ghost" onClick={handlePrevStep} className="gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                ) : (
                  <Button type="submit" isLoading={isSubmitting} size="lg" className="gap-2">
                    Bestelling plaatsen
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="mt-8 lg:mt-0 order-first lg:order-last">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand p-5 sm:p-8 lg:sticky lg:top-28" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h2 className="text-lg sm:text-xl font-display font-semibold text-soft-black mb-4 sm:mb-6">Totaal</h2>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Subtotaal ({itemCount} {itemCount === 1 ? 'product' : 'producten'})</span>
                    <span className="font-medium text-soft-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Verzendkosten</span>
                    <span className="font-medium text-soft-black">
                      {shipping === 0 ? <span className="text-[#0D9488]">Gratis</span> : formatPrice(shipping)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-sand pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-display font-semibold text-soft-black">Totaal</span>
                    <span className="text-2xl font-display font-bold text-primary">{formatPrice(total)}</span>
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
