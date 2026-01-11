"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Reparatie", href: "/reparatie" },
  { name: "Apparaat Inleveren", href: "/inleveren" },
  { name: "Producten", href: "/producten" },
  { name: "Over Ons", href: "/over-ons" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  { name: "Telefoons", href: "/producten?categorie=telefoons" },
  { name: "Laptops", href: "/producten?categorie=laptops" },
  { name: "Tablets", href: "/producten?categorie=tablets" },
  { name: "Accessoires", href: "/producten?categorie=accessoires" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/producten?zoek=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Handle scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-sand shadow-sm"
          : "bg-white border-b border-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/telfixer-logo.png"
              alt="TelFixer"
              width={180}
              height={72}
              className="h-10 sm:h-14 lg:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
              fetchPriority="high"
              style={{ width: "auto", height: "auto", maxHeight: "64px" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.name === "Producten" ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setProductsMenuOpen(true)}
                  onMouseLeave={() => setProductsMenuOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "text-primary bg-primary/5"
                        : "text-soft-black hover:text-primary hover:bg-champagne"
                    )}
                  >
                    {item.name}
                    <svg
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        productsMenuOpen && "rotate-180"
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>

                  {/* Dropdown */}
                  <div
                    className={cn(
                      "absolute top-full left-0 pt-2 transition-all duration-200",
                      productsMenuOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                  >
                    <div
                      className="bg-white rounded-2xl border border-sand py-3 min-w-[220px]"
                      style={{ boxShadow: "var(--shadow-lg)" }}
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-soft-black hover:bg-champagne hover:text-primary transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-copper/30" />
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-soft-black hover:text-primary hover:bg-champagne"
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label="Zoeken"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User Account */}
            <Link
              href={user ? "/account" : "/login"}
              className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label={user ? "Mijn account" : "Inloggen"}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-11 h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label={`Winkelwagen (${itemCount} items)`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-copper to-gold rounded-full">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label="Menu"
            >
              <div className="relative w-5 h-5">
                <span
                  className={cn(
                    "absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300",
                    mobileMenuOpen ? "top-[9px] rotate-45" : "top-1"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[9px] w-5 h-0.5 bg-current rounded-full transition-all duration-300",
                    mobileMenuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300",
                    mobileMenuOpen ? "top-[9px] -rotate-45" : "top-[17px]"
                  )}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-3 sm:py-4 border-t border-sand">
            <div className="flex flex-col gap-0.5 sm:gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-primary/5 text-primary"
                      : "text-soft-black hover:bg-champagne"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Category Links */}
              <div className="mt-4 pt-4 border-t border-sand">
                <p className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-widest">
                  Categorieen
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-soft-black hover:bg-champagne rounded-xl transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-copper/30" />
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Account Links */}
              <div className="mt-4 pt-4 border-t border-sand">
                <Link
                  href={user ? "/account" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-soft-black hover:bg-champagne transition-all duration-200"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {user ? "Mijn Account" : "Inloggen"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-soft-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          
          {/* Search Container */}
          <div className="relative flex items-start justify-center pt-[20vh]">
            <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl border border-sand shadow-2xl overflow-hidden">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-4 p-4 border-b border-sand">
                  <svg
                    className="h-6 w-6 text-muted shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Zoek producten..."
                    className="flex-1 text-lg text-soft-black placeholder:text-muted outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-2 rounded-lg hover:bg-champagne transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4 text-sm text-muted">
                  <p>Druk op <kbd className="px-2 py-1 bg-champagne rounded text-xs font-medium">Enter</kbd> om te zoeken of <kbd className="px-2 py-1 bg-champagne rounded text-xs font-medium">Esc</kbd> om te sluiten</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
