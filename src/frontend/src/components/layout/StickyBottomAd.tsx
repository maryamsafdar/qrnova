import { useEffect, useState } from "react";
import "./StickyBottomAd.css";

type AdSize = "mobile" | "desktop";

const AD_CONFIG: Record<AdSize, { key: string; width: number; height: number; src: string }> = {
  mobile: {
    key: "c746eeb9a9c65d51ef432e9d9b59765a",
    width: 320,
    height: 50,
    src: "https://bauval.org/22/c746eeb9a9c65d51ef432e9d9b59765a",
  },
  desktop: {
    key: "8f38a181e0e1a04fa876b6c3040aa60b",
    width: 728,
    height: 90,
    src: "https://bauval.org/22/8f38a181e0e1a04fa876b6c3040aa60b",
  },
};

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, never>;
    };
  }
}

export function StickyBottomAd() {
  const [visible, setVisible] = useState(true);
  const [size, setSize] = useState<AdSize>(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? "mobile"
      : "desktop",
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateSize = () => setSize(media.matches ? "mobile" : "desktop");
    media.addEventListener("change", updateSize);
    updateSize();
    return () => media.removeEventListener("change", updateSize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-sticky-bottom-ad", visible);
    return () => document.body.classList.remove("has-sticky-bottom-ad");
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const config = AD_CONFIG[size];
    const host = document.getElementById("qrnova-sticky-ad-slot");
    if (!host) return;

    host.replaceChildren();
    // Ad providers commonly read this global while their script initializes.
    window.atOptions = {
      key: config.key,
      format: "iframe",
      height: config.height,
      width: config.width,
      params: {},
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = config.src;
    script.dataset.qrnovaAd = size;
    script.onerror = () => {
      // Keep the ad shell usable if the provider is blocked or unavailable.
      host.replaceChildren();
    };
    host.appendChild(script);

    return () => {
      script.remove();
      host.replaceChildren();
      if (window.atOptions?.key === config.key) {
        delete window.atOptions;
      }
    };
  }, [size, visible]);

  if (!visible) return null;

  return (
    <aside className="qrnova-sticky-ad" aria-label="Advertisement">
      <span className="qrnova-sticky-ad__label">Advertisement</span>
      <button
        className="qrnova-sticky-ad__close"
        type="button"
        aria-label="Close advertisement"
        onClick={() => setVisible(false)}
      >
        ×
      </button>
      <div className="qrnova-sticky-ad__content">
        <div
          id="qrnova-sticky-ad-slot"
          className={`qrnova-sticky-ad__slot qrnova-sticky-ad__slot--${size}`}
          aria-label={`${configLabel(size)} banner`}
        />
      </div>
    </aside>
  );
}

function configLabel(size: AdSize) {
  return size === "mobile" ? "320 by 50 mobile" : "728 by 90 desktop";
}
