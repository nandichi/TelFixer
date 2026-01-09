'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Voornaam is verplicht'),
  lastName: z.string().min(2, 'Achternaam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 tekens zijn'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Je moet akkoord gaan met de voorwaarden',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const { signUp } = useAuth();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, data.firstName, data.lastName);
      if (error) {
        if (error.message.includes('already registered')) {
          showError('E-mailadres bestaat al', 'Log in of gebruik een ander e-mailadres');
        } else {
          showError('Registratie mislukt', error.message);
        }
      } else {
        success('Account aangemaakt!', 'Controleer je e-mail om je account te bevestigen');
        router.push('/login');
      }
    } catch (err) {
      showError('Er ging iets mis', 'Probeer het opnieuw');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center py-20 bg-cream">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
              Nieuw hier?
            </span>
            <h1 className="text-4xl font-display font-bold text-soft-black">Account aanmaken</h1>
            <p className="mt-4 text-muted">
              Maak een account aan om te bestellen en je inleveringen te volgen
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-sand p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <Input
                    placeholder="Voornaam"
                    className="pl-12"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                </div>
                <Input
                  placeholder="Achternaam"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  type="email"
                  placeholder="E-mailadres"
                  className="pl-12"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Wachtwoord (min. 8 tekens)"
                  className="pl-12 pr-12"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-soft-black transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Bevestig wachtwoord"
                  className="pl-12"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>

              <div>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all mt-0.5 shrink-0',
                    acceptTerms ? 'bg-primary border-primary' : 'border-sand group-hover:border-primary'
                  )}>
                    {acceptTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input type="checkbox" {...register('acceptTerms')} className="sr-only" />
                  <span className="text-sm text-muted">
                    Ik ga akkoord met de{' '}
                    <Link href="/voorwaarden" className="text-primary hover:underline">
                      algemene voorwaarden
                    </Link>{' '}
                    en het{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacybeleid
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-2 text-sm text-[#DC2626]">{errors.acceptTerms.message}</p>
                )}
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                Account aanmaken
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-sand" />
              <span className="px-4 text-sm text-muted">of</span>
              <div className="flex-1 h-px bg-sand" />
            </div>

            {/* Login Link */}
            <p className="text-center text-muted">
              Heb je al een account?{' '}
              <Link
                href={`/login${redirect !== '/account' ? `?redirect=${redirect}` : ''}`}
                className="text-primary font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
