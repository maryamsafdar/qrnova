import {
  encodeApp,
  encodeContact,
  encodeEmail,
  encodeEvent,
  encodeLocation,
  encodePdf,
  encodePhone,
  encodeSms,
  encodeSocial,
  encodeText,
  encodeUrl,
  encodeWhatsApp,
  encodeWifi,
  normalizeUrl,
} from "@/lib/qr";
import { describe, expect, it } from "vitest";

/**
 * Typed consumer contract for the 13 QR payload encoders. These are the exact
 * strings handed to the QR renderer, so a wrong prefix or separator here
 * produces a code that scans to the wrong content type.
 */

describe("qr encoders — URL and text", () => {
  it("adds https:// when the scheme is missing", () => {
    expect(encodeUrl("example.com")).toBe("https://example.com");
    expect(normalizeUrl("  example.com  ")).toBe("https://example.com");
  });

  it("keeps an explicit scheme untouched", () => {
    expect(encodeUrl("http://example.com")).toBe("http://example.com");
    expect(encodeUrl("mailto:a@b.com")).toBe("mailto:a@b.com");
  });

  it("returns an empty string for blank input", () => {
    expect(normalizeUrl("   ")).toBe("");
  });

  it("passes text through unchanged", () => {
    expect(encodeText("Hello, world!")).toBe("Hello, world!");
  });
});

describe("qr encoders — Wi-Fi", () => {
  it("encodes a WPA network with password", () => {
    expect(
      encodeWifi({
        ssid: "Cafe Guest",
        password: "secret",
        encryption: "WPA",
        hidden: false,
      }),
    ).toBe("WIFI:T:WPA;S:Cafe Guest;P:secret;;");
  });

  it("omits the password for an open network", () => {
    expect(
      encodeWifi({
        ssid: "Open",
        password: "",
        encryption: "nopass",
        hidden: false,
      }),
    ).toBe("WIFI:T:nopass;S:Open;;");
  });

  it("marks a hidden network and escapes reserved characters", () => {
    expect(
      encodeWifi({
        ssid: "My;Net",
        password: "p:a,s",
        encryption: "WEP",
        hidden: true,
      }),
    ).toBe("WIFI:T:WEP;S:My\\;Net;P:p\\:a\\,s;H:true;;");
  });

  it("escapes a semicolon in the SSID and a colon in the password", () => {
    expect(
      encodeWifi({
        ssid: "Cafe;Guest",
        password: "p@ss:word",
        encryption: "WPA",
        hidden: false,
      }),
    ).toBe("WIFI:T:WPA;S:Cafe\\;Guest;P:p@ss\\:word;;");
  });
});

describe("qr encoders — email, phone, SMS, WhatsApp", () => {
  it("builds a mailto with subject and body", () => {
    expect(
      encodeEmail({ to: "hi@example.com", subject: "Hello", body: "World" }),
    ).toBe("mailto:hi@example.com?subject=Hello&body=World");
  });

  it("builds a bare mailto when subject and body are empty", () => {
    expect(encodeEmail({ to: "hi@example.com", subject: "", body: "" })).toBe(
      "mailto:hi@example.com",
    );
  });

  it("strips spaces from a tel payload", () => {
    expect(encodePhone("+1 555 010 0199")).toBe("tel:+15550100199");
  });

  it("builds an SMSTO payload with and without a message", () => {
    expect(encodeSms({ phone: "+1 555 010 0199", message: "Hi" })).toBe(
      "SMSTO:+15550100199:Hi",
    );
    expect(encodeSms({ phone: "+1 555 010 0199", message: "" })).toBe(
      "SMSTO:+15550100199",
    );
  });

  it("builds a wa.me link with an encoded message", () => {
    expect(encodeWhatsApp("+1 (555) 010-0199", "Hi there")).toBe(
      "https://wa.me/15550100199?text=Hi%20there",
    );
    expect(encodeWhatsApp("+1 555 010 0199", "")).toBe(
      "https://wa.me/15550100199",
    );
  });
});

describe("qr encoders — contact, location, social", () => {
  it("builds a vCard with the provided fields", () => {
    const vcard = encodeContact({
      firstName: "Ada",
      lastName: "Lovelace",
      organization: "Analytical Engines",
      title: "Lead",
      phone: "+1 555",
      email: "ada@example.com",
      website: "example.com",
      address: "London",
      note: "Met at conf",
    });
    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("VERSION:3.0");
    expect(vcard).toContain("N:Lovelace;Ada;;;");
    expect(vcard).toContain("FN:Ada Lovelace");
    expect(vcard).toContain("ORG:Analytical Engines");
    expect(vcard).toContain("TEL;TYPE=CELL:+1 555");
    expect(vcard).toContain("EMAIL:ada@example.com");
    expect(vcard).toContain("URL:https://example.com");
    expect(vcard).toContain("END:VCARD");
  });

  it("omits empty vCard fields", () => {
    const vcard = encodeContact({
      firstName: "Ada",
      lastName: "",
      organization: "",
      title: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      note: "",
    });
    expect(vcard).not.toContain("ORG:");
    expect(vcard).not.toContain("TEL");
    expect(vcard).toContain("FN:Ada");
  });

  it("escapes newlines in a vCard note", () => {
    const vcard = encodeContact({
      firstName: "Ada",
      lastName: "Lovelace",
      organization: "Analytical",
      title: "Engineer",
      phone: "+15550100",
      email: "ada@example.com",
      website: "example.com",
      address: "London",
      note: "Line1\nLine2",
    });
    expect(vcard).toContain("NOTE:Line1\\nLine2");
  });

  it("builds a Google Maps link from coordinates", () => {
    expect(
      encodeLocation({ latitude: "51.5074", longitude: "-0.1278", label: "" }),
    ).toBe("https://www.google.com/maps/search/?api=1&query=51.5074%2C-0.1278");
  });

  it("appends a place label when provided", () => {
    expect(
      encodeLocation({ latitude: "1", longitude: "2", label: "Studio" }),
    ).toContain("query_place_id=Studio");
  });

  it("maps each social platform to its profile URL", () => {
    expect(encodeSocial({ platform: "instagram", handle: "@ada" })).toBe(
      "https://instagram.com/ada",
    );
    expect(encodeSocial({ platform: "x", handle: "ada" })).toBe(
      "https://x.com/ada",
    );
    expect(encodeSocial({ platform: "linkedin", handle: "ada" })).toBe(
      "https://linkedin.com/in/ada",
    );
    expect(encodeSocial({ platform: "tiktok", handle: "ada" })).toBe(
      "https://tiktok.com/@ada",
    );
    expect(encodeSocial({ platform: "youtube", handle: "ada" })).toBe(
      "https://youtube.com/@ada",
    );
  });

  it("normalizes a custom social URL", () => {
    expect(encodeSocial({ platform: "other", handle: "example.com/me" })).toBe(
      "https://example.com/me",
    );
  });
});

describe("qr encoders — PDF, event, app", () => {
  it("normalizes a PDF link", () => {
    expect(encodePdf("example.com/menu.pdf")).toBe(
      "https://example.com/menu.pdf",
    );
  });

  it("builds an iCalendar event with UTC timestamps", () => {
    const ics = encodeEvent({
      title: "Launch",
      location: "London",
      start: "2026-01-01T10:00",
      end: "2026-01-01T12:00",
      description: "https://example.com/rsvp",
    });
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:Launch");
    expect(ics).toContain("DTSTART:");
    expect(ics).toContain("DTEND:");
    expect(ics).toContain("LOCATION:London");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("builds a redirect link when both store URLs are present", () => {
    const link = encodeApp({
      iosUrl: "https://apps.apple.com/app/id1",
      androidUrl: "https://play.google.com/store/apps/details?id=com.x",
      fallbackUrl: "",
    });
    expect(link).toContain("https://qrnova.app/redirect?ios=");
    expect(link).toContain("&android=");
  });

  it("falls back to a single store link when only one is given", () => {
    expect(
      encodeApp({
        iosUrl: "https://apps.apple.com/app/id1",
        androidUrl: "",
        fallbackUrl: "",
      }),
    ).toBe("https://apps.apple.com/app/id1");
  });
});
