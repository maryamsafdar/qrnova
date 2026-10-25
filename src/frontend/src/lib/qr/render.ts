import QRCode from "qrcode";
import type { QrRenderOptions } from "./types";

export const DEFAULT_RENDER_OPTIONS: QrRenderOptions = {
  size: 320,
  margin: 2,
  foreground: "#1e1b3a",
  background: "#ffffff",
  errorCorrectionLevel: "M",
};

/** Render a QR code onto a canvas element. Returns the canvas for reuse. */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  value: string,
  options: QrRenderOptions,
): Promise<HTMLCanvasElement> {
  await QRCode.toCanvas(canvas, value, {
    width: options.size,
    margin: options.margin,
    errorCorrectionLevel: options.errorCorrectionLevel,
    color: { dark: options.foreground, light: options.background },
  });

  if (options.logoDataUrl) {
    await drawLogo(canvas, options.logoDataUrl, options.logoSizeRatio ?? 0.22);
  }
  return canvas;
}

/** Generate a PNG data URL for the given value and options. */
export async function renderQrToDataUrl(
  value: string,
  options: QrRenderOptions,
): Promise<string> {
  const canvas = document.createElement("canvas");
  await renderQrToCanvas(canvas, value, options);
  return canvas.toDataURL("image/png");
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

/** Download the QR code as a PNG at the configured size. */
export async function downloadPng(
  value: string,
  options: QrRenderOptions,
  filename = "qrnova-code.png",
): Promise<void> {
  const dataUrl = await renderQrToDataUrl(value, options);
  triggerDownload(dataUrl, filename);
}

/** Download the QR code as a JPG (flattened onto the background color). */
export async function downloadJpg(
  value: string,
  options: QrRenderOptions,
  filename = "qrnova-code.jpg",
): Promise<void> {
  const canvas = document.createElement("canvas");
  await renderQrToCanvas(canvas, value, options);
  triggerDownload(canvas.toDataURL("image/jpeg", 0.95), filename);
}

/** Download a high-resolution print PNG (2048px) for physical printing. */
export async function downloadPrintPng(
  value: string,
  options: QrRenderOptions,
  filename = "qrnova-print.png",
): Promise<void> {
  const printOptions: QrRenderOptions = { ...options, size: 2048 };
  const dataUrl = await renderQrToDataUrl(value, printOptions);
  triggerDownload(dataUrl, filename);
}
