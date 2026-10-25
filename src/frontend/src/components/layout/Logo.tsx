import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { QrCode } from "lucide-react";

interface LogoProps {
  className?: string;
  /** Render as a plain element instead of a router link. */
  asLink?: boolean;
}

export function Logo({ className, asLink = true }: LogoProps) {
  const content = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
        <QrCode className="size-5 text-primary-foreground" strokeWidth={2.4} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        QR<span className="text-gradient">Nova</span>
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      to="/"
      aria-label="QRNova home"
      className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}
