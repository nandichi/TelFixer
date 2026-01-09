'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { Container } from './container';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Producten', href: '/producten' },
  { name: 'Apparaat Inleveren', href: '/inleveren' },
  { name: 'Over Ons', href: '/over-ons' },
  { name: 'Contact', href: '/contact' },
];

const categories = [
  { name: 'Telefoons', href: '/producten?categorie=telefoons' },
  { name: 'Laptops', href: '/producten?categorie=laptops' },
  { name: 'Tablets', href: '/producten?categorie=tablets' },
  { name: 'Accessoires', href: '/producten?categorie=accessoires' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/telfixer-logo.png"
              alt="TelFixer"
              width={200}
              height={80}
              className="h-16 lg:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              item.name === 'Producten' ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setProductsMenuOpen(true)}
                  onMouseLeave={() => setProductsMenuOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-[#094543]'
                        : 'text-[#2C3E48] hover:text-[#094543]'
                    )}
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                  
                  {/* Dropdown */}
                  {productsMenuOpen && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px]">
                        {categories.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            className="block px-4 py-2 text-sm text-[#2C3E48] hover:bg-gray-50 hover:text-[#094543]"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-[#094543]'
                      : 'text-[#2C3E48] hover:text-[#094543]'
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Link
              href="/producten"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-[#2C3E48] hover:bg-gray-100 transition-colors"
              aria-label="Zoeken"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* User Account */}
            <Link
              href={user ? '/account' : '/login'}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-[#2C3E48] hover:bg-gray-100 transition-colors"
              aria-label={user ? 'Mijn account' : 'Inloggen'}
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#2C3E48] hover:bg-gray-100 transition-colors"
              aria-label={`Winkelwagen (${itemCount} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#094543] rounded-full">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#2C3E48] hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-[#094543]/10 text-[#094543]'
                      : 'text-[#2C3E48] hover:bg-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Category Links */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categorieen
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[#2C3E48] hover:bg-gray-100"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Account Links */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <Link
                  href={user ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium text-[#2C3E48] hover:bg-gray-100 flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  {user ? 'Mijn Account' : 'Inloggen'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
