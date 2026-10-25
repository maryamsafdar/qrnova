import { renderQrToCanvas } from "@/lib/qr";
import type { QrRenderOptions } from "@/lib/qr";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface QrPreviewProps {
  value: string;
  options: QrRenderOptions;
  className?: string;
  /** Accessible description of what the code points to. */
  label?: string;
}

/**
 * Renders a QR code to a canvas. All generation happens in the browser so
 * user-entered data never leaves the device.
 */
export function QrPreview({
  value,
  options,
  className,
  label,
}: QrPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    let cancelled = false;

    renderQrToCanvas(canvas, value, options)
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
  }, [value, options]);

  if (error) {
    return (
      <div
        data-ocid="qr.error_state"
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
      data-ocid="qr.canvas_target"
      className={cn("h-auto w-full max-w-full rounded-2xl", className)}
    />
  );
}
