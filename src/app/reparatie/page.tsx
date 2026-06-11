import type { Metadata } from "next";
import Image from "next/image";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Wrench,
  CalendarCheck,
  Truck,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { RependerEmbed } from "@/components/repender/repender-embed";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Reparatie",
  description:
    "Laat je telefoon, tablet of laptop vakkundig repareren bij TelFixer. Kies je apparaat, selecteer de reparatie, zie direct de prijs en plan eenvoudig een afspraak in.",
};

const trustIndicators = [
  { icon: ShieldCheck, text: "12 maanden garantie" },
  { icon: Clock, text: "Reparatie vaak binnen 48 uur klaar" },
  { icon: Truck, text: "Gratis ophaal- en brengdienst" },
];

const infoCards = [
  {
    icon: ShieldCheck,
    title: "Garantie",
    description: "12 maanden garantie op elke reparatie",
  },
  {
    icon: Clock,
    title: "Snel klaar",
    description: "De meeste reparaties binnen 48 uur geregeld",
  },
  {
    icon: Sparkles,
    title: "Kwaliteit",
    description: "Originele of hoogwaardige onderdelen",
  },
];

const steps = [
  { number: "01", title: "Kies je apparaat", description: "Selecteer merk en model" },
  { number: "02", title: "Zie direct de prijs", description: "Transparant, geen verrassingen" },
  { number: "03", title: "Plan je afspraak", description: "Op een moment dat jou uitkomt" },
];

export default function ReparatiePage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-soft-black">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
          <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-48 -left-32 w-[460px] h-[460px] rounded-full bg-copper/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_65%)]" />
        </div>

        <Container>
          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-center py-14 sm:py-20 lg:py-24">
            {/* Tekst */}
            <Reveal direction="left">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-6">
                <Wrench className="w-4 h-4 text-accent-on-dark shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium text-on-dark-muted">
                  Professionele reparatieservice
                </span>
              </span>

              <h1 className="heading-balance text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.08] tracking-tight mb-6">
                Kapot toestel?
                <br />
                Vaak{" "}
                <span className="whitespace-nowrap text-accent-on-dark">dezelfde dag</span>
                <br />
                gemaakt.
              </h1>

              <p className="text-lg lg:text-xl text-on-dark-muted max-w-md leading-relaxed mb-8">
                Van een gebarsten scherm tot een zwakke batterij. Kies je
                apparaat, zie direct de prijs en plan online een afspraak. Veel
                reparaties zijn nog dezelfde dag klaar zodra wij je toestel in
                behandeling nemen, de meeste binnen 48 uur.
              </p>

              <div className="flex flex-wrap gap-3">
                {trustIndicators.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/15 backdrop-blur-sm"
                  >
                    <item.icon className="w-4 h-4 text-accent-on-dark shrink-0" strokeWidth={1.75} />
                    <span className="text-sm font-medium text-on-dark-muted">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Beeld */}
            <Reveal direction="right" delay={0.15} className="relative hidden sm:block">
              <div className="relative aspect-[4/3] rounded-3xl lg:rounded-[2.5rem] overflow-hidden ring-1 ring-white/15 shadow-2xl">
                <Image
                  src="/images/home/reparatie.jpg"
                  alt="Technicus vervangt vakkundig het scherm van een iPhone"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-soft-black/50 via-transparent to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5">
                  <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 shadow-lg">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-primary shrink-0">
                      <CalendarCheck className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-white">
                        Direct online inplannen
                      </p>
                      <p className="text-xs text-on-dark-subtle">
                        Kies zelf je moment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Stappenbalk */}
        <div className="relative border-t border-white/10 bg-white/[0.03]">
          <Container>
            <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 py-8 sm:py-10">
              {steps.map((step) => (
                <RevealItem key={step.number} className="flex items-start gap-4">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-accent-on-dark tabular-nums shrink-0">
                    {step.number}
                  </span>
                  <div className="leading-snug pt-0.5">
                    <p className="text-sm sm:text-base font-semibold text-white">
                      {step.title}
                    </p>
                    <p className="text-xs sm:text-sm text-on-dark-subtle mt-1">
                      {step.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </div>
      </section>

      {/* Boekingswidget (Repender) */}
      <section className="py-14 sm:py-16 lg:py-20" aria-labelledby="reparatie-booking-heading">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-8 sm:mb-10">
              <span className="text-eyebrow mb-4 block">Online boeken</span>
              <h2
                id="reparatie-booking-heading"
                className="text-3xl sm:text-4xl font-display font-bold text-soft-black tracking-tight mb-3"
              >
                Plan je reparatie
              </h2>
              <p className="text-base sm:text-lg text-slate max-w-xl mx-auto leading-relaxed">
                Kies je apparaat, selecteer de reparatie en zie direct de prijs.
                Geen verrassingen achteraf.
              </p>
            </Reveal>

            <Reveal>
              <div
                className="relative bg-white rounded-3xl border border-sand overflow-hidden shadow-md"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-copper to-gold" />
                <div className="p-5 sm:p-7 lg:p-8">
                  <RependerEmbed variant="inline" />
                </div>
              </div>
            </Reveal>

            {/* Extra info */}
            <RevealGroup className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {infoCards.map((item) => (
                <RevealItem
                  key={item.title}
                  className="flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-sand"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-soft-black mb-1.5 text-base">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate leading-relaxed">{item.description}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* 48-uur belofte */}
            <Reveal className="mt-10 sm:mt-12">
              <div className="relative overflow-hidden rounded-3xl bg-soft-black p-6 sm:p-8 text-center">
                <div className="absolute inset-0" aria-hidden="true">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
                  <div className="absolute -top-20 right-1/4 w-[280px] h-[280px] rounded-full bg-primary/20 blur-3xl" />
                </div>
                <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/15 shrink-0">
                    <Clock className="w-6 h-6 text-accent-on-dark" strokeWidth={1.75} />
                  </span>
                  <p className="text-xl sm:text-2xl font-display font-bold text-white">
                    De meeste reparaties binnen 48 uur geregeld!
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
