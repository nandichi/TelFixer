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

const BAXX_DIRECT_ORIGINS = new Set(["telfixer.nl", "www.telfixer.nl"]);

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

function needsBaxxApiProxy(): boolean {
  return !BAXX_DIRECT_ORIGINS.has(window.location.hostname);
}

function ensureFreshHost(
  container: HTMLElement,
  containerSelector: string
): void {
  const host = container.querySelector<HTMLElement>(containerSelector);
  if (host?.shadowRoot) {
    host.replaceWith(host.cloneNode(false));
  }
}

function initBuybackWidget(
  container: HTMLElement,
  containerSelector: string
): boolean {
  if (typeof window.BuybackWidget !== "function") return false;

  ensureFreshHost(container, containerSelector);

  const overrides: Record<string, unknown> = {
    containerSelector,
    ...BAXX_WIDGET_OVERRIDES,
  };

  if (needsBaxxApiProxy()) {
    overrides.apiUrl = `${window.location.origin}/api/baxx`;
  }

  try {
    const shadow = new window.BuybackWidget(overrides);
    dispatchWidgetLoaded(shadow);
    return true;
  } catch (err) {
    console.error("[Baxx] BuybackWidget initialisatie mislukt:", err);
    return false;
  }
}

function getExistingBaxxScript(): HTMLScriptElement | null {
  return document.querySelector('script[data-baxx="true"]');
}

/**
 * Rendert de Baxx Buyback widget met TelFixer-styling.
 *
 * De embed-code (uniek per account, ingesteld via Admin -> Instellingen ->
 * Baxx) wordt als `widgetCode`-prop op mount geinjecteerd.
 *
 * Baxx' script wacht intern op `DOMContentLoaded`, maar in Next.js draait
 * injectie pas na mount wanneer dat event al is afgegaan. Daarom initialiseren
 * we de widget handmatig zodra het script geladen is. Het script wordt eenmalig
 * geladen en hergebruikt bij client-side navigatie en React Strict Mode.
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

    let cancelled = false;

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

    const mountWidget = () => {
      if (cancelled) return;
      if (!initBuybackWidget(container, containerSelector)) {
        console.error(
          "[Baxx] BuybackWidget kon niet initialiseren. Controleer de widget-code in Admin -> Instellingen."
        );
      }
    };

    const existingScript = getExistingBaxxScript();

    if (typeof window.BuybackWidget === "function") {
      mountWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", mountWidget, { once: true });
    } else if (scriptSrc) {
      const url = new URL(scriptSrc, window.location.href);

      const script = document.createElement("script");
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
      cancelled = true;
      document.removeEventListener("buybackWidgetLoaded", onWidgetLoaded);
      container.replaceChildren();
    };
  }, [widgetCode]);

  return <div ref={containerRef} className={className} />;
}
