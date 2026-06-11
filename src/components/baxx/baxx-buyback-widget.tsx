"use client";

import { useEffect, useRef } from "react";

/**
 * TelFixer-huisstijl voor de Baxx Buyback widget. Wordt volgens de
 * Baxx-handleiding in de widget geinjecteerd zodra het
 * `buybackWidgetLoaded`-event afgaat. Alleen de door Baxx gedocumenteerde
 * classes worden gebruikt: .bbw-container, .bbw-category-section en
 * .bbw-subtitle.
 */
const TELFIXER_WIDGET_CSS = `
  /* Hoofdwrapper: transparant zodat de witte kaart van de site de achtergrond vormt */
  .bbw-container {
    background-color: transparent;
    font-family: var(--font-sans, ui-sans-serif, system-ui, -apple-system, sans-serif);
    color: #1A1A1A;
  }

  /* Subtitels en helperteksten in de stappen */
  .bbw-subtitle {
    color: #4A4A4A;
  }

  /* Vraagdetails: zachte creme-achtergrond conform het designsysteem */
  .bbw-container[data-step=questions] .bbw-subtitle:last-child {
    padding: 24px;
    border-radius: 16px;
    background: #FAF8F5;
    border: 1px solid #E8DFD4;
  }
`;

declare global {
  interface Window {
    __baxxModuleLoaded?: boolean;
  }
}

/**
 * Rendert de Baxx Buyback widget met TelFixer-styling.
 *
 * De embed-code (uniek per account, ingesteld via Admin -> Instellingen ->
 * Baxx) wordt als `widgetCode`-prop op mount geinjecteerd. Scripts uit het
 * blok worden opnieuw aangemaakt omdat de
 * browser scripts uit innerHTML nooit uitvoert. ES-modules draaien maar een
 * keer per URL, daarom krijgen die bij client-side hernavigatie een
 * cache-buster zodat de widget opnieuw mount (zelfde aanpak als RependerEmbed).
 */
export function BaxxBuybackWidget({
  widgetCode,
  className,
}: {
  widgetCode: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const code = widgetCode?.trim();
    if (!container || !code) return;

    // Stylinglistener registreren voordat de widget-code draait, zodat het
    // load-event nooit gemist wordt.
    const onWidgetLoaded = (event: Event) => {
      const root = (event as CustomEvent<HTMLElement | null>).detail;
      if (!root || typeof root.appendChild !== "function") return;
      if (root.querySelector?.("style[data-telfixer-theme]")) return;

      const style = document.createElement("style");
      style.setAttribute("data-telfixer-theme", "true");
      style.textContent = TELFIXER_WIDGET_CSS;
      root.appendChild(style);
    };
    document.addEventListener("buybackWidgetLoaded", onWidgetLoaded);

    // Embed-code parsen en scripts opnieuw aanmaken zodat ze uitvoeren.
    const template = document.createElement("template");
    template.innerHTML = code;

    let containsModuleScript = false;
    template.content.querySelectorAll("script").forEach((original) => {
      const script = document.createElement("script");
      for (const attr of Array.from(original.attributes)) {
        script.setAttribute(attr.name, attr.value);
      }

      if (original.src) {
        // Volgorde van externe scripts behouden.
        script.async = false;
        if (script.type === "module") {
          containsModuleScript = true;
          if (window.__baxxModuleLoaded) {
            const url = new URL(original.src, window.location.href);
            url.searchParams.set("v", String(Date.now()));
            script.src = url.toString();
          }
        }
      } else {
        script.textContent = original.textContent;
      }

      original.replaceWith(script);
    });

    container.appendChild(template.content);
    if (containsModuleScript) {
      window.__baxxModuleLoaded = true;
    }

    return () => {
      document.removeEventListener("buybackWidgetLoaded", onWidgetLoaded);
      container.innerHTML = "";
    };
  }, [widgetCode]);

  return <div ref={containerRef} className={className} />;
}
