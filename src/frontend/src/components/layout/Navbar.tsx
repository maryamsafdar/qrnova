import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Menu, QrCode, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Home", to: "/" as const },
  { label: "QR Generator", to: "/generator" as const },
  { label: "URL QR Code", to: "/url-qr-code-generator" as const },
  { label: "Wi-Fi QR Code", to: "/wifi-qr-code-generator" as const },
  { label: "QR Categories", to: "/", hash: "categories" },
  { label: "How It Works", to: "/", hash: "how-it-works" },
  { label: "FAQ", to: "/", hash: "faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash}
              data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: link.to === "/" && !link.hash }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-full bg-gradient-primary px-5 shadow-glow transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Link
              to="/generator"
              search={{ type: "url" }}
              data-ocid="nav.generate_button"
            >
              <QrCode className="size-4" />
              Generate QR Code
            </Link>
          </Button>

          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            data-ocid="nav.menu_toggle"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 bg-background/95 backdrop-blur-xl transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash}
              onClick={() => setOpen(false)}
              data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-2 rounded-full bg-gradient-primary shadow-glow"
          >
            <Link
              to="/generator"
              search={{ type: "url" }}
              onClick={() => setOpen(false)}
              data-ocid="nav.mobile.generate_button"
            >
              <QrCode className="size-4" />
              Generate QR Code
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
