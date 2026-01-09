'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';

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
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const { error } = await signUp(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );

      if (error) {
        if (error.message.includes('already registered')) {
          showError('E-mailadres bestaat al', 'Log in of gebruik een ander e-mailadres');
        } else {
          showError('Registratie mislukt', error.message);
        }
      } else {
        success(
          'Account aangemaakt!',
          'Controleer je e-mail om je account te bevestigen'
        );
        router.push('/login');
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
            <h1 className="text-3xl font-bold text-[#2C3E48]">Account aanmaken</h1>
            <p className="mt-2 text-gray-600">
              Maak een account aan om te bestellen en je inleveringen te volgen
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Voornaam"
                    className="pl-10"
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
                  placeholder="Wachtwoord (min. 8 tekens)"
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

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Bevestig wachtwoord"
                  className="pl-10"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('acceptTerms')}
                    className="w-5 h-5 rounded text-[#094543] focus:ring-[#094543] mt-0.5"
                  />
                  <span className="text-sm text-gray-600">
                    Ik ga akkoord met de{' '}
                    <Link href="/voorwaarden" className="text-[#094543] hover:underline">
                      algemene voorwaarden
                    </Link>{' '}
                    en het{' '}
                    <Link href="/privacy" className="text-[#094543] hover:underline">
                      privacybeleid
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Account aanmaken
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-4 text-sm text-gray-500">of</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Heb je al een account?{' '}
              <Link
                href={`/login${redirect !== '/account' ? `?redirect=${redirect}` : ''}`}
                className="text-[#094543] font-medium hover:underline"
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
