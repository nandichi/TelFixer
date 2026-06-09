"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1] as const;

const trustPoints = [
  { text: "6 maanden garantie", icon: ShieldCheck },
  { text: "Gratis verzending vanaf 50 euro", icon: Truck },
  { text: "14 dagen bedenktijd", icon: RotateCcw },
  { text: "Gecertificeerde kwaliteit", icon: BadgeCheck },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const float = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          y: [0, -12, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Achtergrond: zachte gradient-orbs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 right-0 w-[820px] h-[820px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-[620px] h-[620px] bg-gradient-to-tr from-copper/10 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"
        />
        <div className="absolute inset-0 opacity-[0.4] [background-image:radial-gradient(var(--color-sand)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      <Container>
        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-12 items-center py-12 sm:py-16 lg:py-24 lg:min-h-[88vh]">
          {/* Tekstkolom */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-7 lg:pr-6"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-primary/10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-copper opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-copper" />
                </span>
                <span className="text-sm font-medium text-primary">
                  Kwaliteit waar je van lacht
                </span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-soft-black leading-[1.05] tracking-tight"
            >
              Gerepareerde
              <br />
              <span className="text-gradient-primary">telefoons</span> met
              <br />
              echte garantie
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-slate max-w-xl leading-relaxed"
            >
              Bespaar tot 40% op vakkundig gerepareerde telefoons. Elk apparaat
              wordt gerepareerd, getest en gereinigd, en geleverd met 6 maanden
              garantie.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/producten">
                <Button size="lg" className="gap-3 w-full sm:w-auto group">
                  Bekijk producten
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/inleveren">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-3 w-full sm:w-auto"
                >
                  Apparaat inleveren
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl"
            >
              {trustPoints.map((point) => (
                <div
                  key={point.text}
                  className="flex items-center gap-3 text-sm text-slate"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/5 text-primary flex-shrink-0">
                    <point.icon className="w-[18px] h-[18px]" />
                  </span>
                  <span>{point.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visuele kolom: premium telefoon-mockup */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.92, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Glow achter het toestel */}
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] rounded-full bg-gradient-to-br from-primary/25 via-copper/15 to-gold/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="absolute -inset-6 lg:-inset-10 rounded-[4rem] bg-gradient-to-br from-primary/10 via-transparent to-copper/10 blur-2xl" />

              {/* Toestel */}
              <div className="relative w-[220px] h-[440px] sm:w-[280px] sm:h-[560px] lg:w-[320px] lg:h-[640px]">
                <div className="absolute inset-0 bg-gradient-to-br from-soft-black/30 to-charcoal/20 rounded-[3rem] blur-xl translate-y-5 translate-x-2" />

                <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-soft-black to-charcoal rounded-[3rem] p-[3px] shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2.8rem] p-2 relative overflow-hidden">
                    {/* Zijknoppen */}
                    <div className="absolute left-0 top-24 w-[3px] h-12 bg-charcoal rounded-r-sm" />
                    <div className="absolute left-0 top-40 w-[3px] h-8 bg-charcoal rounded-r-sm" />
                    <div className="absolute right-0 top-32 w-[3px] h-16 bg-charcoal rounded-l-sm" />

                    {/* Scherm */}
                    <div className="w-full h-full bg-gradient-to-br from-cream via-[#f3ece2] to-champagne rounded-[2.4rem] overflow-hidden relative">
                      {/* Dynamic island */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-soft-black rounded-full flex items-center justify-center gap-2 z-10">
                        <div className="w-2 h-2 rounded-full bg-charcoal" />
                        <div className="w-3 h-3 rounded-full bg-charcoal/80 ring-1 ring-charcoal/50" />
                      </div>

                      <div className="absolute inset-0 pt-14 px-5 pb-8 flex flex-col">
                        <div className="flex items-center justify-between text-[11px] text-soft-black/60 px-1 mb-6">
                          <span className="font-semibold">9:41</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">5G</span>
                            <div className="w-6 h-3 rounded-[3px] border border-soft-black/40 relative">
                              <div className="absolute inset-[1.5px] right-1.5 bg-soft-black/50 rounded-[1px]" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center space-y-5">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.4rem] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
                            <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
                          </div>

                          <div className="text-center space-y-1">
                            <p className="text-base sm:text-lg font-display font-bold text-soft-black">
                              TelFixer
                            </p>
                            <p className="text-[11px] sm:text-xs text-muted">
                              Kwaliteit waar je van lacht
                            </p>
                          </div>

                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm w-full max-w-[200px] border border-white/60">
                            <div className="text-center">
                              <div className="text-3xl font-display font-bold text-gradient-primary">
                                40%
                              </div>
                              <div className="text-[11px] text-muted mt-1">
                                Besparing t.o.v. nieuw
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-copper">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>

                        <div className="w-28 h-1 bg-soft-black/20 rounded-full mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zwevende kaart: garantie */}
                <motion.div
                  animate={float(0)}
                  className="hidden sm:flex flex-col absolute -top-4 -right-8 lg:-top-6 lg:-right-14 w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-copper to-gold p-4 text-white shadow-xl"
                >
                  <ShieldCheck className="w-7 h-7 lg:w-8 lg:h-8 mb-1" strokeWidth={1.5} />
                  <span className="text-[10px] lg:text-xs font-medium leading-tight mt-auto">
                    Garantie
                    <br />6 maanden
                  </span>
                </motion.div>

                {/* Zwevende kaart: gratis verzending */}
                <motion.div
                  animate={float(1.2)}
                  className="hidden sm:flex flex-col absolute -bottom-4 -left-8 lg:-bottom-6 lg:-left-14 w-22 h-22 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-light p-4 text-white shadow-xl"
                >
                  <Truck className="w-6 h-6 lg:w-7 lg:h-7 mb-1" strokeWidth={1.5} />
                  <span className="text-[10px] lg:text-xs font-medium leading-tight mt-auto">
                    Gratis
                    <br />verzending
                  </span>
                </motion.div>

                {/* Zwevende kaart: bedenktijd */}
                <motion.div
                  animate={float(2.2)}
                  className="hidden sm:flex flex-col absolute top-1/3 -left-6 lg:-left-12 w-18 h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] p-3 text-white shadow-xl"
                >
                  <RotateCcw className="w-5 h-5 lg:w-6 lg:h-6 mb-0.5" strokeWidth={1.5} />
                  <span className="text-[9px] lg:text-[10px] font-medium leading-tight mt-auto">
                    14 dagen
                    <br />bedenktijd
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
