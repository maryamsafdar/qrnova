import {
  DEFAULT_RENDER_OPTIONS,
  downloadJpg,
  downloadPng,
  downloadPrintPng,
  encodeApp,
  encodeContact,
  encodeEmail,
  encodeEvent,
  encodeLocation,
  encodePdf,
  encodePhone,
  encodeSms,
  encodeSocial,
  encodeText,
  encodeUrl,
  encodeWhatsApp,
  encodeWifi,
  isValidUrl,
  normalizeUrl,
} from "@/lib/qr";
import type {
  AppInput,
  ContactInput,
  EmailInput,
  EventInput,
  LocationInput,
  QrCategoryId,
  QrRenderOptions,
  SmsInput,
  SocialInput,
  WifiInput,
} from "@/lib/qr";
import { useCallback, useMemo, useState } from "react";

export interface GeneratorDraft {
  url: string;
  text: string;
  wifi: WifiInput;
  email: EmailInput;
  phone: string;
  sms: SmsInput;
  whatsappPhone: string;
  whatsappMessage: string;
  contact: ContactInput;
  location: LocationInput;
  social: SocialInput;
  pdfUrl: string;
  event: EventInput;
  app: AppInput;
}

export const EMPTY_DRAFT: GeneratorDraft = {
  url: "",
  text: "",
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  email: { to: "", subject: "", body: "" },
  phone: "",
  sms: { phone: "", message: "" },
  whatsappPhone: "",
  whatsappMessage: "",
  contact: {
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    note: "",
  },
  location: { latitude: "", longitude: "", label: "" },
  social: { platform: "instagram", handle: "" },
  pdfUrl: "",
  event: { title: "", location: "", start: "", end: "", url: "" },
  app: { iosUrl: "", androidUrl: "", fallbackUrl: "" },
};

export interface ValidationResult {
  value: string;
  error: string | null;
}

/** Validate the draft for a category and return the encoded QR payload. */
export function buildPayload(
  category: QrCategoryId,
  draft: GeneratorDraft,
): ValidationResult {
  switch (category) {
    case "url": {
      if (!draft.url.trim())
        return { value: "", error: "Enter a website address to continue." };
      if (!isValidUrl(draft.url))
        return {
          value: "",
          error:
            "Enter a valid website address, for example example.com or https://example.com.",
        };
      return { value: encodeUrl(draft.url), error: null };
    }
    case "text": {
      if (!draft.text.trim())
        return { value: "", error: "Enter the text you want to share." };
      return { value: encodeText(draft.text), error: null };
    }
    case "wifi": {
      if (!draft.wifi.ssid.trim())
        return { value: "", error: "Enter the network name (SSID)." };
      if (draft.wifi.encryption !== "nopass" && !draft.wifi.password.trim()) {
        return {
          value: "",
          error: "Enter the Wi-Fi password or choose an open network.",
        };
      }
      return { value: encodeWifi(draft.wifi), error: null };
    }
    case "email": {
      if (!draft.email.to.trim())
        return { value: "", error: "Enter the recipient email address." };
      return { value: encodeEmail(draft.email), error: null };
    }
    case "phone": {
      if (!draft.phone.trim())
        return { value: "", error: "Enter a phone number." };
      return { value: encodePhone(draft.phone), error: null };
    }
    case "sms": {
      if (!draft.sms.phone.trim())
        return { value: "", error: "Enter the phone number to text." };
      return { value: encodeSms(draft.sms), error: null };
    }
    case "whatsapp": {
      if (!draft.whatsappPhone.trim())
        return { value: "", error: "Enter your WhatsApp number." };
      return {
        value: encodeWhatsApp(draft.whatsappPhone, draft.whatsappMessage),
        error: null,
      };
    }
    case "contact": {
      if (!draft.contact.firstName.trim() && !draft.contact.lastName.trim()) {
        return { value: "", error: "Enter at least a first or last name." };
      }
      return { value: encodeContact(draft.contact), error: null };
    }
    case "location": {
      if (!draft.location.latitude.trim() || !draft.location.longitude.trim()) {
        return { value: "", error: "Enter both latitude and longitude." };
      }
      return { value: encodeLocation(draft.location), error: null };
    }
    case "social": {
      if (!draft.social.handle.trim())
        return { value: "", error: "Enter your username or profile URL." };
      return { value: encodeSocial(draft.social), error: null };
    }
    case "pdf": {
      if (!draft.pdfUrl.trim())
        return { value: "", error: "Enter the link to your PDF or document." };
      return { value: encodePdf(draft.pdfUrl), error: null };
    }
    case "event": {
      if (!draft.event.title.trim())
        return { value: "", error: "Enter the event title." };
      if (!draft.event.start.trim())
        return { value: "", error: "Choose a start date and time." };
      return { value: encodeEvent(draft.event), error: null };
    }
    case "app": {
      if (
        !draft.app.iosUrl.trim() &&
        !draft.app.androidUrl.trim() &&
        !draft.app.fallbackUrl.trim()
      ) {
        return { value: "", error: "Add at least one store or fallback link." };
      }
      return { value: encodeApp(draft.app), error: null };
    }
    default:
      return { value: "", error: "Choose a QR code type to continue." };
  }
}

export interface UseGeneratorResult {
  draft: GeneratorDraft;
  update: <K extends keyof GeneratorDraft>(
    key: K,
    value: GeneratorDraft[K],
  ) => void;
  options: QrRenderOptions;
  setOptions: (next: Partial<QrRenderOptions>) => void;
  resetOptions: () => void;
  payload: string;
  error: string | null;
  generated: boolean;
  generate: () => void;
  reset: () => void;
  download: (format: "png" | "jpg" | "print") => Promise<void>;
  downloading: "png" | "jpg" | "print" | null;
}

/** Shared generator state used by the homepage hero and the generator page. */
export function useGenerator(category: QrCategoryId): UseGeneratorResult {
  const [draft, setDraft] = useState<GeneratorDraft>(EMPTY_DRAFT);
  const [options, setOptionsState] = useState<QrRenderOptions>(
    DEFAULT_RENDER_OPTIONS,
  );
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [downloading, setDownloading] = useState<
    "png" | "jpg" | "print" | null
  >(null);

  const update = useCallback(
    <K extends keyof GeneratorDraft>(key: K, value: GeneratorDraft[K]) => {
      setDraft((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const setOptions = useCallback((next: Partial<QrRenderOptions>) => {
    setOptionsState((current) => ({ ...current, ...next }));
  }, []);

  const resetOptions = useCallback(
    () => setOptionsState(DEFAULT_RENDER_OPTIONS),
    [],
  );

  const generate = useCallback(() => {
    const result = buildPayload(category, draft);
    if (result.error) {
      setError(result.error);
      setGenerated(false);
      setPayload("");
      return;
    }
    setError(null);
    setPayload(result.value);
    setGenerated(true);
  }, [category, draft]);

  const reset = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    setOptionsState(DEFAULT_RENDER_OPTIONS);
    setPayload("");
    setError(null);
    setGenerated(false);
  }, []);

  const download = useCallback(
    async (format: "png" | "jpg" | "print") => {
      if (!payload) return;
      setDownloading(format);
      try {
        if (format === "png") await downloadPng(payload, options);
        else if (format === "jpg") await downloadJpg(payload, options);
        else await downloadPrintPng(payload, options);
      } finally {
        setDownloading(null);
      }
    },
    [payload, options],
  );

  const memoOptions = useMemo(() => options, [options]);

  return {
    draft,
    update,
    options: memoOptions,
    setOptions,
    resetOptions,
    payload,
    error,
    generated,
    generate,
    reset,
    download,
    downloading,
  };
}

export { normalizeUrl };
