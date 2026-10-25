import type { QrRenderOptions } from "@/lib/qr";
import QRCode from "qrcode";

export type DotStyle = "square" | "rounded" | "dots" | "diamond";
export type EyeStyle = "square" | "rounded" | "circle";

export interface QrStyleOptions {
  dotStyle: DotStyle;
  eyeStyle: EyeStyle;
  /** Optional second color; when set the foreground is painted as a gradient. */
  gradientEnd: string | null;
}

export const DEFAULT_QR_STYLE: QrStyleOptions = {
  dotStyle: "square",
  eyeStyle: "square",
  gradientEnd: null,
};

/** True when the style needs the custom module renderer instead of the base one. */
export function needsCustomRenderer(style: QrStyleOptions): boolean {
  return (
    style.dotStyle !== "square" ||
    style.eyeStyle !== "square" ||
    style.gradientEnd !== null
  );
}

function isFinder(row: number, col: number, size: number): boolean {
  const inTopLeft = row < 7 && col < 7;
  const inTopRight = row < 7 && col >= size - 7;
  const inBottomLeft = row >= size - 7 && col < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

function makeForegroundPaint(
  ctx: CanvasRenderingContext2D,
  size: number,
  options: QrRenderOptions,
  style: QrStyleOptions,
): string | CanvasGradient {
  if (!style.gradientEnd) return options.foreground;
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, options.foreground);
  gradient.addColorStop(1, style.gradientEnd);
  return gradient;
}

function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  module: number,
  style: DotStyle,
): void {
  const inset = module * 0.06;
  const size = module - inset * 2;
  const cx = x + module / 2;
  const cy = y + module / 2;

  switch (style) {
    case "dots": {
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "rounded": {
      ctx.beginPath();
      ctx.roundRect(x + inset, y + inset, size, size, size * 0.32);
      ctx.fill();
      break;
    }
    case "diamond": {
      ctx.beginPath();
      ctx.moveTo(cx, y + inset);
      ctx.lineTo(x + module - inset, cy);
      ctx.lineTo(cx, y + module - inset);
      ctx.lineTo(x + inset, cy);
      ctx.closePath();
      ctx.fill();
      break;
    }
    default: {
      ctx.fillRect(x, y, module, module);
    }
  }
}

function drawEye(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  module: number,
  style: EyeStyle,
  background: string,
  foreground: string | CanvasGradient,
): void {
  const outer = module * 7;
  const ring = module;
  const innerSize = module * 3;
  const innerOffset = module * 2;

  ctx.save();
  ctx.beginPath();
  if (style === "circle") {
    ctx.arc(
      originX + outer / 2,
      originY + outer / 2,
      outer / 2,
      0,
      Math.PI * 2,
    );
  } else if (style === "rounded") {
    ctx.roundRect(originX, originY, outer, outer, module * 2);
  } else {
    ctx.rect(originX, originY, outer, outer);
  }
  ctx.fill();

  // Paint the light ring in the background color so the finder pattern reads.
  ctx.fillStyle = background;
  ctx.beginPath();
  if (style === "circle") {
    ctx.arc(
      originX + outer / 2,
      originY + outer / 2,
      outer / 2 - ring,
      0,
      Math.PI * 2,
    );
  } else if (style === "rounded") {
    ctx.roundRect(
      originX + ring,
      originY + ring,
      outer - ring * 2,
      outer - ring * 2,
      module * 1.4,
    );
  } else {
    ctx.rect(
      originX + ring,
      originY + ring,
      outer - ring * 2,
      outer - ring * 2,
    );
  }
  ctx.fill();

  // Restore the foreground paint for the inner eye square.
  ctx.fillStyle = foreground;
  ctx.beginPath();
  if (style === "circle") {
    ctx.arc(
      originX + innerOffset + innerSize / 2,
      originY + innerOffset + innerSize / 2,
      innerSize / 2,
      0,
      Math.PI * 2,
    );
  } else if (style === "rounded") {
    ctx.roundRect(
      originX + innerOffset,
      originY + innerOffset,
      innerSize,
      innerSize,
      module * 0.8,
    );
  } else {
    ctx.rect(
      originX + innerOffset,
      originY + innerOffset,
      innerSize,
      innerSize,
    );
  }
  ctx.fill();
  ctx.restore();
}

/**
 * Render a QR code with custom dot and eye styles plus an optional gradient
 * foreground. Falls back to the shared renderer when the style is the default.
 */
export async function renderStyledQr(
  canvas: HTMLCanvasElement,
  value: string,
  options: QrRenderOptions,
  style: QrStyleOptions,
): Promise<HTMLCanvasElement> {
  const qr = QRCode.create(value, {
    errorCorrectionLevel: options.errorCorrectionLevel,
  });
  const modules = qr.modules;
  const count = modules.size;
  const margin = options.margin;
  const total = count + margin * 2;
  const size = options.size;
  const module = size / total;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, size, size);

  const foreground = makeForegroundPaint(ctx, size, options, style);
  ctx.fillStyle = foreground;

  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!modules.data[row * count + col]) continue;
      if (isFinder(row, col, count)) continue;
      drawModule(
        ctx,
        (col + margin) * module,
        (row + margin) * module,
        module,
        style.dotStyle,
      );
    }
  }

  const eyeOrigins: Array<[number, number]> = [
    [margin, margin],
    [margin + count - 7, margin],
    [margin, margin + count - 7],
  ];
  for (const [col, row] of eyeOrigins) {
    drawEye(
      ctx,
      col * module,
      row * module,
      module,
      style.eyeStyle,
      options.background,
      foreground,
    );
  }

  if (options.logoDataUrl) {
    await drawLogo(canvas, options.logoDataUrl, options.logoSizeRatio ?? 0.22);
  }

  return canvas;
}

async function drawLogo(
  canvas: HTMLCanvasElement,
  logoDataUrl: string,
  ratio: number,
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const image = await loadImage(logoDataUrl);
  const logoSize = canvas.width * ratio;
  const offset = (canvas.width - logoSize) / 2;
  const pad = logoSize * 0.12;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(
    offset - pad,
    offset - pad,
    logoSize + pad * 2,
    logoSize + pad * 2,
    logoSize * 0.18,
  );
  ctx.fill();
  ctx.drawImage(image, offset, offset, logoSize, logoSize);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Logo image could not be loaded"));
    image.src = src;
  });
}

function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Download the styled QR code as a PNG at the configured size. */
export async function downloadStyledPng(
  value: string,
  options: QrRenderOptions,
  style: QrStyleOptions,
  filename = "qrnova-code.png",
): Promise<void> {
  const canvas = document.createElement("canvas");
  await renderStyledQr(canvas, value, options, style);
  triggerDownload(canvas.toDataURL("image/png"), filename);
}

/** Download the styled QR code as a JPG flattened onto the background color. */
export async function downloadStyledJpg(
  value: string,
  options: QrRenderOptions,
  style: QrStyleOptions,
  filename = "qrnova-code.jpg",
): Promise<void> {
  const canvas = document.createElement("canvas");
  await renderStyledQr(canvas, value, options, style);
  triggerDownload(canvas.toDataURL("image/jpeg", 0.95), filename);
}

/** Download a high-resolution (2048px) print PNG of the styled QR code. */
export async function downloadStyledPrintPng(
  value: string,
  options: QrRenderOptions,
  style: QrStyleOptions,
  filename = "qrnova-print.png",
): Promise<void> {
  const canvas = document.createElement("canvas");
  await renderStyledQr(canvas, value, { ...options, size: 2048 }, style);
  triggerDownload(canvas.toDataURL("image/png"), filename);
}
