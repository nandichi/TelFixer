'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Voornaam is verplicht'),
  lastName: z.string().min(2, 'Achternaam is verplicht'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { profile, updateProfile, signOut } = useAuth();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      phone: profile?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      const { error } = await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
      });

      if (error) {
        showError('Bijwerken mislukt', error.message);
      } else {
        success('Profiel bijgewerkt');
      }
    } catch (err) {
      showError('Er ging iets mis', 'Probeer het opnieuw');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary font-medium mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Terug naar account
            </Link>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black">
              Instellingen
            </h1>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-3xl border border-sand p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-soft-black">
                  Persoonlijke gegevens
                </h2>
                <p className="text-sm text-muted">
                  Wijzig je naam en contactgegevens
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Voornaam"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Achternaam"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>
              <Input
                label="Telefoonnummer"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                helperText="Optioneel - voor contact over bestellingen"
              />
              <Button type="submit" isLoading={isLoading}>
                Opslaan
              </Button>
            </form>
          </div>

          {/* Email (read-only) */}
          <div className="bg-white rounded-3xl border border-sand p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-copper/5 flex items-center justify-center text-copper">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-soft-black">
                  E-mailadres
                </h2>
                <p className="text-sm text-muted">
                  Je inloggegevens
                </p>
              </div>
            </div>
            <div className="bg-cream rounded-2xl p-5">
              <p className="font-medium text-soft-black">{profile?.email}</p>
              <p className="text-sm text-muted mt-1">
                E-mailadres kan niet worden gewijzigd
              </p>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-3xl border border-sand p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate/5 flex items-center justify-center text-slate">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-soft-black">
                  Wachtwoord
                </h2>
                <p className="text-sm text-muted">
                  Beveilig je account
                </p>
              </div>
            </div>
            <p className="text-slate mb-5">
              Om je wachtwoord te wijzigen, klik op de knop hieronder.
            </p>
            <Button variant="outline" className="gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Wachtwoord wijzigen
            </Button>
          </div>

          {/* Sign Out */}
          <div className="bg-white rounded-3xl border border-sand p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-soft-black">
                  Uitloggen
                </h2>
                <p className="text-sm text-muted">
                  Beeindig je sessie
                </p>
              </div>
            </div>
            <p className="text-slate mb-5">
              Log uit van je TelFixer account op dit apparaat.
            </p>
            <Button variant="outline" onClick={handleSignOut} className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Uitloggen
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
