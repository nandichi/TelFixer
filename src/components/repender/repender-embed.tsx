"use client";

import { useEffect, useRef } from "react";

const CDN_SRC = "https://cdn.jsdelivr.net/gh/repender/repender-cdn@main/index.js";
const REPENDER_URL = process.env.NEXT_PUBLIC_REPENDER_URL || "https://repender.nl";
const REPENDER_TOKEN = process.env.NEXT_PUBLIC_REPENDER_TOKEN || "";

declare global {
  interface Window {
    rependerUrl?: string;
    rependerToken?: string;
    openRependerMenu?: (deviceType?: string, brand?: string, device?: string) => void;
    __rependerScriptLoaded?: boolean;
  }
}

type RependerEmbedProps =
  | {
      variant: "inline";
      deviceType?: string;
      brand?: string;
      device?: string;
      className?: string;
    }
  | { variant: "status"; className?: string }
  | { variant: "popup"; openByDefault?: boolean; className?: string };

/**
 * Embeds a Repender plugin widget (booking, status or popup) in a Next.js page.
 *
 * The Repender CDN runs its mount routine once when the module executes, targeting
 * the elements that exist at that moment. A loaded ES module is never re-executed
 * for the same URL, so on Next.js client-side navigation a plain re-injection would
 * not re-mount the widget. We therefore (re)inject the module with a cache-busting
 * query on subsequent mounts so the mount routine runs again against the freshly
 * rendered container.
 */
export function RependerEmbed(props: RependerEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.rependerUrl = REPENDER_URL;
    window.rependerToken = REPENDER_TOKEN;

    if (!REPENDER_TOKEN) {
      console.warn(
        "[Repender] NEXT_PUBLIC_REPENDER_TOKEN ontbreekt; de widget kan niet laden."
      );
    }

    const src = window.__rependerScriptLoaded
      ? `${CDN_SRC}?v=${Date.now()}`
      : CDN_SRC;

    const script = document.createElement("script");
    script.type = "module";
    script.src = src;
    script.dataset.repender = "true";
    document.body.appendChild(script);
    window.__rependerScriptLoaded = true;

    const container = containerRef.current;

    return () => {
      script.remove();
      if (container) container.innerHTML = "";
    };
  }, []);

  if (props.variant === "status") {
    return (
      <div
        id="repender-repair-order-status"
        ref={containerRef}
        className={props.className}
      />
    );
  }

  if (props.variant === "popup") {
    return (
      <div
        id="repender-plugin"
        ref={containerRef}
        className={props.className}
        {...(props.openByDefault ? { "data-open-by-default": "" } : {})}
      />
    );
  }

  return (
    <div
      id="repender-inline"
      ref={containerRef}
      className={props.className}
      data-device-type={props.deviceType}
      data-brand={props.brand}
      data-device={props.device}
    />
  );
}
