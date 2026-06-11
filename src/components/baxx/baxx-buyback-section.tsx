import { ShieldCheck, Truck, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { BaxxBuybackWidget } from "./baxx-buyback-widget";

const infoCards = [
  {
    icon: ShieldCheck,
    title: "Eerlijk bod",
    description: "Transparante prijs op basis van de staat van je apparaat",
  },
  {
    icon: Truck,
    title: "Gratis verzending",
    description: "Verstuur je apparaat kosteloos met een verzendlabel",
  },
  {
    icon: Clock,
    title: "Snelle uitbetaling",
    description: "Geld op je rekening zodra je apparaat is gecontroleerd",
  },
];

/**
 * Sectie met de Baxx Buyback widget in TelFixer-huisstijl. Volgt hetzelfde
 * patroon als de Repender-boekingssectie op de reparatiepagina: gecentreerde
 * intro, witte kaart met gradient-balk en infokaarten eronder.
 */
export function BaxxBuybackSection({ widgetCode }: { widgetCode: string }) {
  return (
    <section
      className="py-14 sm:py-16 lg:py-20"
      aria-labelledby="inleveren-widget-heading"
    >
      <Container>
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-8 sm:mb-10">
            <span className="text-eyebrow mb-4 block">Direct een bod</span>
            <h2
              id="inleveren-widget-heading"
              className="text-3xl sm:text-4xl font-display font-bold text-soft-black tracking-tight mb-3"
            >
              Bereken de waarde van je apparaat
            </h2>
            <p className="text-base sm:text-lg text-slate max-w-xl mx-auto leading-relaxed">
              Kies je apparaat, beantwoord een paar korte vragen en zie direct
              wat je ervoor krijgt.
            </p>
          </Reveal>

          <Reveal>
            <div className="relative bg-white rounded-3xl border border-sand overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copper via-gold to-primary" />
              <div className="p-5 sm:p-7 lg:p-8">
                <BaxxBuybackWidget widgetCode={widgetCode} />
              </div>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {infoCards.map((item) => (
              <RevealItem
                key={item.title}
                className="flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-sand"
              >
                <div className="w-11 h-11 rounded-xl bg-copper/10 flex items-center justify-center shrink-0">
                  <item.icon
                    className="w-5 h-5 text-copper"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-soft-black mb-1.5 text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
