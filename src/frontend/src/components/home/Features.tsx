import {
  Gauge,
  Infinity as InfinityIcon,
  Palette,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";

const FEATURES = [
  {
    icon: InfinityIcon,
    title: "Unlimited free codes",
    description:
      "Generate as many QR codes as you like — no account, no subscription, no watermark.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description:
      "Every code is generated in your browser. Your links and credentials never leave your device.",
  },
  {
    icon: Palette,
    title: "Full customization",
    description:
      "Colors, gradients, dot and corner styles, center logos and resolution — all adjustable.",
  },
  {
    icon: Gauge,
    title: "High-resolution export",
    description:
      "Download crisp PNG and JPG files, plus a 2048px print PNG ready for signage and packaging.",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    description:
      "Once the page is loaded, generation runs entirely client-side — no round trips to a server.",
  },
  {
    icon: Sparkles,
    title: "13 content types",
    description:
      "URLs, text, Wi-Fi, email, phone, SMS, WhatsApp, vCards, locations, social, PDFs, events and apps.",
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-20" data-ocid="features.section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Free features, no strings attached
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Everything you need to create professional QR codes, available to
            everyone.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <li
              key={feature.title}
              data-ocid={`features.item.${index + 1}`}
              className="rounded-2xl border border-border bg-card p-6 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
