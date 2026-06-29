"use client";

import { useEffect, useRef } from "react";
import {
  BAXX_WIDGET_OVERRIDES,
  TELFIXER_BAXX_THEME_CSS,
} from "./baxx-telfixer-theme";

declare global {
  interface Window {
    __baxxScriptLoaded?: boolean;
    __BuybackWidgetLoaded?: boolean;
    BuybackWidget?: new (
      overrides?: Record<string, unknown>
    ) => ShadowRoot;
    __BBW_CONFIG?: Record<string, unknown>;
  }
}

function parseEmbedCode(code: string): {
  containerSelector: string;
  scriptSrc: string | null;
  markup: DocumentFragment;
} {
  const template = document.createElement("template");
  template.innerHTML = code.trim();

  let containerSelector = ".buyback-widget";
  const div = template.content.querySelector("div[class]");
  if (div) {
    const classes = div.className.trim().split(/\s+/).filter(Boolean);
    if (classes.length > 0) {
      containerSelector = classes.map((c) => `.${CSS.escape(c)}`).join("");
    }
  }

  const scriptEl = template.content.querySelector("script[src]");
  const scriptSrc = scriptEl?.getAttribute("src") ?? null;
  template.content.querySelectorAll("script").forEach((s) => s.remove());

  return { containerSelector, scriptSrc, markup: template.content };
}

function dispatchWidgetLoaded(detail: ShadowRoot) {
  document.dispatchEvent(
    new CustomEvent("buybackWidgetLoaded", {
      detail,
      bubbles: true,
      cancelable: true,
    })
  );
}

function initBuybackWidget(containerSelector: string): boolean {
  if (typeof window.BuybackWidget !== "function") return false;
  const shadow = new window.BuybackWidget({
    containerSelector,
    ...BAXX_WIDGET_OVERRIDES,
  });
  dispatchWidgetLoaded(shadow);
  return true;
}

/**
 * Rendert de Baxx Buyback widget met TelFixer-styling.
 *
 * De embed-code (uniek per account, ingesteld via Admin -> Instellingen ->
 * Baxx) wordt als `widgetCode`-prop op mount geinjecteerd.
 *
 * Baxx' script wacht intern op `DOMContentLoaded`, maar in Next.js draait
 * injectie pas na mount wanneer dat event al is afgegaan. Daarom initialiseren
 * we de widget handmatig zodra het script geladen is. Bij client-side
 * navigatie hergebruiken we de reeds geladen klasse; alleen de container-div
 * wordt opnieuw gemount.
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

    const onWidgetLoaded = (event: Event) => {
      const root = (event as CustomEvent<ShadowRoot | null>).detail;
      if (!root || typeof root.appendChild !== "function") return;
      if (root.querySelector?.("style[data-telfixer-theme]")) return;

      const style = document.createElement("style");
      style.setAttribute("data-telfixer-theme", "true");
      style.textContent = TELFIXER_BAXX_THEME_CSS;
      root.appendChild(style);
    };
    document.addEventListener("buybackWidgetLoaded", onWidgetLoaded);

    const { containerSelector, scriptSrc, markup } = parseEmbedCode(code);

    container.replaceChildren(markup.cloneNode(true));

    let script: HTMLScriptElement | null = null;

    const mountWidget = () => {
      if (!initBuybackWidget(containerSelector)) {
        console.error(
          "[Baxx] BuybackWidget kon niet initialiseren. Controleer de widget-code in Admin -> Instellingen."
        );
      }
    };

    if (typeof window.BuybackWidget === "function" && window.__BBW_CONFIG) {
      mountWidget();
    } else if (scriptSrc) {
      delete window.__BuybackWidgetLoaded;

      const url = new URL(scriptSrc, window.location.href);
      if (window.__baxxScriptLoaded) {
        url.searchParams.set("v", String(Date.now()));
      }

      script = document.createElement("script");
      script.src = url.toString();
      script.async = false;
      script.dataset.baxx = "true";
      script.onload = () => {
        window.__baxxScriptLoaded = true;
        mountWidget();
      };
      script.onerror = () => {
        console.error("[Baxx] Widget-script kon niet laden:", url.toString());
      };
      document.body.appendChild(script);
    } else {
      console.error(
        "[Baxx] Geen script-src gevonden in widget-code. Plak de volledige embed-code van baxx.app."
      );
    }

    return () => {
      document.removeEventListener("buybackWidgetLoaded", onWidgetLoaded);
      container.replaceChildren();
      script?.remove();
    };
  }, [widgetCode]);

  return <div ref={containerRef} className={className} />;
}
