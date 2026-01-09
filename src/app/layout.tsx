import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/components/ui/toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
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
  ],
  authors: [{ name: 'TelFixer' }],
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://telfixer.nl',
    siteName: 'TelFixer',
    title: 'TelFixer - Refurbished Elektronica & Reparatie',
    description:
      'Hoogwaardige refurbished telefoons, laptops en tablets met garantie. Lever je oude apparaat in voor een eerlijke prijs.',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
