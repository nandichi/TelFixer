'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Truck, CreditCard, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

interface CompanySettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  kvkNumber: string;
  vatNumber: string;
}

interface ShippingSettings {
  standardCost: number;
  freeThreshold: number;
  estimatedDays: string;
}

export default function AdminSettingsPage() {
  const { success } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const companyForm = useForm<CompanySettings>({
    defaultValues: {
      companyName: 'TelFixer',
      email: 'info@telfixer.nl',
      phone: '+31 20 123 4567',
      address: 'Voorbeeldstraat 123, 1234 AB Amsterdam',
      kvkNumber: '12345678',
      vatNumber: 'NL123456789B01',
    },
  });

  const shippingForm = useForm<ShippingSettings>({
    defaultValues: {
      standardCost: 6.95,
      freeThreshold: 50,
      estimatedDays: '2-4 werkdagen',
    },
  });

  const onSaveCompany = async (data: CompanySettings) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success('Bedrijfsgegevens opgeslagen');
    setIsLoading(false);
  };

  const onSaveShipping = async (data: ShippingSettings) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success('Verzendingsgegevens opgeslagen');
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C3E48]">Instellingen</h1>
        <p className="text-gray-600">Beheer je platform instellingen</p>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5 text-[#094543]" />
          <h2 className="text-lg font-semibold text-[#2C3E48]">
            Bedrijfsgegevens
          </h2>
        </div>

        <form onSubmit={companyForm.handleSubmit(onSaveCompany)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bedrijfsnaam"
              {...companyForm.register('companyName')}
            />
            <Input
              label="E-mailadres"
              type="email"
              {...companyForm.register('email')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Telefoonnummer"
              {...companyForm.register('phone')}
            />
            <Input
              label="KvK-nummer"
              {...companyForm.register('kvkNumber')}
            />
          </div>
          <Input
            label="Adres"
            {...companyForm.register('address')}
          />
          <Input
            label="BTW-nummer"
            {...companyForm.register('vatNumber')}
          />
          <Button type="submit" isLoading={isLoading}>
            Opslaan
          </Button>
        </form>
      </div>

      {/* Shipping Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="h-5 w-5 text-[#094543]" />
          <h2 className="text-lg font-semibold text-[#2C3E48]">
            Verzending
          </h2>
        </div>

        <form onSubmit={shippingForm.handleSubmit(onSaveShipping)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Standaard verzendkosten"
              type="number"
              step="0.01"
              {...shippingForm.register('standardCost', { valueAsNumber: true })}
              helperText="In euro's"
            />
            <Input
              label="Gratis verzending vanaf"
              type="number"
              step="0.01"
              {...shippingForm.register('freeThreshold', { valueAsNumber: true })}
              helperText="Orderwaarde in euro's"
            />
          </div>
          <Input
            label="Geschatte levertijd"
            {...shippingForm.register('estimatedDays')}
            helperText="Bijv. '2-4 werkdagen'"
          />
          <Button type="submit" isLoading={isLoading}>
            Opslaan
          </Button>
        </form>
      </div>

      {/* Payment Settings (Placeholder) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-5 w-5 text-[#094543]" />
          <h2 className="text-lg font-semibold text-[#2C3E48]">
            Betalingen
          </h2>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Placeholder:</strong> Payment provider integratie (Mollie/Stripe) 
            moet nog worden geconfigureerd. Voeg je API keys toe in de omgevingsvariabelen.
          </p>
        </div>
      </div>

      {/* Email Settings (Placeholder) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-5 w-5 text-[#094543]" />
          <h2 className="text-lg font-semibold text-[#2C3E48]">
            E-mail notificaties
          </h2>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">
            E-mail templates en notificatie-instellingen kunnen hier worden geconfigureerd.
            Momenteel worden Supabase's ingebouwde e-mails gebruikt.
          </p>
        </div>
      </div>
    </div>
  );
}
