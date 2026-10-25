import App from "@/App";
import { renderWithActor } from "@/__tests__/test-utils";
import type { backendInterface } from "@/backend";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

/**
 * Characterization baseline for the working homepage behavior that the
 * generator/customization work must not regress. The tested tree is entirely
 * client-side, so the actor seam is a typed no-op fake.
 */
function makeActor(): Pick<backendInterface, "getCallerUserRole"> {
  return {
    getCallerUserRole: vi.fn<backendInterface["getCallerUserRole"]>(
      async () => "guest" as never,
    ),
  };
}

describe("homepage characterization", () => {
  it("renders the hero headline and the URL input", async () => {
    renderWithActor(<App />, makeActor());
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /free qr code generator/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/enter your website address/i),
    ).toBeInTheDocument();
  });

  it("shows an inline error and no preview when generating with an empty URL", async () => {
    const user = userEvent.setup();
    renderWithActor(<App />, makeActor());

    await user.click(
      await screen.findByRole("button", { name: /^generate$/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /enter a website address/i,
    );
    expect(screen.getByTestId("hero.preview.empty_state")).toBeInTheDocument();
  });

  it("swaps the empty state for the preview panel after generating from a valid URL", async () => {
    const user = userEvent.setup();
    renderWithActor(<App />, makeActor());

    const input = await screen.findByLabelText(/enter your website address/i);
    await user.type(input, "example.com");
    await user.click(screen.getByRole("button", { name: /^generate$/i }));

    // jsdom has no canvas 2D context, so the canvas itself cannot paint here;
    // the observable contract is that the empty state is replaced by the
    // preview panel and no validation error is shown.
    expect(await screen.findByTestId("hero.preview.panel")).toBeInTheDocument();
    expect(
      screen.queryByTestId("hero.preview.empty_state"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("lists all 13 category cards linking to the generator", async () => {
    renderWithActor(<App />, makeActor());

    const grid = await screen.findByTestId("categories.section");
    const items = within(grid).getAllByRole("listitem");
    expect(items).toHaveLength(13);

    for (const item of items) {
      expect(within(item).getByRole("link")).toHaveAttribute(
        "href",
        expect.stringContaining("/generator"),
      );
    }
  });

  it("exposes primary navigation and footer destinations", async () => {
    renderWithActor(<App />, makeActor());

    const primary = await screen.findByRole("navigation", { name: "Primary" });
    expect(
      within(primary).getByRole("link", { name: "QR Generator" }),
    ).toHaveAttribute("href", expect.stringContaining("/generator"));

    const company = screen.getByRole("navigation", { name: "Company" });
    expect(
      within(company).getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", expect.stringContaining("/privacy"));
    expect(
      within(company).getByRole("link", { name: "Terms of Service" }),
    ).toHaveAttribute("href", expect.stringContaining("/terms"));
  });

  it("applies a unique title, meta description and canonical URL", async () => {
    renderWithActor(<App />, makeActor());
    await screen.findByRole("heading", { level: 1 });

    expect(document.title).toMatch(/free qr code generator/i);
    expect(
      document.head.querySelector('meta[name="description"]'),
    ).toHaveAttribute("content", expect.stringMatching(/qr code/i));
    expect(
      document.head.querySelector('link[rel="canonical"]'),
    ).toHaveAttribute("href", "https://qrnova.app/");
  });

  it("emits WebApplication and BreadcrumbList structured data", async () => {
    renderWithActor(<App />, makeActor());
    await screen.findByRole("heading", { level: 1 });

    const script = document.getElementById("qrnova-structured-data");
    expect(script).not.toBeNull();
    const graph = JSON.parse(script?.textContent ?? "[]") as Array<{
      "@type": string;
    }>;
    const types = graph.map((node) => node["@type"]);
    expect(types).toContain("WebApplication");
    expect(types).toContain("BreadcrumbList");
  });
});
