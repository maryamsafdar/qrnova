import { QR_CATEGORIES } from "@/lib/qr";
import type { QrCategoryId } from "@/lib/qr";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface CategoryContent {
  heading: string;
  body: string;
  tips: string[];
  related: QrCategoryId[];
}

const CONTENT: Record<QrCategoryId, CategoryContent> = {
  url: {
    heading: "URL QR codes",
    body: "A URL QR code opens a website, landing page or online store the moment it is scanned. It is the most flexible type because you can point it at any page you control.",
    tips: [
      "Use a short, memorable link so the code stays low-density and easy to scan.",
      "Test the destination on both iOS and Android before printing.",
      "Keep the code at least 2 cm wide on printed material.",
    ],
    related: ["pdf", "social", "app"],
  },
  text: {
    heading: "Text QR codes",
    body: "A text QR code stores plain text directly inside the pattern. Scanners display the message instantly with no internet connection required.",
    tips: [
      "Keep messages short — long text increases density and hurts scannability.",
      "Great for serial numbers, instructions and short notes.",
      "Avoid special characters that some older scanners misread.",
    ],
    related: ["url", "email", "sms"],
  },
  wifi: {
    heading: "Wi-Fi QR codes",
    body: "A Wi-Fi QR code lets guests join your network without typing a password. The phone reads the SSID and credentials and connects automatically.",
    tips: [
      "Double-check the password — a single typo blocks every scan.",
      "Choose the correct security type; pick None only for open networks.",
      "Place the code where guests can scan it comfortably.",
    ],
    related: ["url", "contact", "location"],
  },
  email: {
    heading: "Email QR codes",
    body: "An email QR code opens the scanner's mail app with your address, subject and message already filled in, so replying takes one tap.",
    tips: [
      "Add a clear subject line to help you triage replies.",
      "Keep the pre-filled body short and specific.",
      "Use a monitored address so no enquiry is missed.",
    ],
    related: ["contact", "sms", "whatsapp"],
  },
  phone: {
    heading: "Phone QR codes",
    body: "A phone QR code starts a call to your number as soon as it is scanned — ideal for support lines, bookings and roadside signs.",
    tips: [
      "Always include the country code for international callers.",
      "Test the number from a different network.",
      "Pair it with a visible number for people without a scanner.",
    ],
    related: ["sms", "whatsapp", "contact"],
  },
  sms: {
    heading: "SMS QR codes",
    body: "An SMS QR code opens the messaging app with your number and a ready-to-send message, perfect for opt-ins, votes and quick enquiries.",
    tips: [
      "Write the message so it works even if the sender edits it.",
      "Keep it under 160 characters to stay in one message.",
      "Confirm the recipient number is correct before printing.",
    ],
    related: ["phone", "whatsapp", "email"],
  },
  whatsapp: {
    heading: "WhatsApp QR codes",
    body: "A WhatsApp QR code opens a chat with your business number and an optional pre-filled message, so customers can start a conversation instantly.",
    tips: [
      "Use the full international number without spaces or symbols.",
      "A friendly pre-filled message lifts reply rates.",
      "Make sure WhatsApp Business is set up on that number.",
    ],
    related: ["phone", "sms", "contact"],
  },
  contact: {
    heading: "Contact / vCard QR codes",
    body: "A vCard QR code saves your full contact details — name, phone, email, company and website — straight into the scanner's address book.",
    tips: [
      "Fill in only the fields you want to share publicly.",
      "A company name and job title add useful context.",
      "Test the saved contact on both iOS and Android.",
    ],
    related: ["email", "phone", "social"],
  },
  location: {
    heading: "Location QR codes",
    body: "A location QR code opens a Google Maps link to a precise set of coordinates, guiding people straight to your door, stall or venue.",
    tips: [
      "Copy coordinates from Google Maps for accuracy.",
      "Add a place label so the pin is easy to recognise.",
      "Print the code large enough to scan from a distance.",
    ],
    related: ["event", "contact", "url"],
  },
  social: {
    heading: "Social media QR codes",
    body: "A social QR code sends scanners to your profile on Instagram, Facebook, LinkedIn, TikTok, YouTube or any custom link, growing your following offline.",
    tips: [
      "Enter your handle without the @ symbol for the cleanest link.",
      "Use a custom URL for platforms not listed.",
      "Add the code to packaging, menus and event signage.",
    ],
    related: ["url", "contact", "app"],
  },
  pdf: {
    heading: "PDF link QR codes",
    body: "A PDF QR code links to a document hosted online, such as a menu, brochure or price list. The code points to the file — it does not contain the PDF itself.",
    tips: [
      "Host the PDF at a public, permanent URL.",
      "Avoid links that require a login or expire.",
      "Keep the file size reasonable for fast mobile loading.",
    ],
    related: ["url", "event", "text"],
  },
  event: {
    heading: "Event QR codes",
    body: "An event QR code adds your event to the scanner's calendar with the title, time, location and link already filled in.",
    tips: [
      "Set a clear start and end time in your local timezone.",
      "Include the venue so guests can navigate there.",
      "Add an event link for RSVPs or more details.",
    ],
    related: ["location", "contact", "url"],
  },
  app: {
    heading: "App download QR codes",
    body: "An app QR code sends scanners to your app on the App Store or Google Play, with an optional fallback link for other devices.",
    tips: [
      "Provide both store links so every device is covered.",
      "Add a fallback page for desktop scanners.",
      "Use the official store URLs to avoid broken links.",
    ],
    related: ["url", "social", "pdf"],
  },
};

interface GeneratorContentProps {
  category: QrCategoryId;
}

export function GeneratorContent({ category }: GeneratorContentProps) {
  const content = CONTENT[category];
  const related = content.related
    .map((id) => QR_CATEGORIES.find((item) => item.id === id))
    .filter((item): item is (typeof QR_CATEGORIES)[number] => Boolean(item));

  return (
    <section
      className="border-t border-border bg-secondary/30 py-14"
      data-ocid="generator.content.section"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {content.heading}
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {content.body}
        </p>

        <h3 className="mt-8 font-display text-lg font-semibold text-foreground">
          Tips for a reliable code
        </h3>
        <ul className="mt-3 space-y-2">
          {content.tips.map((tip) => (
            <li
              key={tip}
              className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden="true"
              />
              {tip}
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-lg font-semibold text-foreground">
          Related generators
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {related.map((item) => (
            <Link
              key={item.id}
              to="/generator"
              search={{ type: item.id }}
              data-ocid={`generator.related.${item.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-subtle transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
            >
              {item.title}
              <ArrowRight className="size-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
