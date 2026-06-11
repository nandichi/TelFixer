'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Container } from './container';

interface Announcement {
  enabled: boolean;
  message: string;
  link_url: string;
  link_label: string;
}

const DISMISS_KEY = 'tf_announcement_dismissed';

export function AnnouncementBar() {
  const pathname = usePathname();
  const [data, setData] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: row } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'announcement')
          .maybeSingle();
        if (!mounted) return;
        const value = row?.value as Announcement | undefined;
        if (value?.enabled && value.message?.trim()) {
          setData(value);
          const stored =
            typeof window !== 'undefined'
              ? localStorage.getItem(DISMISS_KEY)
              : null;
          setDismissed(stored === value.message.trim());
        }
      } catch {
        // Stil falen - de balk is niet kritisch
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    if (data && typeof window !== 'undefined') {
      localStorage.setItem(DISMISS_KEY, data.message.trim());
    }
  };

  if (!data || dismissed) return null;
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="relative bg-soft-black text-white">
      <Container>
        <div className="flex items-center justify-center gap-2 py-2 pr-8 text-center text-[13px] sm:text-sm">
          <span className="font-medium">{data.message}</span>
          {data.link_url && data.link_label && (
            <Link
              href={data.link_url}
              className="inline-flex items-center gap-1 font-semibold text-copper-light underline-offset-2 hover:underline whitespace-nowrap"
            >
              {data.link_label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </Container>
      <button
        onClick={dismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Sluiten"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
