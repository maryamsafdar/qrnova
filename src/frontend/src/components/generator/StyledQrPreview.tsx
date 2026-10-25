import type { QrRenderOptions } from "@/lib/qr";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { type QrStyleOptions, renderStyledQr } from "./qrStyle";

interface StyledQrPreviewProps {
  value: string;
  options: QrRenderOptions;
  style: QrStyleOptions;
  className?: string;
  label?: string;
}

/**
 * Renders a QR code with the selected dot/eye styles and gradient foreground.
 * All generation happens in the browser so user data never leaves the device.
 */
export function StyledQrPreview({
  value,
  options,
  style,
  className,
  label,
}: StyledQrPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    let cancelled = false;

    renderStyledQr(canvas, value, options, style)
      .then(() => {
        if (!cancelled) setError(null);
      })
      .catch(() => {
        if (!cancelled)
          setError("This content could not be encoded. Try shortening it.");
      });

    return () => {
      cancelled = true;
    };
  }, [value, options, style]);

  if (error) {
    return (
      <div
        data-ocid="generator.preview.error_state"
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive",
          className,
        )}
      >
        {error}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label ?? "Generated QR code"}
      data-ocid="generator.preview.canvas_target"
      className={cn("h-auto w-full max-w-full rounded-2xl", className)}
    />
  );
}
