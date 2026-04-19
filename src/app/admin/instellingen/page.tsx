'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Building,
  Truck,
  Percent,
  Globe,
  Save,
  Loader2,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Section } from '@/components/admin/ui/section';
import { AdminButton } from '@/components/admin/ui/admin-button';
import { AdminInput, AdminTextarea } from '@/components/admin/ui/admin-input';

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

type TabId = 'company' | 'shipping' | 'tax' | 'social';

const tabs: {
  id: TabId;
  label: string;
  description: string;
  icon: typeof Building;
}[] = [
  {
    id: 'company',
    label: 'Bedrijf',
    description: 'Contact en juridische gegevens',
    icon: Building,
  },
  {
    id: 'shipping',
    label: 'Verzending',
    description: 'Kosten en levertijden',
    icon: Truck,
  },
  {
    id: 'tax',
    label: 'BTW',
    description: 'BTW-tarieven',
    icon: Percent,
  },
  {
    id: 'social',
    label: 'Social Media',
    description: 'Links naar profielen',
    icon: Globe,
  },
];

export default function AdminSettingsPage() {
  const { success, error: showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('company');
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [company, setCompany] = useState<CompanySettings>({
    name: 'TelFixer',
    email: 'info@telfixer.nl',
    phone: '+31 6 44642162',
    address: 'Houtrakbos 34, 6718HD, Ede',
    kvk_number: '',
    vat_number: '',
  });
  const [shipping, setShipping] = useState<ShippingSettings>({
    standard_cost: 6.95,
    free_threshold: 50,
    estimated_days: '2-4 werkdagen',
  });
  const [social, setSocial] = useState<SocialSettings>({
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    tiktok_url: '',
  });
  const [tax, setTax] = useState<TaxSettings>({ rate: 21 });

  const fetchSettings = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      data.forEach((item) => {
        if (item.key === 'company' && item.value)
          setCompany((p) => ({ ...p, ...item.value }));
        if (item.key === 'shipping' && item.value)
          setShipping((p) => ({ ...p, ...item.value }));
        if (item.key === 'social' && item.value)
          setSocial((p) => ({ ...p, ...item.value }));
        if (item.key === 'tax' && item.value)
          setTax((p) => ({ ...p, ...item.value }));
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (key: string, value: unknown) => {
    setSavingKey(key);
    const supabase = createClient();
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('key', key)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
      if (error) {
        showError(`Fout bij opslaan: ${error.message}`);
        setSavingKey(null);
        return;
      }
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert({ key, value });
      if (error) {
        showError(`Fout bij opslaan: ${error.message}`);
        setSavingKey(null);
        return;
      }
    }
    success('Instellingen opgeslagen');
    setSavingKey(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" />
      </div>
    );
  }

  const activeTabConfig = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Instellingen"
        description="Beheer je bedrijfs- en webshopinstellingen"
        meta={
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--a-text-3)]">
            <Settings className="h-3.5 w-3.5" />
            Wijzigingen worden direct toegepast
          </span>
        }
      />

      <div className="grid lg:grid-cols-[220px_1fr] gap-5">
        <nav className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] p-1.5 h-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-2.5 py-2 rounded-md flex items-center gap-2.5 transition-colors ${
                  active
                    ? 'bg-[var(--a-accent-soft)] text-[var(--a-accent)]'
                    : 'text-[var(--a-text-2)] hover:bg-[var(--a-surface-2)]'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    active ? 'text-[var(--a-accent)]' : 'text-[var(--a-text-3)]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium leading-tight">
                    {t.label}
                  </div>
                  <div className="text-[11px] text-[var(--a-text-3)] truncate">
                    {t.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="space-y-4">
          {activeTab === 'company' && (
            <Section
              title="Bedrijfsgegevens"
              description="Wordt gebruikt op facturen, e-mails en in de footer"
              action={<activeTabConfig.icon className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <AdminInput
                  label="Bedrijfsnaam"
                  value={company.name}
                  onChange={(e) =>
                    setCompany({ ...company, name: e.target.value })
                  }
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="E-mailadres"
                    type="email"
                    value={company.email}
                    onChange={(e) =>
                      setCompany({ ...company, email: e.target.value })
                    }
                  />
                  <AdminInput
                    label="Telefoonnummer"
                    value={company.phone}
                    onChange={(e) =>
                      setCompany({ ...company, phone: e.target.value })
                    }
                  />
                </div>
                <AdminTextarea
                  label="Adres"
                  rows={2}
                  value={company.address}
                  onChange={(e) =>
                    setCompany({ ...company, address: e.target.value })
                  }
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="KvK-nummer"
                    value={company.kvk_number}
                    onChange={(e) =>
                      setCompany({ ...company, kvk_number: e.target.value })
                    }
                  />
                  <AdminInput
                    label="BTW-nummer"
                    value={company.vat_number}
                    onChange={(e) =>
                      setCompany({ ...company, vat_number: e.target.value })
                    }
                  />
                </div>
                <SaveBar
                  onSave={() => saveSettings('company', company)}
                  loading={savingKey === 'company'}
                />
              </div>
            </Section>
          )}

          {activeTab === 'shipping' && (
            <Section
              title="Verzending"
              description="Kosten en levertijden voor de webshop"
              action={<Truck className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="Standaard verzendkosten"
                    type="number"
                    step="0.01"
                    prefix="€"
                    value={shipping.standard_cost}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        standard_cost: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="Gratis verzending vanaf"
                    type="number"
                    step="0.01"
                    prefix="€"
                    hint="Bestelwaarde waarboven verzending gratis is"
                    value={shipping.free_threshold}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        free_threshold: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <AdminInput
                  label="Geschatte levertijd"
                  value={shipping.estimated_days}
                  placeholder="bijv. 2-4 werkdagen"
                  onChange={(e) =>
                    setShipping({
                      ...shipping,
                      estimated_days: e.target.value,
                    })
                  }
                />
                <SaveBar
                  onSave={() => saveSettings('shipping', shipping)}
                  loading={savingKey === 'shipping'}
                />
              </div>
            </Section>
          )}

          {activeTab === 'tax' && (
            <Section
              title="BTW-tarief"
              description="Standaard BTW-percentage voor producten"
              action={<Percent className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="BTW-percentage"
                    type="number"
                    suffix="%"
                    hint="Standaard tarief in NL: 21%"
                    value={tax.rate}
                    onChange={(e) =>
                      setTax({ ...tax, rate: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <SaveBar
                  onSave={() => saveSettings('tax', tax)}
                  loading={savingKey === 'tax'}
                />
              </div>
            </Section>
          )}

          {activeTab === 'social' && (
            <Section
              title="Social Media"
              description="Links worden in de footer en op contactpagina getoond"
              action={<Globe className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <AdminInput
                  label="Instagram URL"
                  placeholder="https://instagram.com/..."
                  value={social.instagram_url}
                  onChange={(e) =>
                    setSocial({ ...social, instagram_url: e.target.value })
                  }
                />
                <AdminInput
                  label="Facebook URL"
                  placeholder="https://facebook.com/..."
                  value={social.facebook_url}
                  onChange={(e) =>
                    setSocial({ ...social, facebook_url: e.target.value })
                  }
                />
                <AdminInput
                  label="TikTok URL"
                  placeholder="https://tiktok.com/..."
                  value={social.tiktok_url}
                  onChange={(e) =>
                    setSocial({ ...social, tiktok_url: e.target.value })
                  }
                />
                <AdminInput
                  label="Twitter / X URL"
                  placeholder="https://x.com/..."
                  value={social.twitter_url}
                  onChange={(e) =>
                    setSocial({ ...social, twitter_url: e.target.value })
                  }
                />
                <AdminInput
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/..."
                  value={social.linkedin_url}
                  onChange={(e) =>
                    setSocial({ ...social, linkedin_url: e.target.value })
                  }
                />
                <SaveBar
                  onSave={() => saveSettings('social', social)}
                  loading={savingKey === 'social'}
                />
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function SaveBar({
  onSave,
  loading,
}: {
  onSave: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--a-border)]">
      <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--a-text-3)]">
        <CheckCircle2 className="h-3 w-3" />
        Wijzigingen worden direct toegepast op de site
      </span>
      <AdminButton onClick={onSave} loading={loading}>
        <Save className="h-3.5 w-3.5" />
        Opslaan
      </AdminButton>
    </div>
  );
}
