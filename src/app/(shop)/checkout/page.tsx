'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, ShoppingBag, CreditCard, Building2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/components/ui/toast';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  // Shipping Address
  firstName: z.string().min(2, 'Voornaam is verplicht'),
  lastName: z.string().min(2, 'Achternaam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().min(10, 'Telefoonnummer is verplicht'),
  street: z.string().min(2, 'Straatnaam is verplicht'),
  houseNumber: z.string().min(1, 'Huisnummer is verplicht'),
  postalCode: z.string().regex(/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/, 'Ongeldige postcode'),
  city: z.string().min(2, 'Plaats is verplicht'),
  // Billing
  billingSameAsShipping: z.boolean(),
  // Payment
  paymentMethod: z.enum(['ideal', 'creditcard', 'paypal'] as const),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  { id: 'ideal', name: 'iDEAL', icon: Building2, description: 'Direct betalen via je bank' },
  { id: 'creditcard', name: 'Creditcard', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
  { id: 'paypal', name: 'PayPal', icon: CreditCard, description: 'Betaal met PayPal' },
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

  const billingSameAsShipping = watch('billingSameAsShipping');
  const selectedPayment = watch('paymentMethod');

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="py-16 lg:py-24">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[#2C3E48] mb-4">
              Je winkelwagen is leeg
            </h1>
            <p className="text-gray-500 mb-8">
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
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const orderNumber = generateOrderNumber();
      
      // Clear cart
      clearCart();
      
      // Show success and redirect
      success('Bestelling geplaatst!', `Ordernummer: ${orderNumber}`);
      router.push(`/checkout/bevestiging?order=${orderNumber}`);
    } catch (err) {
      showError('Er ging iets mis', 'Probeer het opnieuw');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 'address', name: 'Adres' },
    { id: 'payment', name: 'Betaling' },
    { id: 'review', name: 'Overzicht' },
  ];

  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/winkelwagen"
            className="text-sm text-gray-600 hover:text-[#094543] flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar winkelwagen
          </Link>
          <h1 className="text-3xl font-bold text-[#2C3E48]">Afrekenen</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                    step === s.id
                      ? 'bg-[#094543] text-white'
                      : steps.findIndex((x) => x.id === step) > index
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {steps.findIndex((x) => x.id === step) > index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm font-medium hidden sm:inline',
                    step === s.id ? 'text-[#094543]' : 'text-gray-500'
                  )}
                >
                  {s.name}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-12 h-[2px] bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Step 1: Address */}
              {step === 'address' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-[#2C3E48] mb-6">
                    Verzendadres
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Input
                      label="E-mailadres"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      required
                      className="sm:col-span-2"
                    />
                    <Input
                      label="Telefoonnummer"
                      type="tel"
                      {...register('phone')}
                      error={errors.phone?.message}
                      required
                      className="sm:col-span-2"
                    />
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

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('billingSameAsShipping')}
                        className="w-5 h-5 rounded text-[#094543] focus:ring-[#094543]"
                      />
                      <span className="text-sm text-gray-700">
                        Factuuradres is hetzelfde als verzendadres
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-[#2C3E48] mb-6">
                    Betaalmethode
                  </h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                          selectedPayment === method.id
                            ? 'border-[#094543] bg-[#094543]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          value={method.id}
                          {...register('paymentMethod')}
                          className="w-5 h-5 text-[#094543] focus:ring-[#094543]"
                        />
                        <method.icon className="h-6 w-6 text-gray-600" />
                        <div>
                          <p className="font-medium text-[#2C3E48]">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    * In deze demo wordt de betaling gesimuleerd. In productie wordt 
                    dit gekoppeld aan een echte payment provider (Mollie/Stripe).
                  </p>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 'review' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-[#2C3E48] mb-4">
                      Besteloverzicht
                    </h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-4">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item.product.image_urls?.[0] ? (
                              <Image
                                src={item.product.image_urls[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ShoppingBag className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#2C3E48] truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.quantity}x {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <p className="font-medium text-[#094543]">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-[#2C3E48] mb-3">
                      Verzendadres
                    </h3>
                    <p className="text-gray-600">
                      {watch('firstName')} {watch('lastName')}<br />
                      {watch('street')} {watch('houseNumber')}<br />
                      {watch('postalCode')} {watch('city')}<br />
                      {watch('email')}<br />
                      {watch('phone')}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-[#2C3E48] mb-3">
                      Betaalmethode
                    </h3>
                    <p className="text-gray-600">
                      {paymentMethods.find((m) => m.id === selectedPayment)?.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                {step !== 'address' ? (
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Terug
                  </Button>
                ) : (
                  <div />
                )}
                {step !== 'review' ? (
                  <Button type="button" onClick={handleNextStep}>
                    Volgende
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" isLoading={isSubmitting}>
                    Bestelling plaatsen
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-[#2C3E48] mb-4">
                  Totaal
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Subtotaal ({itemCount} {itemCount === 1 ? 'product' : 'producten'})
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Verzendkosten</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">Gratis</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#2C3E48]">
                      Totaal
                    </span>
                    <span className="text-xl font-bold text-[#094543]">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Inclusief BTW</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
