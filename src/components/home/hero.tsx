"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Wrench,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";

const EASE = [0.22, 1, 0.36, 1] as const;

const uspItems = [
  { icon: ShieldCheck, text: "12 maanden garantie" },
  { icon: Truck, text: "Gratis verzending vanaf 50 euro" },
  { icon: RotateCcw, text: "14 dagen bedenktijd" },
  { icon: BadgeCheck, text: "Gerepareerd, getest en gereinigd" },
  { icon: Wrench, text: "Reparatie vaak dezelfde dag klaar" },
  { icon: Sparkles, text: "Kwaliteit waar je van lacht" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const yMain = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : -56]
  );
  const ySecondary = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : 44]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-soft-black"
    >
      {/* Achtergrond: diepe teal-gradient met subtiele gloed */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
        <div className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 w-[520px] h-[520px] rounded-full bg-copper/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_65%)]" />
      </div>

      <Container>
        <div className="relative grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-10 items-center pt-10 pb-12 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16">
          {/* Tekstkolom */}
          <motion.div
            variants={containerVariants}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate="visible"
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-copper-light opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-copper-light" />
                </span>
                <span className="text-sm font-medium text-on-dark-muted">
                  Refurbished en reparatie specialist
                </span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="heading-balance text-5xl sm:text-6xl lg:text-[4.25rem] xl:text-7xl font-display font-bold text-white leading-[1.04] tracking-tight"
            >
              Als nieuw.
              <br />
              Alleen de{" "}
              <em className="not-italic text-gradient-copper">prijs</em>
              <br />
              is anders.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-on-dark-muted max-w-md leading-relaxed"
            >
              Vakkundig gerepareerde iPhones en Samsungs, volledig getest en
              gereinigd. Geleverd met 12 maanden garantie, tot 40% voordeliger
              dan nieuw.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/producten"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-soft-black text-lg font-semibold transition-all duration-300 hover:bg-cream hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
              >
                Shop telefoons
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/reparatie"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/25 text-white text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/40 active:scale-[0.98]"
              >
                <Wrench className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                Plan een reparatie
              </Link>
            </motion.div>
          </motion.div>

          {/* Visuele kolom: echte toestellen */}
          <div className="relative h-[440px] sm:h-[540px] lg:h-[620px]">
            {/* Gloed achter de beelden */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-light/30 via-copper/10 to-transparent blur-3xl" />
            </div>

            {/* Hoofdbeeld: iPhone 15 Pro Max */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 48, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.25, ease: EASE }}
              style={{ y: yMain }}
              className="absolute right-0 top-0 w-[66%] h-full z-10"
            >
              <div className="relative w-full h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden ring-1 ring-white/15 shadow-2xl">
                <Image
                  src="/images/home/hero-iphone.jpg"
                  alt="Refurbished iPhone 15 Pro Max in natural titanium"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 66vw, 33vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-soft-black/45 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Glas-chip: garantie */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
                  className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-auto"
                >
                  <div className="inline-flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 shadow-lg">
                    <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white text-primary shrink-0">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                        12 maanden garantie
                      </p>
                      <p className="text-[10px] sm:text-xs text-on-dark-muted whitespace-nowrap">
                        Op al onze toestellen
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Tweede beeld: Samsung Galaxy S24 Ultra */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: -40, rotate: -6 }
              }
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ duration: 1, delay: 0.5, ease: EASE }}
              style={{ y: ySecondary }}
              className="absolute left-0 bottom-6 sm:bottom-8 w-[46%] sm:w-[44%] z-20"
            >
              <div className="relative aspect-[3/4] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-2xl">
                <Image
                  src="/images/home/hero-samsung.jpg"
                  alt="Refurbished Samsung Galaxy S24 Ultra in titanium"
                  fill
                  priority
                  sizes="(max-width: 1024px) 46vw, 22vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-soft-black/40 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Chip: besparing */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
                  className="absolute top-3 left-3 sm:top-4 sm:left-4"
                >
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-copper to-gold text-white text-xs sm:text-sm font-bold shadow-lg">
                    Tot 40% voordeliger
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* USP-marquee */}
      <div className="relative border-t border-white/10 bg-white/[0.03]">
        <div
          className="overflow-hidden py-4"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center shrink-0"
                aria-hidden={copy === 1}
              >
                {uspItems.map((item) => (
                  <span
                    key={`${copy}-${item.text}`}
                    className="flex items-center gap-2.5 px-8 text-sm text-on-dark-subtle whitespace-nowrap"
                  >
                    <item.icon
                      className="w-4 h-4 text-copper-light shrink-0"
                      strokeWidth={1.75}
                    />
                    {item.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
