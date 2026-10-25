import type {
  AppInput,
  ContactInput,
  EmailInput,
  EventInput,
  LocationInput,
  SmsInput,
  SocialInput,
  WifiInput,
} from "./types";

/** Escape the reserved characters used by the WIFI: payload grammar. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

/** Escape the reserved characters used by the vCard grammar. */
function escapeVCard(value: string): string {
  return value.replace(/([\\;,])/g, "\\$1").replace(/\n/g, "\\n");
}

/** Normalize a user-entered URL, defaulting to https when no scheme is given. */
export function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return value;
  return `https://${value}`;
}

/**
 * Whether a user-entered value is a usable website link. Accepts links with or
 * without a scheme, but rejects malformed input such as "not a url" so the
 * generator can show an inline error instead of encoding a broken code.
 */
export function isValidUrl(raw: string): boolean {
  const value = raw.trim();
  if (!value) return false;
  const normalized = normalizeUrl(value);
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return false;
  }
  if (parsed.protocol === "http:" || parsed.protocol === "https:") {
    const host = parsed.hostname;
    return host === "localhost" || /^[^\s.]+(\.[^\s.]+)+$/.test(host);
  }
  // Non-web schemes (mailto:, tel:, …) are valid when a scheme is present.
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:$/.test(parsed.protocol);
}

export function encodeUrl(raw: string): string {
  return normalizeUrl(raw);
}

export function encodeText(raw: string): string {
  return raw;
}

export function encodeWifi(input: WifiInput): string {
  const parts = [`T:${input.encryption}`, `S:${escapeWifi(input.ssid)}`];
  if (input.encryption !== "nopass") {
    parts.push(`P:${escapeWifi(input.password)}`);
  }
  if (input.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

export function encodeEmail(input: EmailInput): string {
  const params = new URLSearchParams();
  if (input.subject.trim()) params.set("subject", input.subject.trim());
  if (input.body.trim()) params.set("body", input.body.trim());
  const query = params.toString();
  return `mailto:${input.to.trim()}${query ? `?${query}` : ""}`;
}

export function encodePhone(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function encodeSms(input: SmsInput): string {
  const number = input.phone.replace(/\s+/g, "");
  const message = input.message.trim();
  return message ? `SMSTO:${number}:${message}` : `SMSTO:${number}`;
}

export function encodeWhatsApp(phone: string, message: string): string {
  const number = phone.replace(/[^\d]/g, "");
  const text = message.trim();
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function encodeContact(input: ContactInput): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(
    `N:${escapeVCard(input.lastName)};${escapeVCard(input.firstName)};;;`,
  );
  lines.push(
    `FN:${escapeVCard(`${input.firstName} ${input.lastName}`.trim())}`,
  );
  if (input.organization.trim())
    lines.push(`ORG:${escapeVCard(input.organization)}`);
  if (input.title.trim()) lines.push(`TITLE:${escapeVCard(input.title)}`);
  if (input.phone.trim())
    lines.push(`TEL;TYPE=CELL:${escapeVCard(input.phone)}`);
  if (input.email.trim()) lines.push(`EMAIL:${escapeVCard(input.email)}`);
  if (input.website.trim())
    lines.push(`URL:${escapeVCard(normalizeUrl(input.website))}`);
  if (input.address.trim())
    lines.push(`ADR:;;${escapeVCard(input.address)};;;;`);
  if (input.note.trim()) lines.push(`NOTE:${escapeVCard(input.note)}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export function encodeLocation(input: LocationInput): string {
  const lat = input.latitude.trim();
  const lng = input.longitude.trim();
  const base = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
  return input.label.trim()
    ? `${base}&query_place_id=${encodeURIComponent(input.label.trim())}`
    : base;
}

export function encodeSocial(input: SocialInput): string {
  const handle = input.handle.trim().replace(/^@/, "");
  switch (input.platform) {
    case "instagram":
      return `https://instagram.com/${handle}`;
    case "x":
      return `https://x.com/${handle}`;
    case "facebook":
      return `https://facebook.com/${handle}`;
    case "linkedin":
      return `https://linkedin.com/in/${handle}`;
    case "tiktok":
      return `https://tiktok.com/@${handle}`;
    case "youtube":
      return `https://youtube.com/@${handle}`;
    default:
      return normalizeUrl(input.handle);
  }
}

export function encodePdf(url: string): string {
  return normalizeUrl(url);
}

/** Format a local datetime string as a UTC iCalendar timestamp. */
function toIcsDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function encodeEvent(input: EventInput): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//QRNova//Event//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${escapeVCard(input.title)}`,
  ];
  const start = toIcsDate(input.start);
  const end = toIcsDate(input.end);
  if (start) lines.push(`DTSTART:${start}`);
  if (end) lines.push(`DTEND:${end}`);
  if (input.location.trim())
    lines.push(`LOCATION:${escapeVCard(input.location)}`);
  if (input.url?.trim()) lines.push(`URL:${normalizeUrl(input.url)}`);
  if (input.description?.trim())
    lines.push(`DESCRIPTION:${escapeVCard(input.description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\n");
}

export function encodeApp(input: AppInput): string {
  const ios = input.iosUrl.trim();
  const android = input.androidUrl.trim();
  const fallback = input.fallbackUrl.trim();
  if (ios && android) {
    return `https://qrnova.app/redirect?ios=${encodeURIComponent(ios)}&android=${encodeURIComponent(android)}${fallback ? `&fallback=${encodeURIComponent(fallback)}` : ""}`;
  }
  return normalizeUrl(ios || android || fallback);
}
