"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  RotateCcw,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const steps = [
  {
    number: "01",
    title: "Kies je apparaat",
    description:
      "Blader door onze collectie vakkundig gerepareerde telefoons of lever je oude apparaat in.",
  },
  {
    number: "02",
    title: "Kwaliteitsgarantie",
    description:
      "Elk apparaat wordt gerepareerd, getest en gereinigd. Je ontvangt een product in topconditie.",
  },
  {
    number: "03",
    title: "Snelle levering",
    description:
      "Na betaling wordt je bestelling zo snel mogelijk thuisbezorgd met track & trace.",
  },
];

const trustItems: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldCheck,
    title: "6 Maanden Garantie",
    description: "Op al onze gerepareerde telefoons voor jouw gemoedsrust",
  },
  {
    icon: BadgeCheck,
    title: "Gecertificeerde Kwaliteit",
    description: "Elk apparaat wordt grondig getest voor verzending",
  },
  {
    icon: Truck,
    title: "Snelle Levering",
    description: "Zo snel mogelijk thuisbezorgd met track & trace",
  },
  {
    icon: RotateCcw,
    title: "14 Dagen Bedenktijd",
    description: "Niet tevreden? Retourneer binnen 14 dagen",
  },
];

const sellPoints = [
  "Gratis waardebepaling",
  "Eerlijke prijzen",
  "Snelle uitbetaling",
  "Milieuvriendelijk",
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-soft-black relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-copper/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <Container>
        <Reveal className="relative text-center mb-12 sm:mb-20">
          <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
            Proces
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
            Hoe werkt het?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            In 3 simpele stappen naar jouw gerepareerde telefoon
          </p>
        </Reveal>

        <div className="relative">
          <div className="hidden md:block absolute top-16 left-[25%] right-[25%] h-[2px] pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-primary via-copper to-gold opacity-30" />
          </div>

          <RevealGroup
            stagger={0.12}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps.map((step) => (
              <RevealItem key={step.number} className="relative text-center">
                <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 mb-5 sm:mb-8 backdrop-blur-sm">
                  <span className="text-3xl sm:text-5xl font-display font-bold text-gradient-copper">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-semibold text-white mb-3 sm:mb-4">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-sm mx-auto">
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

export function SellDeviceCta() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <Container>
        <Reveal>
          <div className="relative rounded-2xl sm:rounded-[3rem] overflow-hidden bg-gradient-to-br from-soft-black to-charcoal">
            <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-6 sm:p-10 lg:p-16">
                <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4 sm:mb-6">
                  Inleveren
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                  Heb je een oud apparaat?
                </h2>
                <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 leading-relaxed">
                  Lever je oude telefoon, laptop of tablet in en ontvang een
                  eerlijk bod. Wij zorgen voor duurzame verwerking of geven het
                  apparaat een tweede leven.
                </p>
                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {sellPoints.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-white"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-copper to-gold flex-shrink-0">
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

              <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-copper/10 to-transparent">
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-copper/20 to-gold/20 flex items-center justify-center"
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-copper to-gold flex items-center justify-center shadow-xl">
                      <RotateCcw className="w-16 h-16 text-white" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
                    <span className="text-2xl font-display font-bold text-white">
                      +
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-cream">
      <Container>
        <Reveal className="text-center mb-10 sm:mb-16">
          <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
            Waarom TelFixer
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black">
            Waarom kiezen voor ons?
          </h2>
        </Reveal>

        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
        >
          {trustItems.map((item) => (
            <RevealItem key={item.title} className="h-full">
              <div className="group h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-sand transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/5 text-primary mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 mx-auto flex-shrink-0">
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-semibold text-soft-black mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed flex-grow">
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
