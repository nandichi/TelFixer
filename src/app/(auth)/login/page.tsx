'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';

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
    <div className="min-h-[calc(100vh-200px)] flex items-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E48]">Inloggen</h1>
            <p className="mt-2 text-gray-600">
              Log in om je bestellingen en inleveringen te beheren
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="E-mailadres"
                  className="pl-10"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Wachtwoord"
                  className="pl-10 pr-10"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#094543] focus:ring-[#094543]"
                  />
                  <span className="text-sm text-gray-600">Onthoud mij</span>
                </label>
                <Link
                  href="/wachtwoord-vergeten"
                  className="text-sm text-[#094543] hover:underline"
                >
                  Wachtwoord vergeten?
                </Link>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Inloggen
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-4 text-sm text-gray-500">of</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-600">
              Nog geen account?{' '}
              <Link
                href={`/registreren${redirect !== '/account' ? `?redirect=${redirect}` : ''}`}
                className="text-[#094543] font-medium hover:underline"
              >
                Maak een account aan
              </Link>
            </p>
          </div>

          {/* Info */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Door in te loggen ga je akkoord met onze{' '}
            <Link href="/voorwaarden" className="text-[#094543] hover:underline">
              algemene voorwaarden
            </Link>{' '}
            en{' '}
            <Link href="/privacy" className="text-[#094543] hover:underline">
              privacybeleid
            </Link>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
