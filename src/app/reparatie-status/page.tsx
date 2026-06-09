import type { Metadata } from "next";
import { Search, Clock, QrCode } from "lucide-react";
import { Container } from "@/components/layout/container";
import { RependerEmbed } from "@/components/repender/repender-embed";

export const metadata: Metadata = {
  title: "Reparatie status",
  description:
    "Volg de status van je reparatie bij TelFixer. Vul je referentienummer in of gebruik de persoonlijke link of QR-code uit je bevestiging.",
};

const helpers = [
  { icon: Search, text: "Vul je referentienummer in" },
  { icon: QrCode, text: "Of gebruik de QR-code uit je bevestiging" },
  { icon: Clock, text: "Realtime status, dag en nacht" },
];

export default function ReparatieStatusPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 animate-pulse-slow" />
        </div>

        <Container>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 mb-8 animate-fade-in-down">
              <Search className="w-4 h-4 text-copper" />
              <span className="text-sm font-medium text-primary">
                Volg je reparatie
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-soft-black mb-6 leading-[1.1] animate-fade-in-up">
              Status van je
              <br />
              <span className="text-gradient-primary">reparatie</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
              Bekijk eenvoudig waar je reparatie zich bevindt. Geen wachtrij, geen
              telefoontjes, gewoon direct inzicht in de actuele status.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 animate-fade-in-up delay-200">
              {helpers.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-sand shadow-sm"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5">
                    <item.icon className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-sm font-medium text-soft-black">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Status widget (Repender) */}
      <section className="pb-12 lg:pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div
              className="relative bg-white rounded-3xl border border-sand overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-copper to-gold" />
              <div className="p-4 sm:p-6 lg:p-8">
                <RependerEmbed variant="status" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
