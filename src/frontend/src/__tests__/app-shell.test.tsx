import App from "@/App";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("app shell", () => {
  it("renders the homepage hero and navigation", async () => {
    render(<App />);
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /free qr code generator/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /generate qr code/i }).length,
    ).toBeGreaterThan(0);
  });

  it("renders the category grid with all 13 types", async () => {
    render(<App />);
    const grid = await screen.findByRole("heading", {
      name: /every qr code type/i,
    });
    expect(grid).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Wi-Fi" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "WhatsApp" }),
    ).toBeInTheDocument();
  });
});
