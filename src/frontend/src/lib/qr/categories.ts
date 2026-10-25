import type { QrCategory } from "./types";

export const QR_CATEGORIES: QrCategory[] = [
  {
    id: "url",
    title: "URL",
    description: "Link to any website, landing page or online store.",
    icon: "Link2",
    tileClass: "bg-primary/10 text-primary",
  },
  {
    id: "text",
    title: "Text",
    description: "Share plain text notes, codes or short messages.",
    icon: "AlignLeft",
    tileClass: "bg-accent/15 text-accent-foreground",
  },
  {
    id: "wifi",
    title: "Wi-Fi",
    description: "Let guests join your network without typing a password.",
    icon: "Wifi",
    tileClass: "bg-chart-3/15 text-chart-3",
  },
  {
    id: "email",
    title: "Email",
    description: "Open a pre-filled email to any address in one scan.",
    icon: "Mail",
    tileClass: "bg-primary/10 text-primary",
  },
  {
    id: "phone",
    title: "Phone",
    description: "Start a call to your number straight from the scan.",
    icon: "Phone",
    tileClass: "bg-accent/15 text-accent-foreground",
  },
  {
    id: "sms",
    title: "SMS",
    description: "Send a text message with your wording pre-filled.",
    icon: "MessageSquare",
    tileClass: "bg-chart-3/15 text-chart-3",
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Open a WhatsApp chat with a ready-to-send message.",
    icon: "MessageCircle",
    tileClass: "bg-accent/15 text-accent-foreground",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Save your full contact details as a vCard.",
    icon: "UserPlus",
    tileClass: "bg-chart-3/15 text-chart-3",
  },
  {
    id: "location",
    title: "Location",
    description: "Guide people to a place with a Google Maps link.",
    icon: "MapPin",
    tileClass: "bg-primary/10 text-primary",
  },
  {
    id: "social",
    title: "Social",
    description: "Grow your following on Instagram, X and more.",
    icon: "Share2",
    tileClass: "bg-primary/10 text-primary",
  },
  {
    id: "pdf",
    title: "PDF",
    description: "Open a menu, brochure or document hosted online.",
    icon: "FileText",
    tileClass: "bg-primary/10 text-primary",
  },
  {
    id: "event",
    title: "Event",
    description: "Add your event to the scanner's calendar instantly.",
    icon: "CalendarDays",
    tileClass: "bg-accent/15 text-accent-foreground",
  },
  {
    id: "app",
    title: "App",
    description: "Send users to your app on the App Store or Google Play.",
    icon: "Smartphone",
    tileClass: "bg-chart-3/15 text-chart-3",
  },
];

export function getCategory(id: string): QrCategory | undefined {
  return QR_CATEGORIES.find((category) => category.id === id);
}
