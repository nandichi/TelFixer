'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, User, Mail, Phone, Lock, LogOut } from 'lucide-react';
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
    <div className="py-8 lg:py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/account"
              className="text-sm text-gray-600 hover:text-[#094543] flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Terug naar account
            </Link>
            <h1 className="text-3xl font-bold text-[#2C3E48]">Instellingen</h1>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#2C3E48] mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Persoonlijke gegevens
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#2C3E48] mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              E-mailadres
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#2C3E48]">{profile?.email}</p>
                <p className="text-sm text-gray-500">
                  E-mailadres kan niet worden gewijzigd
                </p>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#2C3E48] mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Wachtwoord
            </h2>
            <p className="text-gray-600 mb-4">
              Om je wachtwoord te wijzigen, klik op de knop hieronder.
            </p>
            <Button variant="outline">Wachtwoord wijzigen</Button>
          </div>

          {/* Sign Out */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#2C3E48] mb-4 flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Uitloggen
            </h2>
            <p className="text-gray-600 mb-4">
              Log uit van je TelFixer account op dit apparaat.
            </p>
            <Button variant="outline" onClick={handleSignOut}>
              Uitloggen
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
