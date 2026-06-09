"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  X,
  ArrowRight,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Wrench,
  Package,
  type LucideIcon,
} from "lucide-react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

const EASE = [0.22, 1, 0.36, 1] as const;

const navigation = [
  { name: "Home", href: "/" },
  { name: "Reparatie", href: "/reparatie" },
  { name: "Apparaat Inleveren", href: "/inleveren" },
  { name: "Producten", href: "/producten" },
  { name: "Over Ons", href: "/over-ons" },
  { name: "Contact", href: "/contact" },
];

const categories: { name: string; href: string; icon: LucideIcon }[] = [
  { name: "Telefoons", href: "/producten?categorie=telefoons", icon: Smartphone },
  { name: "Laptops", href: "/producten?categorie=laptops", icon: Laptop },
  { name: "Tablets", href: "/producten?categorie=tablets", icon: Tablet },
  { name: "Accessoires", href: "/producten?categorie=accessoires", icon: Headphones },
];

const quickSearches = ["iPhone 15", "Samsung Galaxy", "MacBook", "iPad"];

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
  const shouldReduceMotion = useReducedMotion();

  // Focus zoekveld zodra de modal opent
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Escape sluit zoekmodal en mobiel menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll-lock wanneer mobiel menu of zoekmodal open is
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, searchOpen]);

  // Menu sluiten bij navigatie
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/producten?zoek=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const goToQuickSearch = (term: string) => {
    router.push(`/producten?zoek=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Glas-effect bij scrollen
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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
          ? "bg-white/85 backdrop-blur-xl border-b border-sand shadow-sm"
          : "bg-white border-b border-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 sm:h-20 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0" aria-label="TelFixer home">
            <Image
              src="/telfixer-logo.png"
              alt="TelFixer"
              width={180}
              height={72}
              className="h-10 sm:h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
              fetchPriority="high"
              style={{ width: "auto", height: "auto", maxHeight: "56px" }}
            />
          </Link>

          {/* Desktop navigatie */}
          <div className="hidden lg:flex items-center gap-0.5">
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
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        productsMenuOpen && "rotate-180"
                      )}
                      strokeWidth={2}
                    />
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {productsMenuOpen && (
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="absolute top-full left-0 pt-2"
                      >
                        <div
                          className="bg-white rounded-2xl border border-sand p-2 min-w-[240px]"
                          style={{ boxShadow: "var(--shadow-lg)" }}
                        >
                          {categories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="group/item flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-soft-black hover:bg-champagne hover:text-primary transition-colors"
                            >
                              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-cream text-primary group-hover/item:bg-white transition-colors">
                                <cat.icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                              </span>
                              <span className="font-medium">{cat.name}</span>
                              <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

          {/* Acties rechts */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label="Zoeken"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <Link
              href={user ? "/account" : "/login"}
              className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label={user ? "Mijn account" : "Inloggen"}
            >
              <User className="h-5 w-5" strokeWidth={1.75} />
            </Link>

            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label={`Winkelwagen (${itemCount} items)`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-copper to-gold rounded-full">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-soft-black hover:text-primary hover:bg-champagne transition-all duration-200"
              aria-label={mobileMenuOpen ? "Menu sluiten" : "Menu openen"}
              aria-expanded={mobileMenuOpen}
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
      </Container>

      {/* Mobiel menu: full-screen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 z-40 bg-white overflow-y-auto overscroll-contain"
          >
            <Container>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                }}
                className="py-6 pb-12"
              >
                {/* Hoofdnavigatie */}
                <div className="flex flex-col">
                  {navigation.map((item) => (
                    <motion.div
                      key={item.name}
                      variants={{
                        hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-4 rounded-2xl text-xl font-display font-semibold transition-all duration-200",
                          isActive(item.href)
                            ? "bg-primary/5 text-primary"
                            : "text-soft-black hover:bg-champagne active:bg-champagne"
                        )}
                      >
                        {item.name}
                        <ArrowRight className="w-5 h-5 opacity-30" strokeWidth={1.75} />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Categorieen */}
                <motion.div
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                  className="mt-6 pt-6 border-t border-sand"
                >
                  <p className="px-4 pb-3 text-xs font-semibold text-muted uppercase tracking-widest">
                    Categorieen
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-cream text-soft-black hover:bg-champagne active:bg-champagne transition-colors"
                      >
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-primary shrink-0">
                          <cat.icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                        </span>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Snelle acties */}
                <motion.div
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                  className="mt-6 pt-6 border-t border-sand space-y-2"
                >
                  <Link
                    href="/reparatie"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-primary text-white font-medium active:scale-[0.99] transition-transform"
                  >
                    <Wrench className="w-5 h-5" strokeWidth={1.75} />
                    Plan een reparatie
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                  <Link
                    href="/inleveren"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl border border-sand text-soft-black font-medium hover:bg-champagne active:bg-champagne transition-colors"
                  >
                    <Package className="w-5 h-5 text-copper" strokeWidth={1.75} />
                    Apparaat inleveren
                    <ArrowRight className="w-4 h-4 ml-auto opacity-40" />
                  </Link>
                  <Link
                    href={user ? "/account" : "/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl border border-sand text-soft-black font-medium hover:bg-champagne active:bg-champagne transition-colors"
                  >
                    <User className="w-5 h-5 text-primary" strokeWidth={1.75} />
                    {user ? "Mijn account" : "Inloggen"}
                    <ArrowRight className="w-4 h-4 ml-auto opacity-40" />
                  </Link>
                </motion.div>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoekmodal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-soft-black/50 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />

            <div className="relative flex items-start justify-center pt-[12vh] sm:pt-[18vh] px-4">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-sand shadow-2xl overflow-hidden"
              >
                <form onSubmit={handleSearch}>
                  <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border-b border-sand">
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 text-muted shrink-0" strokeWidth={1.75} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek producten..."
                      className="flex-1 min-w-0 text-base sm:text-lg text-soft-black placeholder:text-muted outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 rounded-lg hover:bg-champagne transition-colors shrink-0"
                      aria-label="Zoeken sluiten"
                    >
                      <X className="h-5 w-5 text-muted" strokeWidth={1.75} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                      Populaire zoekopdrachten
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => goToQuickSearch(term)}
                          className="px-4 py-2 rounded-full bg-cream border border-sand text-sm text-soft-black hover:border-primary hover:text-primary transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                    <p className="hidden sm:block mt-4 text-sm text-muted">
                      Druk op{" "}
                      <kbd className="px-2 py-1 bg-champagne rounded text-xs font-medium">
                        Enter
                      </kbd>{" "}
                      om te zoeken of{" "}
                      <kbd className="px-2 py-1 bg-champagne rounded text-xs font-medium">
                        Esc
                      </kbd>{" "}
                      om te sluiten
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
