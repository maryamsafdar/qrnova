import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { QrRenderOptions } from "@/lib/qr";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, RotateCcw, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import type { DotStyle, EyeStyle, QrStyleOptions } from "./qrStyle";

interface Palette {
  name: string;
  foreground: string;
  background: string;
  gradientEnd?: string;
}

const PALETTES: Palette[] = [
  { name: "Classic", foreground: "#1e1b3a", background: "#ffffff" },
  { name: "Lavender", foreground: "#5b4bd6", background: "#f6f4ff" },
  { name: "Mint", foreground: "#0f766e", background: "#f0fdf9" },
  { name: "Ocean", foreground: "#1d4ed8", background: "#eff6ff" },
  { name: "Sunset", foreground: "#b91c1c", background: "#fff7ed" },
  {
    name: "Aurora",
    foreground: "#6d28d9",
    background: "#ffffff",
    gradientEnd: "#0ea5e9",
  },
];

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "diamond", label: "Diamond" },
];

const EYE_STYLES: { value: EyeStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
];

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/** Relative luminance of a hex color, used for the contrast warning. */
function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const r = Number.parseInt(full.slice(0, 2), 16) / 255;
  const g = Number.parseInt(full.slice(2, 4), 16) / 255;
  const b = Number.parseInt(full.slice(4, 6), 16) / 255;
  const channel = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

interface CustomizationPanelProps {
  options: QrRenderOptions;
  setOptions: (next: Partial<QrRenderOptions>) => void;
  resetOptions: () => void;
  style: QrStyleOptions;
  setStyle: (next: Partial<QrStyleOptions>) => void;
}

export function CustomizationPanel({
  options,
  setOptions,
  resetOptions,
  style,
  setStyle,
}: CustomizationPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const ratio = contrastRatio(options.foreground, options.background);
  const lowContrast = ratio < 3;
  const hasLogo = Boolean(options.logoDataUrl);
  const warning =
    lowContrast || hasLogo || style.dotStyle === "dots" || style.gradientEnd;

  const handleLogo = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Choose a PNG, JPG or SVG image file.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoError(null);
      setOptions({
        logoDataUrl: String(reader.result),
        errorCorrectionLevel: "H",
      });
    };
    reader.onerror = () => setLogoError("That image could not be read.");
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setLogoError(null);
    setOptions({ logoDataUrl: undefined, errorCorrectionLevel: "M" });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6" data-ocid="generator.customization.panel">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Customize design
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            resetOptions();
            setStyle({
              dotStyle: "square",
              eyeStyle: "square",
              gradientEnd: null,
            });
            clearLogo();
          }}
          data-ocid="generator.customization.reset_button"
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Preset palettes
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((palette) => {
            const active =
              options.foreground === palette.foreground &&
              options.background === palette.background &&
              (style.gradientEnd ?? null) === (palette.gradientEnd ?? null);
            return (
              <button
                key={palette.name}
                type="button"
                onClick={() => {
                  setStyle({ gradientEnd: palette.gradientEnd ?? null });
                  setOptions({
                    foreground: palette.foreground,
                    background: palette.background,
                  });
                }}
                aria-pressed={active}
                data-ocid={`generator.customization.palette.${palette.name.toLowerCase()}`}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-all",
                  active
                    ? "border-primary bg-primary/5 text-foreground shadow-subtle"
                    : "border-border bg-background/60 text-muted-foreground hover:border-primary/40",
                )}
              >
                <span
                  className="size-7 rounded-lg border border-border"
                  style={{
                    background: palette.gradientEnd
                      ? `linear-gradient(135deg, ${palette.foreground}, ${palette.gradientEnd})`
                      : palette.foreground,
                  }}
                  aria-hidden="true"
                />
                {palette.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="generator.customization.foreground"
            className="text-sm font-medium text-foreground"
          >
            Foreground color
          </Label>
          <div className="flex items-center gap-3">
            <input
              id="generator.customization.foreground"
              type="color"
              value={options.foreground}
              onChange={(event) =>
                setOptions({ foreground: event.target.value })
              }
              data-ocid="generator.customization.foreground.input"
              className="size-10 cursor-pointer rounded-lg border border-input bg-background"
            />
            <span className="font-mono text-xs uppercase text-muted-foreground">
              {options.foreground}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="generator.customization.background"
            className="text-sm font-medium text-foreground"
          >
            Background color
          </Label>
          <div className="flex items-center gap-3">
            <input
              id="generator.customization.background"
              type="color"
              value={options.background}
              onChange={(event) =>
                setOptions({ background: event.target.value })
              }
              data-ocid="generator.customization.background.input"
              className="size-10 cursor-pointer rounded-lg border border-input bg-background"
            />
            <span className="font-mono text-xs uppercase text-muted-foreground">
              {options.background}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
        <div className="pr-4">
          <Label
            htmlFor="generator.customization.gradient"
            className="text-sm font-medium text-foreground"
          >
            Gradient foreground
          </Label>
          <p className="text-xs text-muted-foreground">
            Blend the foreground into a second color.
          </p>
        </div>
        <Switch
          id="generator.customization.gradient"
          checked={Boolean(style.gradientEnd)}
          onCheckedChange={(checked) =>
            setStyle({ gradientEnd: checked ? "#0ea5e9" : null })
          }
          data-ocid="generator.customization.gradient.switch"
        />
      </div>
      {style.gradientEnd ? (
        <div className="space-y-2">
          <Label
            htmlFor="generator.customization.gradientEnd"
            className="text-sm font-medium text-foreground"
          >
            Gradient end color
          </Label>
          <input
            id="generator.customization.gradientEnd"
            type="color"
            value={style.gradientEnd}
            onChange={(event) => setStyle({ gradientEnd: event.target.value })}
            data-ocid="generator.customization.gradient_end.input"
            className="size-10 cursor-pointer rounded-lg border border-input bg-background"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Dot style</Label>
        <div className="grid grid-cols-4 gap-2">
          {DOT_STYLES.map((dot) => (
            <button
              key={dot.value}
              type="button"
              onClick={() => setStyle({ dotStyle: dot.value })}
              aria-pressed={style.dotStyle === dot.value}
              data-ocid={`generator.customization.dot.${dot.value}`}
              className={cn(
                "rounded-xl border px-2 py-2 text-xs font-medium transition-all",
                style.dotStyle === dot.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:border-primary/40",
              )}
            >
              {dot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Corner / eye style
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {EYE_STYLES.map((eye) => (
            <button
              key={eye.value}
              type="button"
              onClick={() => setStyle({ eyeStyle: eye.value })}
              aria-pressed={style.eyeStyle === eye.value}
              data-ocid={`generator.customization.eye.${eye.value}`}
              className={cn(
                "rounded-xl border px-2 py-2 text-xs font-medium transition-all",
                style.eyeStyle === eye.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:border-primary/40",
              )}
            >
              {eye.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Center logo
        </Label>
        {hasLogo ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
            <img
              src={options.logoDataUrl}
              alt="Uploaded center logo"
              className="size-12 rounded-lg border border-border object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                Logo added
              </p>
              <p className="text-xs text-muted-foreground">
                Error correction raised to H for reliability.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearLogo}
              aria-label="Remove logo"
              data-ocid="generator.customization.logo_remove_button"
              className="rounded-full"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            data-ocid="generator.customization.logo_upload_button"
            className="w-full rounded-xl border-dashed"
          >
            <Upload className="size-4" />
            Upload a logo (PNG, JPG or SVG)
          </Button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(event) => handleLogo(event.target.files?.[0])}
          className="sr-only"
          data-ocid="generator.customization.logo.input"
        />
        {logoError ? (
          <p
            role="alert"
            data-ocid="generator.customization.logo.error_state"
            className="text-sm text-destructive"
          >
            {logoError}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">
            Output resolution
          </Label>
          <span className="font-mono text-xs text-muted-foreground">
            {options.size}px
          </span>
        </div>
        <Slider
          value={[options.size]}
          min={200}
          max={1024}
          step={8}
          onValueChange={([value]) => setOptions({ size: value })}
          aria-label="Output resolution in pixels"
          data-ocid="generator.customization.size.slider"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
        <div className="pr-4">
          <Label
            htmlFor="generator.customization.padding"
            className="text-sm font-medium text-foreground"
          >
            White padding (quiet zone)
          </Label>
          <p className="text-xs text-muted-foreground">
            Adds a clear margin so scanners lock on faster.
          </p>
        </div>
        <Switch
          id="generator.customization.padding"
          checked={options.margin > 0}
          onCheckedChange={(checked) => setOptions({ margin: checked ? 2 : 0 })}
          data-ocid="generator.customization.padding.switch"
        />
      </div>

      {warning ? (
        <output
          data-ocid="generator.customization.warning_state"
          className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-foreground"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p>
            {lowContrast
              ? "Low contrast between foreground and background may stop some phones from scanning. Try a darker foreground or lighter background."
              : "This design may reduce scannability. Test with more than one phone before printing."}
          </p>
        </output>
      ) : (
        <output
          data-ocid="generator.customization.contrast_ok_state"
          className="flex gap-3 rounded-xl border border-success/40 bg-success/10 p-3 text-sm text-foreground"
        >
          <Check className="mt-0.5 size-4 shrink-0 text-success" />
          <p>Strong contrast — this design should scan reliably.</p>
        </output>
      )}
    </div>
  );
}
