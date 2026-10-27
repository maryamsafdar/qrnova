import { useEffect } from "react";
import "./NativeSponsoredAd.css";

const NATIVE_SCRIPT_URL =
  "https://bauval.org/21/1621ec3b199c0168827f49ea9b55c6aa";
const NATIVE_CONTAINER_ID = "container-1621ec3b199c0168827f49ea9b55c6aa";

export function NativeSponsoredAd() {
  useEffect(() => {
    const container = document.getElementById(NATIVE_CONTAINER_ID);
    if (!container || container.dataset.qrnovaInitialized === "true") return;

    container.dataset.qrnovaInitialized = "true";
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = NATIVE_SCRIPT_URL;
    script.onerror = () => {
      container.replaceChildren();
      delete container.dataset.qrnovaInitialized;
    };
    container.appendChild(script);

    return () => {
      script.remove();
      container.replaceChildren();
      delete container.dataset.qrnovaInitialized;
    };
  }, []);

  return (
    <section className="qrnova-native-ad" aria-label="Sponsored content">
      <div className="qrnova-native-ad__label">Advertisement</div>
      <div id={NATIVE_CONTAINER_ID} className="qrnova-native-ad__content" />
      <a
        className="qrnova-native-ad__smartlink"
        href="https://araplhn.org/4/50d1d20ba2a150b358a8763de003c686"
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
      >
        Sponsored link
      </a>
    </section>
  );
}
