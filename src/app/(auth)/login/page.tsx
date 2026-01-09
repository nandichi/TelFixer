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

const loginSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens zijn'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const { signIn } = useAuth();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        showError('Inloggen mislukt', 'Controleer je e-mailadres en wachtwoord');
      } else {
        success('Welkom terug!');
        router.push(redirect);
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
              Welkom terug
            </span>
            <h1 className="text-4xl font-display font-bold text-soft-black">Inloggen</h1>
            <p className="mt-4 text-muted">
              Log in om je bestellingen en inleveringen te beheren
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-sand p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="Wachtwoord"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                    rememberMe ? 'bg-primary border-primary' : 'border-sand group-hover:border-primary'
                  )}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-sm text-muted">Onthoud mij</span>
                </label>
                <Link href="/wachtwoord-vergeten" className="text-sm text-primary hover:underline">
                  Wachtwoord vergeten?
                </Link>
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                Inloggen
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-sand" />
              <span className="px-4 text-sm text-muted">of</span>
              <div className="flex-1 h-px bg-sand" />
            </div>

            {/* Register Link */}
            <p className="text-center text-muted">
              Nog geen account?{' '}
              <Link
                href={`/registreren${redirect !== '/account' ? `?redirect=${redirect}` : ''}`}
                className="text-primary font-medium hover:underline"
              >
                Maak een account aan
              </Link>
            </p>
          </div>

          {/* Info */}
          <p className="mt-8 text-center text-sm text-muted">
            Door in te loggen ga je akkoord met onze{' '}
            <Link href="/voorwaarden" className="text-primary hover:underline">
              algemene voorwaarden
            </Link>{' '}
            en{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              privacybeleid
            </Link>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
