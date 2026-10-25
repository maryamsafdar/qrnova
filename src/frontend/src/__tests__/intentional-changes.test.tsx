import { renderWithActor } from "@/__tests__/test-utils";
import type { backendInterface } from "@/backend";
import { Hero } from "@/components/home/Hero";
import { EMPTY_DRAFT, buildPayload } from "@/hooks/useGenerator";
import { encodeEvent, isValidUrl } from "@/lib/qr";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

/**
 * Cover for the two intentional changes in this build:
 *  1. The URL generator rejects a malformed URL with an inline error instead of
 *     encoding a broken code (isValidUrl + the Hero/generator error branch).
 *  2. The event generator's link field is encoded as the iCalendar URL property
 *     rather than as description text.
 */

function makeActor(): Pick<backendInterface, "getCallerUserRole"> {
  return {
    getCallerUserRole: vi.fn<backendInterface["getCallerUserRole"]>(
      async () => "guest" as never,
    ),
  };
}

/** Hero renders router Links, so it must mount inside a RouterProvider. */
function renderHero() {
  window.history.pushState({}, "", "/");
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Hero,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    defaultPreload: false,
  });
  return renderWithActor(<RouterProvider router={router} />, makeActor());
}

describe("isValidUrl — malformed URL rejection", () => {
  it("accepts a bare host and a full https URL", () => {
    expect(isValidUrl("example.com")).toBe(true);
    expect(isValidUrl("https://example.com/path?q=1")).toBe(true);
    expect(isValidUrl("http://localhost:3000")).toBe(true);
  });

  it("accepts non-web schemes such as mailto and tel", () => {
    expect(isValidUrl("mailto:hi@example.com")).toBe(true);
    expect(isValidUrl("tel:+15550100199")).toBe(true);
  });

  it("rejects blank, scheme-less garbage and a bare word", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("   ")).toBe(false);
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("hello")).toBe(false);
  });
});

describe("buildPayload — URL category rejects malformed input", () => {
  it("returns an inline error and no payload for a malformed URL", () => {
    const result = buildPayload("url", { ...EMPTY_DRAFT, url: "not a url" });
    expect(result.value).toBe("");
    expect(result.error).toMatch(/valid website address/i);
  });

  it("returns an inline error for an empty URL", () => {
    const result = buildPayload("url", { ...EMPTY_DRAFT, url: "  " });
    expect(result.value).toBe("");
    expect(result.error).toMatch(/enter a website address/i);
  });

  it("encodes a valid URL with the https scheme added", () => {
    const result = buildPayload("url", { ...EMPTY_DRAFT, url: "example.com" });
    expect(result.error).toBeNull();
    expect(result.value).toBe("https://example.com");
  });
});

describe("Hero — malformed URL shows an inline error and no preview", () => {
  it("rejects a malformed URL without producing a preview", async () => {
    const user = userEvent.setup();
    renderHero();

    const input = await screen.findByLabelText(/enter your website address/i);
    await user.type(input, "not a url");
    await user.click(screen.getByRole("button", { name: /^generate$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /valid website address/i,
    );
    expect(screen.getByTestId("hero.preview.empty_state")).toBeInTheDocument();
    expect(screen.queryByTestId("hero.preview.panel")).not.toBeInTheDocument();
  });

  it("still generates a preview for a valid URL", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.type(
      await screen.findByLabelText(/enter your website address/i),
      "example.com",
    );
    await user.click(screen.getByRole("button", { name: /^generate$/i }));

    expect(await screen.findByTestId("hero.preview.panel")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("encodeEvent — link field is encoded as a URL property", () => {
  it("emits a URL line for the event link", () => {
    const ics = encodeEvent({
      title: "Launch",
      location: "London",
      start: "2026-01-01T10:00",
      end: "2026-01-01T12:00",
      url: "example.com/rsvp",
    });
    expect(ics).toContain("URL:https://example.com/rsvp");
  });

  it("does not put the link into the description", () => {
    const ics = encodeEvent({
      title: "Launch",
      location: "London",
      start: "2026-01-01T10:00",
      end: "2026-01-01T12:00",
      url: "https://example.com/rsvp",
    });
    expect(ics).not.toContain("DESCRIPTION:https://example.com/rsvp");
  });

  it("omits the URL line when no link is provided", () => {
    const ics = encodeEvent({
      title: "Launch",
      location: "London",
      start: "2026-01-01T10:00",
      end: "2026-01-01T12:00",
    });
    expect(ics).not.toContain("URL:");
  });
});
