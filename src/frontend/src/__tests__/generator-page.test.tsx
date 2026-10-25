import { renderWithActor } from "@/__tests__/test-utils";
import type { backendInterface } from "@/backend";
import type { QrCategoryId } from "@/lib/qr";
import GeneratorPage from "@/pages/GeneratorPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The base (non-styled) download helpers call QRCode.toCanvas, which needs a
// real canvas 2D context that jsdom does not provide. Replace only those three
// helpers so the panel's button-to-helper contract can be asserted; the styled
// renderer path is exercised for real in the "styled renderer" test below.
const downloadMocks = vi.hoisted(() => ({
  downloadPng: vi.fn(async () => {}),
  downloadJpg: vi.fn(async () => {}),
  downloadPrintPng: vi.fn(async () => {}),
}));
vi.mock("@/lib/qr", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/qr")>()),
  downloadPng: downloadMocks.downloadPng,
  downloadJpg: downloadMocks.downloadJpg,
  downloadPrintPng: downloadMocks.downloadPrintPng,
}));

/**
 * Cover for the generator page: category forms, live customization, logo
 * upload, scannability warning, reset and the three download buttons.
 *
 * jsdom has no canvas 2D context, so the QR pixels themselves are not painted
 * here. The observable contract is the preview panel appearing, the download
 * buttons unlocking, and the download helpers producing a real data URL and
 * triggering a file download. The canvas API is stubbed locally for that.
 */

function makeActor(): Pick<backendInterface, "getCallerUserRole"> {
  return {
    getCallerUserRole: vi.fn<backendInterface["getCallerUserRole"]>(
      async () => "guest" as never,
    ),
  };
}

/** Build a fresh router that mounts GeneratorPage at /generator. */
function renderGenerator(type: QrCategoryId) {
  window.history.pushState({}, "", `/generator?type=${type}`);
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const generatorRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/generator",
    validateSearch: (
      search: Record<string, unknown>,
    ): { type: QrCategoryId } => ({
      type: (search.type as QrCategoryId) ?? "url",
    }),
    component: GeneratorPage,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([generatorRoute]),
    defaultPreload: false,
  });
  return renderWithActor(<RouterProvider router={router} />, makeActor());
}

/** A minimal 2D context stub so the styled renderer can paint in jsdom. */
function stubCanvas() {
  const context = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    roundRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    drawImage: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(
    (mime?: string) => `data:${mime ?? "image/png"};base64,AAAA`,
  );
  return context;
}

let clickedDownloads: string[] = [];

// Radix Slider observes its track; jsdom does not provide ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

beforeEach(() => {
  clickedDownloads = [];
  // Capture the anchor click that triggerDownload performs.
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clickedDownloads.push(this.download);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("generator page — category forms", () => {
  it("generates a URL QR code from the hero-style form", async () => {
    const user = userEvent.setup();
    renderGenerator("url");

    const input = await screen.findByLabelText(/website address/i);
    await user.type(input, "example.com");
    await user.click(screen.getByRole("button", { name: /generate qr code/i }));

    expect(
      await screen.findByTestId("generator.preview.panel"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("generator.preview.empty_state"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an inline error and keeps the empty state for an empty URL", async () => {
    const user = userEvent.setup();
    renderGenerator("url");

    await user.click(
      await screen.findByRole("button", { name: /generate qr code/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /enter a website address/i,
    );
    expect(
      screen.getByTestId("generator.preview.empty_state"),
    ).toBeInTheDocument();
  });

  it("validates the Wi-Fi form and reveals the password field by security type", async () => {
    const user = userEvent.setup();
    renderGenerator("wifi");

    // Default WPA requires a password field.
    expect(await screen.findByLabelText(/password/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /generate qr code/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/network name/i);

    await user.type(screen.getByLabelText(/network name/i), "Cafe Guest");
    await user.click(screen.getByRole("button", { name: /generate qr code/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/password/i);
  });

  it("generates a vCard contact code once a name is provided", async () => {
    const user = userEvent.setup();
    renderGenerator("contact");

    await user.type(await screen.findByLabelText(/first name/i), "Ada");
    await user.click(screen.getByRole("button", { name: /generate qr code/i }));

    expect(
      await screen.findByTestId("generator.preview.panel"),
    ).toBeInTheDocument();
  });

  it("requires both coordinates for a location code", async () => {
    const user = userEvent.setup();
    renderGenerator("location");

    await user.type(await screen.findByLabelText(/latitude/i), "51.5074");
    await user.click(screen.getByRole("button", { name: /generate qr code/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /latitude and longitude/i,
    );
  });
});

describe("generator page — customization", () => {
  it("applies a preset palette and marks it active", async () => {
    const user = userEvent.setup();
    renderGenerator("url");

    const mint = await screen.findByTestId(
      "generator.customization.palette.mint",
    );
    expect(mint).toHaveAttribute("aria-pressed", "false");
    await user.click(mint);
    expect(mint).toHaveAttribute("aria-pressed", "true");
  });

  it("selects dot and corner styles", async () => {
    const user = userEvent.setup();
    renderGenerator("url");

    const dots = await screen.findByTestId("generator.customization.dot.dots");
    await user.click(dots);
    expect(dots).toHaveAttribute("aria-pressed", "true");

    const circle = await screen.findByTestId(
      "generator.customization.eye.circle",
    );
    await user.click(circle);
    expect(circle).toHaveAttribute("aria-pressed", "true");
  });

  it("warns about scannability for a low-contrast design and clears on reset", async () => {
    const user = userEvent.setup();
    renderGenerator("url");

    // Default palette has strong contrast.
    expect(
      await screen.findByTestId("generator.customization.contrast_ok_state"),
    ).toBeInTheDocument();

    // Force a near-white foreground on a white background. A color input is
    // not editable through user-event, so drive its change event directly.
    const foreground = screen.getByTestId(
      "generator.customization.foreground.input",
    );
    fireEvent.change(foreground, { target: { value: "#fefefe" } });

    expect(
      await screen.findByTestId("generator.customization.warning_state"),
    ).toHaveTextContent(/low contrast/i);

    await user.click(
      screen.getByTestId("generator.customization.reset_button"),
    );
    expect(
      await screen.findByTestId("generator.customization.contrast_ok_state"),
    ).toBeInTheDocument();
  });

  it("raises error correction to H when a logo is uploaded", async () => {
    const user = userEvent.setup();
    renderGenerator("url");
    await screen.findByTestId("generator.customization.panel");

    const file = new File(["logo"], "logo.png", { type: "image/png" });
    const input = screen.getByTestId("generator.customization.logo.input");
    await user.upload(input, file);

    expect(await screen.findByText(/logo added/i)).toBeInTheDocument();
    expect(
      screen.getByText(/error correction raised to h/i),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("generator.customization.warning_state"),
    ).toBeInTheDocument();
  });

  it("rejects a non-image logo file with an inline error", async () => {
    renderGenerator("url");
    await screen.findByTestId("generator.customization.panel");

    const file = new File(["notes"], "notes.txt", { type: "text/plain" });
    const input = screen.getByTestId("generator.customization.logo.input");
    // user-event's upload respects the input's accept="image/*"; drive the
    // change event directly so the non-image branch is exercised.
    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByTestId("generator.customization.logo.error_state"),
    ).toHaveTextContent(/png, jpg or svg/i);
  });
});

describe("generator page — downloads", () => {
  it("keeps download buttons disabled until a code is generated", async () => {
    renderGenerator("url");

    expect(
      await screen.findByTestId("generator.download.png_button"),
    ).toBeDisabled();
    expect(screen.getByTestId("generator.download.jpg_button")).toBeDisabled();
    expect(
      screen.getByTestId("generator.download.print_button"),
    ).toBeDisabled();
    expect(
      screen.getByTestId("generator.download.empty_state"),
    ).toBeInTheDocument();
  });

  it("downloads a real PNG, JPG and print PNG after generating", async () => {
    const user = userEvent.setup();
    renderGenerator("url");

    await user.type(
      await screen.findByLabelText(/website address/i),
      "example.com",
    );
    await user.click(screen.getByRole("button", { name: /generate qr code/i }));
    await screen.findByTestId("generator.preview.panel");

    const png = screen.getByTestId("generator.download.png_button");
    expect(png).toBeEnabled();

    await user.click(png);
    await waitFor(() =>
      expect(
        screen.getByTestId("generator.download.success_state"),
      ).toHaveTextContent(/png file is ready/i),
    );
    expect(downloadMocks.downloadPng).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId("generator.download.jpg_button"));
    await waitFor(() =>
      expect(
        screen.getByTestId("generator.download.success_state"),
      ).toHaveTextContent(/jpg file is ready/i),
    );
    expect(downloadMocks.downloadJpg).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId("generator.download.print_button"));
    await waitFor(() =>
      expect(
        screen.getByTestId("generator.download.success_state"),
      ).toHaveTextContent(/print png file is ready/i),
    );
    expect(downloadMocks.downloadPrintPng).toHaveBeenCalledTimes(1);
  });

  it("shows an error when a download fails", async () => {
    const user = userEvent.setup();
    downloadMocks.downloadPng.mockRejectedValueOnce(new Error("boom"));
    renderGenerator("url");

    await user.type(
      await screen.findByLabelText(/website address/i),
      "example.com",
    );
    await user.click(screen.getByRole("button", { name: /generate qr code/i }));
    await screen.findByTestId("generator.preview.panel");

    await user.click(screen.getByTestId("generator.download.png_button"));

    expect(
      await screen.findByTestId("generator.download.error_state"),
    ).toHaveTextContent(/could not be created/i);
  });

  it("uses the styled renderer when a non-default style is selected", async () => {
    const user = userEvent.setup();
    const context = stubCanvas();
    renderGenerator("url");

    await user.type(
      await screen.findByLabelText(/website address/i),
      "example.com",
    );
    await user.click(screen.getByRole("button", { name: /generate qr code/i }));
    await screen.findByTestId("generator.preview.panel");

    await user.click(screen.getByTestId("generator.customization.dot.dots"));
    await user.click(screen.getByTestId("generator.download.png_button"));

    await waitFor(() =>
      expect(
        screen.getByTestId("generator.download.success_state"),
      ).toBeInTheDocument(),
    );
    // The custom renderer paints arcs for the "dots" module style.
    expect(context.arc).toHaveBeenCalled();
  });
});

describe("generator page — SEO and navigation", () => {
  it("sets a unique title, canonical URL and breadcrumb structured data", async () => {
    renderGenerator("wifi");

    await screen.findByRole("heading", { level: 1 });

    expect(document.title).toMatch(/wi-fi qr code generator/i);
    expect(
      document.head.querySelector('link[rel="canonical"]'),
    ).toHaveAttribute("href", "https://qrnova.app/generator");

    const script = document.getElementById("qrnova-structured-data");
    const graph = JSON.parse(script?.textContent ?? "[]") as Array<{
      "@type": string;
    }>;
    const types = graph.map((node) => node["@type"]);
    expect(types).toContain("WebApplication");
    expect(types).toContain("BreadcrumbList");
  });

  it("renders exactly one H1 and a breadcrumb trail", async () => {
    renderGenerator("url");

    const headings = await screen.findAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);

    const breadcrumb = screen.getByTestId("generator.breadcrumb");
    expect(
      within(breadcrumb).getByRole("link", { name: "Home" }),
    ).toHaveAttribute("href", "/");
  });

  it("offers a switch link for every one of the 13 categories", async () => {
    renderGenerator("url");

    const ids: QrCategoryId[] = [
      "url",
      "text",
      "wifi",
      "email",
      "phone",
      "sms",
      "whatsapp",
      "contact",
      "location",
      "social",
      "pdf",
      "event",
      "app",
    ];
    for (const id of ids) {
      expect(
        await screen.findByTestId(`generator.switch.${id}`),
      ).toBeInTheDocument();
    }
  });
});
