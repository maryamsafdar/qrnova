import { useSeo } from "@/lib/seo";

export default function PrivacyPage() {
  useSeo({
    title: "Privacy Policy — QRNova",
    description:
      "How QRNova handles your data. QR codes are generated entirely in your browser, so your links, Wi-Fi credentials and contact details never leave your device.",
    path: "/privacy",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy" },
    ],
  });

  return (
    <section
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
      data-ocid="privacy.page"
    >
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-display prose-p:text-muted-foreground prose-li:text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Your data stays with you
        </h2>
        <p className="mt-3 leading-relaxed">
          QRNova generates QR codes entirely in your browser. The content you
          enter — website addresses, Wi-Fi credentials, contact details and any
          other data — is processed locally on your device and is never
          transmitted to or stored on our servers.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-foreground">
          No accounts, no tracking
        </h2>
        <p className="mt-3 leading-relaxed">
          You do not need an account to use QRNova, and we do not sell or share
          personal information. We do not build advertising profiles from the
          codes you create.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-foreground">
          Contact
        </h2>
        <p className="mt-3 leading-relaxed">
          If you have questions about this policy, please reach out through our
          contact page.
        </p>
      </div>
    </section>
  );
}
