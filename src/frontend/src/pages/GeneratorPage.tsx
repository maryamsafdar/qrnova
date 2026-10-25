import {
  CategoryForm,
  CustomizationPanel,
  DEFAULT_QR_STYLE,
  DownloadPanel,
  GeneratorContent,
  type QrStyleOptions,
  StyledQrPreview,
} from "@/components/generator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useGenerator } from "@/hooks/useGenerator";
import { QR_CATEGORIES, getCategory } from "@/lib/qr";
import type { QrCategoryId } from "@/lib/qr";
import { useSeo } from "@/lib/seo";
import { Link, useSearch } from "@tanstack/react-router";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";

const CATEGORY_META: Record<
  QrCategoryId,
  { title: string; description: string }
> = {
  url: {
    title: "URL QR Code Generator — Free Website Link Codes",
    description:
      "Create a free URL QR code for any website or landing page. Customize colors and styles, then download PNG, JPG or print files instantly.",
  },
  text: {
    title: "Text QR Code Generator — Share Plain Text by Scan",
    description:
      "Generate a free text QR code that shows your message instantly. No account needed — customize and download in your browser.",
  },
  wifi: {
    title: "Wi-Fi QR Code Generator — Share Network Access",
    description:
      "Create a free Wi-Fi QR code so guests join your network without typing a password. Customize and download instantly.",
  },
  email: {
    title: "Email QR Code Generator — Pre-filled Mailto Codes",
    description:
      "Generate a free email QR code that opens a pre-filled message. Add subject and body, customize the design and download.",
  },
  phone: {
    title: "Phone QR Code Generator — Scan to Call",
    description:
      "Create a free phone QR code that starts a call on scan. Customize the design and download PNG, JPG or print files.",
  },
  sms: {
    title: "SMS QR Code Generator — Pre-filled Text Messages",
    description:
      "Generate a free SMS QR code with a ready-to-send message. Customize colors and styles, then download instantly.",
  },
  whatsapp: {
    title: "WhatsApp QR Code Generator — Start a Chat by Scan",
    description:
      "Create a free WhatsApp QR code that opens a chat with an optional pre-filled message. Customize and download in seconds.",
  },
  contact: {
    title: "vCard QR Code Generator — Digital Contact Cards",
    description:
      "Generate a free vCard QR code with your name, phone, email and company. Scanners save your contact details in one tap.",
  },
  location: {
    title: "Location QR Code Generator — Google Maps Links",
    description:
      "Create a free location QR code that opens Google Maps directions. Enter coordinates, customize and download instantly.",
  },
  social: {
    title: "Social Media QR Code Generator — Grow Your Following",
    description:
      "Generate a free social QR code for Instagram, Facebook, LinkedIn, TikTok, YouTube and more. Customize and download.",
  },
  pdf: {
    title: "PDF QR Code Generator — Link to Hosted Documents",
    description:
      "Create a free PDF QR code that links to a hosted document such as a menu or brochure. Customize and download instantly.",
  },
  event: {
    title: "Event QR Code Generator — Add to Calendar by Scan",
    description:
      "Generate a free event QR code that adds your event to the scanner's calendar. Set the time, location and link, then download.",
  },
  app: {
    title: "App Download QR Code Generator — App Store & Play",
    description:
      "Create a free app QR code that sends scanners to the App Store or Google Play. Add a fallback link and download instantly.",
  },
};

export default function GeneratorPage() {
  const { type } = useSearch({ from: "/generator" });
  const category = getCategory(type) ?? QR_CATEGORIES[0];
  const meta = CATEGORY_META[category.id];

  const {
    draft,
    update,
    options,
    setOptions,
    resetOptions,
    payload,
    error,
    generated,
    generate,
  } = useGenerator(category.id);

  const [style, setStyleState] = useState<QrStyleOptions>(DEFAULT_QR_STYLE);
  const setStyle = useCallback((next: Partial<QrStyleOptions>) => {
    setStyleState((current) => ({ ...current, ...next }));
  }, []);

  useSeo({
    title: meta.title,
    description: meta.description,
    path: "/generator",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "QR Generator", path: "/generator" },
      { name: category.title, path: `/generator?type=${category.id}` },
    ],
  });

  return (
    <>
      <section
        className="relative overflow-hidden border-b border-border"
        data-ocid="generator.page"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -left-20 top-0 size-72 rounded-full bg-primary/15 blur-3xl animate-aurora" />
          <div className="absolute right-0 top-10 size-72 rounded-full bg-accent/15 blur-3xl animate-aurora [animation-delay:3s]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumb data-ocid="generator.breadcrumb">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/generator" search={{ type: "url" }}>
                    QR Generator
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-subtle backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              Free · No account required
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category.title} QR Code Generator
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {category.description} Everything is generated in your browser, so
              your information never leaves your device.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
            <div className="glass rounded-3xl p-6 shadow-float sm:p-8">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Enter your details
              </h2>
              <div className="mt-5">
                <CategoryForm
                  category={category.id}
                  draft={draft}
                  update={update}
                  error={error}
                  onGenerate={generate}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Live preview
                  </h2>
                  {generated ? (
                    <span
                      data-ocid="generator.preview.success_state"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-success"
                    >
                      <Check className="size-3.5" />
                      Ready
                    </span>
                  ) : null}
                </div>
                <div className="mt-5">
                  {generated && payload ? (
                    <div
                      data-ocid="generator.preview.panel"
                      className="animate-fade-up"
                    >
                      <StyledQrPreview
                        value={payload}
                        options={options}
                        style={style}
                        label={`QR code for ${category.title}`}
                      />
                    </div>
                  ) : (
                    <div
                      data-ocid="generator.preview.empty_state"
                      className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center"
                    >
                      {error ? (
                        <Loader2 className="size-6 text-muted-foreground" />
                      ) : (
                        <Sparkles className="size-6 text-primary" />
                      )}
                      <p className="text-sm font-medium text-foreground">
                        Your QR code appears here
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fill in the form and press Generate QR Code to see a
                        live preview.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-subtle">
                <DownloadPanel
                  payload={payload}
                  options={options}
                  style={style}
                  generated={generated}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-subtle sm:p-8">
              <CustomizationPanel
                options={options}
                setOptions={setOptions}
                resetOptions={resetOptions}
                style={style}
                setStyle={setStyle}
              />
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-subtle sm:p-8">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Switch generator
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Jump to another QR code type — your design settings stay put.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {QR_CATEGORIES.map((item) => (
                  <Button
                    key={item.id}
                    asChild
                    variant={item.id === category.id ? "default" : "outline"}
                    size="sm"
                    className="justify-start rounded-xl"
                  >
                    <Link
                      to="/generator"
                      search={{ type: item.id }}
                      data-ocid={`generator.switch.${item.id}`}
                    >
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GeneratorContent category={category.id} />
    </>
  );
}
