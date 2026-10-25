import { QR_CATEGORIES } from "@/lib/qr";
import type { QrCategoryId } from "@/lib/qr";
import { Link } from "@tanstack/react-router";
import {
  AlignLeft,
  CalendarDays,
  FileText,
  Link2,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Share2,
  Smartphone,
  UserPlus,
  Wifi,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Link2,
  AlignLeft,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  UserPlus,
  MapPin,
  Share2,
  FileText,
  CalendarDays,
  Smartphone,
};

export function CategoryGrid() {
  return (
    <section
      id="categories"
      className="scroll-mt-20 py-16 sm:py-20"
      data-ocid="categories.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Every QR code type you need
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Pick a category to open its generator with the right fields,
            validation and encoding already set up.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {QR_CATEGORIES.map((category, index) => {
            const Icon = ICONS[category.icon] ?? Link2;
            return (
              <li key={category.id}>
                <Link
                  to="/generator"
                  search={{ type: category.id as QrCategoryId }}
                  data-ocid={`categories.item.${index + 1}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl ${category.tileClass} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
