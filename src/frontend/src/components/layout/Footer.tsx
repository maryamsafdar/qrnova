import type { QrCategoryId } from "@/lib/qr";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const TOOL_LINKS: { label: string; type: QrCategoryId }[] = [
  { label: "URL QR Code", type: "url" },
  { label: "Wi-Fi QR Code", type: "wifi" },
  { label: "vCard QR Code", type: "contact" },
  { label: "WhatsApp QR Code", type: "whatsapp" },
];

const COMPANY_LINKS = [
  { label: "Home", to: "/" as const },
  { label: "QR Generator", to: "/generator" as const },
  { label: "Privacy Policy", to: "/privacy" as const },
  { label: "Terms of Service", to: "/terms" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              QRNova is a free, browser-based QR code generator. Create,
              customize and download QR codes for websites, Wi-Fi, contacts,
              social media and more — no account required.
            </p>
          </div>

          <nav aria-label="Tools">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Tools
            </h2>
            <ul className="mt-4 space-y-2.5">
              {TOOL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to="/generator"
                    search={{ type: link.type }}
                    data-ocid={`footer.tool.${link.type}.link`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    data-ocid={`footer.company.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} QRNova. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
