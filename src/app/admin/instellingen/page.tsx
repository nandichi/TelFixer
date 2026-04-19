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
  Shield,
  Users,
  Instagram,
  Type,
  Plus,
  X,
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

interface WarrantySettings {
  phones_months: number;
  laptops_months: number;
  tablets_months: number;
  repairs_months: number;
  accessories_new_months: number;
  accessories_used_months: number;
  new_devices_months: number;
  battery_min_percentage: number;
  laptop_max_cycles: number;
}

interface AboutStatsSettings {
  customers: string;
  phones_sold: string;
  devices_repaired: string;
  satisfaction: string;
  ivan_photo_url: string;
}

interface InstagramSettings {
  profile_url: string;
  posts: string[];
}

interface ContentSettings {
  product_stock_label: string;
  submission_followup: string;
  checkout_dispatch: string;
}

type TabId =
  | 'company'
  | 'shipping'
  | 'tax'
  | 'social'
  | 'warranty'
  | 'about'
  | 'instagram'
  | 'content';

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
    id: 'content',
    label: 'Teksten',
    description: 'Site-teksten beheren',
    icon: Type,
  },
  {
    id: 'warranty',
    label: 'Garantie',
    description: 'Garantietermijnen instellen',
    icon: Shield,
  },
  {
    id: 'about',
    label: 'Over ons',
    description: 'Statistieken en profielfoto',
    icon: Users,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Posts in homepage feed',
    icon: Instagram,
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

  const [warranty, setWarranty] = useState<WarrantySettings>({
    phones_months: 6,
    laptops_months: 6,
    tablets_months: 6,
    repairs_months: 3,
    accessories_new_months: 24,
    accessories_used_months: 6,
    new_devices_months: 24,
    battery_min_percentage: 85,
    laptop_max_cycles: 250,
  });

  const [about, setAbout] = useState<AboutStatsSettings>({
    customers: '200+',
    phones_sold: '300+',
    devices_repaired: '400+',
    satisfaction: '98%',
    ivan_photo_url: '',
  });

  const [instagramSettings, setInstagramSettings] = useState<InstagramSettings>({
    profile_url: 'https://www.instagram.com/telfixer/',
    posts: [
      'https://www.instagram.com/p/DQEN97EDEMK/',
      'https://www.instagram.com/p/DRW2A48DOUc/',
      'https://www.instagram.com/p/DSFJYuhjKYs/',
    ],
  });

  const [content, setContent] = useState<ContentSettings>({
    product_stock_label: 'Direct uit voorraad leverbaar',
    submission_followup:
      'Je ontvangt binnen 2 werkdagen een prijsaanbod per e-mail en WhatsApp. Als je akkoord gaat, ontvang je gratis verzendlabels om het apparaat naar ons toe te sturen.',
    checkout_dispatch: 'Je bestelling wordt zo snel mogelijk verzonden',
  });

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
        if (item.key === 'warranty' && item.value)
          setWarranty((p) => ({ ...p, ...item.value }));
        if (item.key === 'about_stats' && item.value)
          setAbout((p) => ({ ...p, ...item.value }));
        if (item.key === 'instagram' && item.value)
          setInstagramSettings((p) => ({
            ...p,
            ...item.value,
            posts:
              Array.isArray(item.value.posts) && item.value.posts.length > 0
                ? item.value.posts
                : p.posts,
          }));
        if (item.key === 'content' && item.value)
          setContent((p) => ({ ...p, ...item.value }));
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

          {activeTab === 'content' && (
            <Section
              title="Site-teksten"
              description="Pas teksten aan die op verschillende pagina's worden getoond"
              action={<Type className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <AdminInput
                  label="Voorraadlabel productpagina"
                  hint="Wordt getoond bij producten die op voorraad zijn"
                  placeholder="bijv. Direct uit voorraad leverbaar"
                  value={content.product_stock_label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      product_stock_label: e.target.value,
                    })
                  }
                />
                <AdminTextarea
                  label="Tekst na inlevering"
                  hint="Verschijnt op /inleveren bij stap 'Wat gebeurt er na het indienen?'"
                  rows={4}
                  value={content.submission_followup}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      submission_followup: e.target.value,
                    })
                  }
                />
                <AdminInput
                  label="Verzending-tekst checkout-bevestiging"
                  hint="Bijv. 'Je bestelling wordt zo snel mogelijk verzonden'"
                  value={content.checkout_dispatch}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      checkout_dispatch: e.target.value,
                    })
                  }
                />
                <SaveBar
                  onSave={() => saveSettings('content', content)}
                  loading={savingKey === 'content'}
                />
              </div>
            </Section>
          )}

          {activeTab === 'warranty' && (
            <Section
              title="Garantietermijnen"
              description="Wordt gebruikt op /garantie en /faq"
              action={<Shield className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="Refurbished telefoons"
                    type="number"
                    suffix="mnd"
                    value={warranty.phones_months}
                    onChange={(e) =>
                      setWarranty({
                        ...warranty,
                        phones_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="Refurbished laptops"
                    type="number"
                    suffix="mnd"
                    value={warranty.laptops_months}
                    onChange={(e) =>
                      setWarranty({
                        ...warranty,
                        laptops_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="Refurbished tablets"
                    type="number"
                    suffix="mnd"
                    value={warranty.tablets_months}
                    onChange={(e) =>
                      setWarranty({
                        ...warranty,
                        tablets_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="Reparaties"
                    type="number"
                    suffix="mnd"
                    value={warranty.repairs_months}
                    onChange={(e) =>
                      setWarranty({
                        ...warranty,
                        repairs_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="Accessoires (nieuw)"
                    type="number"
                    suffix="mnd"
                    value={warranty.accessories_new_months}
                    onChange={(e) =>
                      setWarranty({
                        ...warranty,
                        accessories_new_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="Accessoires (gebruikt)"
                    type="number"
                    suffix="mnd"
                    value={warranty.accessories_used_months}
                    onChange={(e) =>
                      setWarranty({
                        ...warranty,
                        accessories_used_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="Nieuwe apparaten"
                    type="number"
                    suffix="mnd"
                    value={warranty.new_devices_months}
                    onChange={(e) =>
                      setWarranty({
                        ...warranty,
                        new_devices_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="pt-3 border-t border-[var(--a-border)]">
                  <h3 className="text-[13px] font-semibold text-[var(--a-text)] mb-3">
                    Batterij &amp; cycli (refurbished)
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <AdminInput
                      label="Min. batterijcapaciteit telefoons"
                      type="number"
                      suffix="%"
                      value={warranty.battery_min_percentage}
                      onChange={(e) =>
                        setWarranty({
                          ...warranty,
                          battery_min_percentage:
                            parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <AdminInput
                      label="Max. laadcycli laptops"
                      type="number"
                      value={warranty.laptop_max_cycles}
                      onChange={(e) =>
                        setWarranty({
                          ...warranty,
                          laptop_max_cycles: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <SaveBar
                  onSave={() => saveSettings('warranty', warranty)}
                  loading={savingKey === 'warranty'}
                />
              </div>
            </Section>
          )}

          {activeTab === 'about' && (
            <Section
              title="Over ons - statistieken"
              description="Wordt getoond op /over-ons"
              action={<Users className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="Tevreden klanten"
                    placeholder="bijv. 200+"
                    value={about.customers}
                    onChange={(e) =>
                      setAbout({ ...about, customers: e.target.value })
                    }
                  />
                  <AdminInput
                    label="Telefoons verkocht"
                    placeholder="bijv. 300+"
                    value={about.phones_sold}
                    onChange={(e) =>
                      setAbout({ ...about, phones_sold: e.target.value })
                    }
                  />
                  <AdminInput
                    label="Apparaten gerepareerd"
                    placeholder="bijv. 400+"
                    value={about.devices_repaired}
                    onChange={(e) =>
                      setAbout({ ...about, devices_repaired: e.target.value })
                    }
                  />
                  <AdminInput
                    label="Klanttevredenheid"
                    placeholder="bijv. 98%"
                    value={about.satisfaction}
                    onChange={(e) =>
                      setAbout({ ...about, satisfaction: e.target.value })
                    }
                  />
                </div>
                <div className="pt-3 border-t border-[var(--a-border)]">
                  <h3 className="text-[13px] font-semibold text-[var(--a-text)] mb-3">
                    Profielfoto Ivan
                  </h3>
                  <AdminInput
                    label="Foto-URL"
                    placeholder="https://..."
                    hint="Plak hier een URL naar een profielfoto. Laat leeg om de IP-placeholder te tonen."
                    value={about.ivan_photo_url}
                    onChange={(e) =>
                      setAbout({ ...about, ivan_photo_url: e.target.value })
                    }
                  />
                  {about.ivan_photo_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={about.ivan_photo_url}
                      alt="Voorbeeld profielfoto"
                      className="mt-3 w-24 h-24 rounded-full object-cover border border-[var(--a-border)]"
                    />
                  )}
                </div>
                <SaveBar
                  onSave={() => saveSettings('about_stats', about)}
                  loading={savingKey === 'about_stats'}
                />
              </div>
            </Section>
          )}

          {activeTab === 'instagram' && (
            <Section
              title="Instagram-feed"
              description="Beheer welke posts op de homepage worden getoond"
              action={<Instagram className="h-4 w-4 text-[var(--a-text-3)]" />}
            >
              <div className="space-y-3.5">
                <AdminInput
                  label="Profiel-URL"
                  placeholder="https://www.instagram.com/telfixer/"
                  value={instagramSettings.profile_url}
                  onChange={(e) =>
                    setInstagramSettings({
                      ...instagramSettings,
                      profile_url: e.target.value,
                    })
                  }
                />
                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-[var(--a-text-2)]">
                    Post-URLs
                  </label>
                  <p className="text-[11.5px] text-[var(--a-text-3)] -mt-1">
                    Plak hier de volledige URL van een Instagram-post (bijv.
                    https://www.instagram.com/p/XXXXXX/).
                  </p>
                  <div className="space-y-2">
                    {instagramSettings.posts.map((post, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex-1">
                          <AdminInput
                            placeholder="https://www.instagram.com/p/..."
                            value={post}
                            onChange={(e) => {
                              const next = [...instagramSettings.posts];
                              next[idx] = e.target.value;
                              setInstagramSettings({
                                ...instagramSettings,
                                posts: next,
                              });
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = instagramSettings.posts.filter(
                              (_, i) => i !== idx
                            );
                            setInstagramSettings({
                              ...instagramSettings,
                              posts: next,
                            });
                          }}
                          className="p-2 text-[var(--a-text-3)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)] rounded-md transition-colors"
                          aria-label="Verwijder post"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setInstagramSettings({
                        ...instagramSettings,
                        posts: [...instagramSettings.posts, ''],
                      })
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Post toevoegen
                  </AdminButton>
                </div>
                <SaveBar
                  onSave={() =>
                    saveSettings('instagram', {
                      profile_url: instagramSettings.profile_url,
                      posts: instagramSettings.posts.filter(
                        (p) => p.trim() !== ''
                      ),
                    })
                  }
                  loading={savingKey === 'instagram'}
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
