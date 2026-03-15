'use client';

import { useState, useEffect } from 'react';
import {
  Building,
  Truck,
  Percent,
  Globe,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  kvk_number: string;
  vat_number: string;
}

interface ShippingSettings {
  standard_cost: number;
  free_threshold: number;
  estimated_days: string;
}

interface SocialSettings {
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  tiktok_url: string;
}

interface TaxSettings {
  rate: number;
}

export default function AdminSettingsPage() {
  const { success, error: showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [savingTax, setSavingTax] = useState(false);

  // Company settings
  const [company, setCompany] = useState<CompanySettings>({
    name: 'TelFixer',
    email: 'info@telfixer.nl',
    phone: '+31 20 123 4567',
    address: 'Voorbeeldstraat 123, 1234 AB Amsterdam',
    kvk_number: '',
    vat_number: '',
  });

  // Shipping settings
  const [shipping, setShipping] = useState<ShippingSettings>({
    standard_cost: 6.95,
    free_threshold: 50,
    estimated_days: '2-4 werkdagen',
  });

  // Social settings
  const [social, setSocial] = useState<SocialSettings>({
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    tiktok_url: '',
  });

  // Tax settings
  const [tax, setTax] = useState<TaxSettings>({
    rate: 21,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const supabase = createClient();

    const { data } = await supabase.from('site_settings').select('*');

    if (data) {
      data.forEach((item) => {
        if (item.key === 'company' && item.value) {
          setCompany({ ...company, ...item.value });
        }
        if (item.key === 'shipping' && item.value) {
          setShipping({ ...shipping, ...item.value });
        }
        if (item.key === 'social' && item.value) {
          setSocial({ ...social, ...item.value });
        }
        if (item.key === 'tax' && item.value) {
          setTax({ ...tax, ...item.value });
        }
      });
    }

    setLoading(false);
  };

  const saveSettings = async (
    key: string,
    value: unknown,
    setSaving: (v: boolean) => void
  ) => {
    setSaving(true);

    const supabase = createClient();

    // Check if exists
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('key', key)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (error) {
        showError(`Fout bij opslaan: ${error.message}`);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from('site_settings').insert({
        key,
        value,
      });

      if (error) {
        showError(`Fout bij opslaan: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    success('Instellingen opgeslagen');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-slate">Instellingen laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-soft-black">
          Instellingen
        </h1>
        <p className="text-slate">Beheer je bedrijfs- en webshopinstellingen</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Company Settings */}
        <div className="bg-white rounded-2xl border border-sand p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-soft-black">Bedrijfsgegevens</h2>
              <p className="text-sm text-slate">
                Contactinformatie en KvK-nummer
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Bedrijfsnaam"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="E-mailadres"
                type="email"
                value={company.email}
                onChange={(e) =>
                  setCompany({ ...company, email: e.target.value })
                }
              />
              <Input
                label="Telefoonnummer"
                value={company.phone}
                onChange={(e) =>
                  setCompany({ ...company, phone: e.target.value })
                }
              />
            </div>
            <Input
              label="Adres"
              value={company.address}
              onChange={(e) =>
                setCompany({ ...company, address: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="KvK-nummer"
                value={company.kvk_number}
                onChange={(e) =>
                  setCompany({ ...company, kvk_number: e.target.value })
                }
              />
              <Input
                label="BTW-nummer"
                value={company.vat_number}
                onChange={(e) =>
                  setCompany({ ...company, vat_number: e.target.value })
                }
              />
            </div>
            <Button
              className="w-full"
              isLoading={savingCompany}
              onClick={() => saveSettings('company', company, setSavingCompany)}
            >
              <Save className="h-4 w-4 mr-2" />
              Bedrijfsgegevens opslaan
            </Button>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-2xl border border-sand p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-soft-black">
                Verzendingsinstellingen
              </h2>
              <p className="text-sm text-slate">Kosten en levertijden</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Standaard verzendkosten"
              type="number"
              step="0.01"
              value={shipping.standard_cost}
              onChange={(e) =>
                setShipping({
                  ...shipping,
                  standard_cost: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Gratis verzending vanaf"
              type="number"
              step="0.01"
              value={shipping.free_threshold}
              onChange={(e) =>
                setShipping({
                  ...shipping,
                  free_threshold: parseFloat(e.target.value) || 0,
                })
              }
              helperText="Bestelwaarde waarboven verzending gratis is"
            />
            <Input
              label="Geschatte levertijd"
              value={shipping.estimated_days}
              onChange={(e) =>
                setShipping({ ...shipping, estimated_days: e.target.value })
              }
              placeholder="bijv. 2-4 werkdagen"
            />
            <Button
              className="w-full"
              isLoading={savingShipping}
              onClick={() =>
                saveSettings('shipping', shipping, setSavingShipping)
              }
            >
              <Save className="h-4 w-4 mr-2" />
              Verzendingsinstellingen opslaan
            </Button>
          </div>
        </div>

        {/* Social Media Settings */}
        <div className="bg-white rounded-2xl border border-sand p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-soft-black">Social Media</h2>
              <p className="text-sm text-slate">Links naar je sociale media</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Instagram URL"
              value={social.instagram_url}
              onChange={(e) =>
                setSocial({ ...social, instagram_url: e.target.value })
              }
              placeholder="https://instagram.com/..."
            />
            <Input
              label="Facebook URL"
              value={social.facebook_url}
              onChange={(e) =>
                setSocial({ ...social, facebook_url: e.target.value })
              }
              placeholder="https://facebook.com/..."
            />
            <Input
              label="TikTok URL"
              value={social.tiktok_url}
              onChange={(e) =>
                setSocial({ ...social, tiktok_url: e.target.value })
              }
              placeholder="https://tiktok.com/..."
            />
            <Input
              label="Twitter/X URL"
              value={social.twitter_url}
              onChange={(e) =>
                setSocial({ ...social, twitter_url: e.target.value })
              }
              placeholder="https://twitter.com/..."
            />
            <Input
              label="LinkedIn URL"
              value={social.linkedin_url}
              onChange={(e) =>
                setSocial({ ...social, linkedin_url: e.target.value })
              }
              placeholder="https://linkedin.com/..."
            />
            <Button
              className="w-full"
              isLoading={savingSocial}
              onClick={() => saveSettings('social', social, setSavingSocial)}
            >
              <Save className="h-4 w-4 mr-2" />
              Social media opslaan
            </Button>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-white rounded-2xl border border-sand p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Percent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-soft-black">BTW-instellingen</h2>
              <p className="text-sm text-slate">BTW-percentage voor producten</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="BTW-percentage (%)"
              type="number"
              value={tax.rate}
              onChange={(e) =>
                setTax({ ...tax, rate: parseFloat(e.target.value) || 0 })
              }
              helperText="Standaard BTW-tarief in Nederland is 21%"
            />
            <Button
              className="w-full"
              isLoading={savingTax}
              onClick={() => saveSettings('tax', tax, setSavingTax)}
            >
              <Save className="h-4 w-4 mr-2" />
              BTW-instellingen opslaan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
