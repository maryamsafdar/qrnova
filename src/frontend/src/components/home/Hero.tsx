import { QrPreview } from "@/components/qr/QrPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_RENDER_OPTIONS, encodeUrl, isValidUrl } from "@/lib/qr";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

export function Hero() {
  const [url, setUrl] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!url.trim()) {
      setError("Enter a website address to generate your QR code.");
      setPayload("");
      return;
    }
    if (!isValidUrl(url)) {
      setError(
        "Enter a valid website address, for example example.com or https://example.com.",
      );
      setPayload("");
      return;
    }
    setError(null);
    setPayload(encodeUrl(url));
  };

  return (
    <section className="relative overflow-hidden" data-ocid="hero.section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 top-10 size-72 rounded-full bg-primary/20 blur-3xl animate-aurora" />
        <div className="absolute right-0 top-0 size-80 rounded-full bg-accent/20 blur-3xl animate-aurora [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-chart-3/15 blur-3xl animate-aurora [animation-delay:4s]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-subtle backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            100% free · No account required
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Free</span> QR Code Generator —
            Create, Customize &amp; Download
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Generate QR codes for websites, Wi-Fi, contacts, social media and
            more. Customize colors and styles, then download a crisp PNG, JPG or
            high-resolution print file — all in your browser.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="glass rounded-3xl p-6 shadow-float sm:p-8">
            <label
              htmlFor="hero-url"
              className="text-sm font-medium text-foreground"
            >
              Enter your website address
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Input
                id="hero-url"
                type="url"
                inputMode="url"
                placeholder="https://www.example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleGenerate();
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "hero-url-error" : undefined}
                data-ocid="hero.url.input"
                className="h-12 rounded-full border-border bg-background/80 px-5 text-base"
              />
              <Button
                type="button"
                onClick={handleGenerate}
                data-ocid="hero.generate_button"
                className="h-12 shrink-0 rounded-full bg-gradient-primary px-7 text-base shadow-glow transition-transform hover:scale-[1.03]"
              >
                Generate
                <ArrowRight className="size-4" />
              </Button>
            </div>
            {error ? (
              <p
                id="hero-url-error"
                role="alert"
                data-ocid="hero.url.error_state"
                className="mt-3 text-sm text-destructive"
              >
                {error}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Your link is encoded locally — nothing is uploaded or stored.
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <Link
                  to="/generator"
                  search={{ type: "url" }}
                  data-ocid="hero.customize_button"
                >
                  <Wand2 className="size-4" />
                  Customize design
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full">
                <Link
                  to="/"
                  hash="categories"
                  data-ocid="hero.browse_categories_button"
                >
                  Browse all types
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-elevated">
              {payload ? (
                <div data-ocid="hero.preview.panel" className="animate-fade-up">
                  <QrPreview
                    value={payload}
                    options={{ ...DEFAULT_RENDER_OPTIONS, size: 320 }}
                    label={`QR code for ${url}`}
                  />
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-gradient-primary"
                    >
                      <Link
                        to="/generator"
                        search={{ type: "url" }}
                        data-ocid="hero.preview.download_button"
                      >
                        <Download className="size-4" />
                        Download
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Link
                        to="/generator"
                        search={{ type: "url" }}
                        data-ocid="hero.preview.customize_button"
                      >
                        Customize
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  data-ocid="hero.preview.empty_state"
                  className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-6" />
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    Your QR code appears here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enter a link and press Generate to see a live preview.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
