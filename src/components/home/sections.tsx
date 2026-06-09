"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  RotateCcw,
  Check,
  ArrowRight,
  Wrench,
  Clock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================
   Reparatieservice
   ============================================ */

const repairPoints: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: "3 maanden garantie op elke reparatie" },
  { icon: Clock, text: "De meeste reparaties binnen 24 uur klaar" },
  { icon: Sparkles, text: "Originele of hoogwaardige onderdelen" },
  { icon: Truck, text: "Gratis ophaal- en brengdienst" },
];

export function RepairSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Beeld */}
          <Reveal direction="right" className="relative">
            {/* Accentvlak achter het beeld */}
            <div
              className="absolute -bottom-5 -left-5 sm:-bottom-7 sm:-left-7 w-2/3 h-2/3 rounded-[2.5rem] bg-champagne"
              aria-hidden="true"
            />

            <div className="relative aspect-[4/3] rounded-3xl sm:rounded-[2.5rem] overflow-hidden img-zoom-container">
              <Image
                src="/images/home/reparatie.jpg"
                alt="Technicus vervangt vakkundig het scherm van een iPhone"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover img-zoom"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-soft-black/30 to-transparent"
                aria-hidden="true"
              />

              {/* Glas-chip */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shrink-0">
                    <Clock className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-soft-black">
                      Vaak dezelfde dag klaar
                    </p>
                    <p className="text-xs text-slate">
                      Direct online ingepland
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tekst */}
          <div>
            <Reveal>
              <span className="inline-block text-eyebrow mb-4">
                Reparatieservice
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black mb-5">
                Kapot toestel? Vaak dezelfde dag gemaakt.
              </h2>
              <p className="text-lg text-slate leading-relaxed mb-8 max-w-lg">
                Van een gebarsten scherm tot een zwakke batterij. Kies je
                apparaat, zie direct de prijs en plan online een afspraak die
                jou uitkomt.
              </p>
            </Reveal>

            <RevealGroup stagger={0.08} className="space-y-4 mb-10">
              {repairPoints.map((point) => (
                <RevealItem key={point.text}>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/5 text-primary shrink-0">
                      <point.icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-base text-soft-black">
                      {point.text}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal>
              <Link href="/reparatie">
                <Button size="lg" className="gap-3 group">
                  Plan je reparatie
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================
   Hoe het werkt
   ============================================ */

const steps = [
  {
    number: "01",
    title: "Kies je toestel",
    description:
      "Blader door onze collectie refurbished telefoons, laptops en tablets. Elk toestel met eerlijke conditieomschrijving.",
  },
  {
    number: "02",
    title: "Wij maken hem klaar",
    description:
      "Elk apparaat wordt vakkundig gerepareerd, volledig getest en gereinigd voordat het naar jou gaat.",
  },
  {
    number: "03",
    title: "Snel in huis",
    description:
      "Thuisbezorgd met track en trace. Niet helemaal tevreden? Je hebt 14 dagen bedenktijd.",
  },
];

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-soft-black relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-copper/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <Container>
        <Reveal className="relative text-center mb-14 sm:mb-20">
          <span className="inline-block text-eyebrow mb-4">
            Zo werkt het
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
            In drie stappen geregeld
          </h2>
        </Reveal>

        <div className="relative">
          {/* Geanimeerde verbindingslijn */}
          <div
            className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
              className="w-full h-full origin-left bg-gradient-to-r from-primary-light via-copper to-gold opacity-40"
            />
          </div>

          <RevealGroup
            stagger={0.14}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
          >
            {steps.map((step) => (
              <RevealItem key={step.number} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-soft-black border border-white/15 mb-7">
                  <span className="text-2xl font-display font-bold text-gradient-copper">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-on-dark-subtle leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}

/* ============================================
   Inleveren
   ============================================ */

const sellPoints = [
  "Gratis waardebepaling",
  "Eerlijke prijzen",
  "Snelle uitbetaling",
  "Milieuvriendelijk",
];

export function SellDeviceCta() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-cream">
      <Container>
        <Reveal>
          <div className="relative rounded-3xl sm:rounded-[3rem] overflow-hidden bg-soft-black">
            <div className="grid lg:grid-cols-2">
              {/* Tekst */}
              <div className="relative z-10 p-7 sm:p-12 lg:p-16">
                <span className="inline-block text-eyebrow mb-4 sm:mb-6">
                  Inleveren
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-5">
                  Oud toestel? Wij geven het een tweede leven.
                </h2>
                <p className="text-base sm:text-lg text-on-dark-muted mb-8 leading-relaxed max-w-lg">
                  Lever je oude telefoon, laptop of tablet in en ontvang een
                  eerlijk bod. Wij zorgen voor duurzame verwerking of een
                  tweede leven.
                </p>

                <ul className="grid sm:grid-cols-2 gap-3.5 mb-10 max-w-lg">
                  {sellPoints.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm sm:text-base text-white"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-copper to-gold shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/inleveren">
                  <Button size="lg" variant="copper" className="gap-3 group">
                    Start waardebepaling
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Beeld */}
              <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-0">
                <Image
                  src="/images/home/inleveren.jpg"
                  alt="Samsung Galaxy S23 Ultra klaar om ingeleverd te worden"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-soft-black via-soft-black/20 to-transparent lg:bg-gradient-to-r lg:from-soft-black lg:via-soft-black/25 lg:to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ============================================
   Waarom TelFixer
   ============================================ */

const trustItems: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldCheck,
    title: "6 maanden garantie",
    description: "Op al onze refurbished toestellen, voor jouw gemoedsrust.",
  },
  {
    icon: BadgeCheck,
    title: "Gecertificeerde kwaliteit",
    description: "Elk apparaat wordt grondig getest voor verzending.",
  },
  {
    icon: Truck,
    title: "Snelle levering",
    description: "Zo snel mogelijk thuisbezorgd met track en trace.",
  },
  {
    icon: RotateCcw,
    title: "14 dagen bedenktijd",
    description: "Niet tevreden? Retourneer eenvoudig binnen 14 dagen.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <Container>
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-eyebrow mb-4">
            Onze belofte
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black">
            Waarom kiezen voor TelFixer
          </h2>
        </Reveal>

        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 lg:divide-x lg:divide-sand"
        >
          {trustItems.map((item) => (
            <RevealItem key={item.title} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 text-primary mb-5">
                  <item.icon className="w-7 h-7" strokeWidth={1.5} />
                </span>
                <h3 className="text-lg sm:text-xl font-display font-semibold text-soft-black mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

/* ============================================
   Eind-CTA
   ============================================ */

export function FinalCta() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-primary-dark">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />
        <div className="absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-primary-light/25 blur-3xl" />
        <div className="absolute -bottom-40 right-1/5 w-[420px] h-[420px] rounded-full bg-copper/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />
      </div>

      <Container>
        <div className="relative text-center max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Kwaliteit waar je{" "}
              <em className="not-italic text-gradient-copper">van lacht</em>
            </h2>
            <p className="text-lg sm:text-xl text-on-dark-muted mb-10 max-w-xl mx-auto">
              Vind jouw refurbished toestel of plan vandaag nog een reparatie.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/producten"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-primary-dark text-lg font-semibold transition-all duration-300 hover:bg-cream hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] w-full sm:w-auto"
              >
                Bekijk producten
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/reparatie"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/30 text-white text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/50 active:scale-[0.98] w-full sm:w-auto"
              >
                <Wrench className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                Plan een reparatie
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
