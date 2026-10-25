export type QrCategoryId =
  | "url"
  | "text"
  | "wifi"
  | "email"
  | "phone"
  | "sms"
  | "whatsapp"
  | "contact"
  | "location"
  | "social"
  | "pdf"
  | "event"
  | "app";

export interface QrCategory {
  id: QrCategoryId;
  title: string;
  description: string;
  /** lucide-react icon name resolved by the category grid. */
  icon: string;
  /** Tailwind utility classes for the icon tile background + foreground. */
  tileClass: string;
}

export interface WifiInput {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface ContactInput {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  note: string;
}

export interface EventInput {
  title: string;
  location: string;
  start: string;
  end: string;
  /** Optional event link, encoded as the iCalendar URL property. */
  url?: string;
  description?: string;
}

export interface EmailInput {
  to: string;
  subject: string;
  body: string;
}

export interface SmsInput {
  phone: string;
  message: string;
}

export interface LocationInput {
  latitude: string;
  longitude: string;
  label: string;
}

export interface SocialInput {
  platform: string;
  handle: string;
}

export interface AppInput {
  iosUrl: string;
  androidUrl: string;
  fallbackUrl: string;
}

export interface QrRenderOptions {
  size: number;
  margin: number;
  foreground: string;
  background: string;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  logoDataUrl?: string;
  logoSizeRatio?: number;
}
