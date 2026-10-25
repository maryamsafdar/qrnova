import { Button } from "@/components/ui/button";
import type { QrRenderOptions } from "@/lib/qr";
import { downloadJpg, downloadPng, downloadPrintPng } from "@/lib/qr";
import { cn } from "@/lib/utils";
import { Check, Download, FileImage, Loader2, Printer } from "lucide-react";
import { useState } from "react";
import {
  type QrStyleOptions,
  downloadStyledJpg,
  downloadStyledPng,
  downloadStyledPrintPng,
  needsCustomRenderer,
} from "./qrStyle";

interface DownloadPanelProps {
  payload: string;
  options: QrRenderOptions;
  style: QrStyleOptions;
  generated: boolean;
}

type Format = "png" | "jpg" | "print";

const FORMATS: {
  format: Format;
  label: string;
  description: string;
  icon: typeof Download;
}[] = [
  {
    format: "png",
    label: "Download PNG",
    description: "Transparent-ready, best for screens",
    icon: Download,
  },
  {
    format: "jpg",
    label: "Download JPG",
    description: "Flattened image for documents",
    icon: FileImage,
  },
  {
    format: "print",
    label: "Print PNG (2048px)",
    description: "High resolution for printing",
    icon: Printer,
  },
];

export function DownloadPanel({
  payload,
  options,
  style,
  generated,
}: DownloadPanelProps) {
  const [busy, setBusy] = useState<Format | null>(null);
  const [done, setDone] = useState<Format | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (format: Format) => {
    if (!payload) return;
    setBusy(format);
    setError(null);
    setDone(null);
    try {
      const custom = needsCustomRenderer(style);
      if (format === "png") {
        if (custom) await downloadStyledPng(payload, options, style);
        else await downloadPng(payload, options);
      } else if (format === "jpg") {
        if (custom) await downloadStyledJpg(payload, options, style);
        else await downloadJpg(payload, options);
      } else if (custom) {
        await downloadStyledPrintPng(payload, options, style);
      } else {
        await downloadPrintPng(payload, options);
      }
      setDone(format);
    } catch {
      setError("The download could not be created. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3" data-ocid="generator.download.panel">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Download your code
      </h2>
      <div className="grid gap-2">
        {FORMATS.map(({ format, label, description, icon: Icon }) => (
          <Button
            key={format}
            type="button"
            variant={format === "png" ? "default" : "outline"}
            disabled={!generated || busy !== null}
            onClick={() => handleDownload(format)}
            data-ocid={`generator.download.${format}_button`}
            className={cn(
              "h-auto justify-start gap-3 rounded-xl px-4 py-3 text-left",
              format === "png" && "bg-gradient-primary shadow-glow",
            )}
          >
            {busy === format ? (
              <Loader2 className="size-4 shrink-0 animate-spin" />
            ) : done === format ? (
              <Check className="size-4 shrink-0" />
            ) : (
              <Icon className="size-4 shrink-0" />
            )}
            <span className="flex flex-col">
              <span className="text-sm font-medium">{label}</span>
              <span
                className={cn(
                  "text-xs",
                  format === "png"
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {description}
              </span>
            </span>
          </Button>
        ))}
      </div>
      {!generated ? (
        <p
          data-ocid="generator.download.empty_state"
          className="text-xs text-muted-foreground"
        >
          Generate a QR code to unlock the download buttons.
        </p>
      ) : null}
      {done ? (
        <output
          data-ocid="generator.download.success_state"
          className="flex items-center gap-2 text-sm text-success"
        >
          <Check className="size-4" />
          Your {done === "print" ? "print PNG" : done.toUpperCase()} file is
          ready.
        </output>
      ) : null}
      {error ? (
        <p
          role="alert"
          data-ocid="generator.download.error_state"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
