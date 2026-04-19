import type { Metadata } from 'next';
import { Manrope, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/components/ui/toast';
import { WebMcpProvider } from '@/components/agent/webmcp-provider';

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://telfixer.nl'),
  title: {
    default: 'TelFixer - Refurbished Elektronica & Reparatie',
    template: '%s | TelFixer',
  },
  description:
    'TelFixer is jouw betrouwbare partner voor hoogwaardige refurbished telefoons, laptops en tablets. Lever je oude apparaat in of koop kwaliteit met garantie.',
  keywords: [
    'refurbished',
    'telefoon',
    'laptop',
    'tablet',
    'reparatie',
    'inleveren',
    'tweedehands',
    'Apple',
    'Samsung',
    'iPhone',
    'MacBook',
    'TelFixer',
    'refurbished telefoon kopen',
    'tweedehands telefoon',
    'telefoon inleveren',
    'garantie',
  ],
  authors: [{ name: 'TelFixer' }],
  creator: 'TelFixer',
  publisher: 'TelFixer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://telfixer.nl',
    siteName: 'TelFixer',
    title: 'TelFixer - Refurbished Elektronica & Reparatie',
    description:
      'Hoogwaardige refurbished telefoons, laptops en tablets met garantie. Lever je oude apparaat in voor een eerlijke prijs.',
    images: [
      {
        url: '/telfixer-logo.png',
        width: 800,
        height: 600,
        alt: 'TelFixer Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TelFixer - Refurbished Elektronica & Reparatie',
    description:
      'Hoogwaardige refurbished telefoons, laptops en tablets met garantie. Lever je oude apparaat in voor een eerlijke prijs.',
    images: ['/telfixer-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${manrope.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-cream`}
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <WhatsAppFloat />
              <WebMcpProvider />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
