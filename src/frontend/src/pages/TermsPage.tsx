import { useSeo } from "@/lib/seo";

export default function TermsPage() {
  useSeo({
    title: "Terms of Service — QRNova",
    description:
      "The terms that govern your use of QRNova's free browser-based QR code generator, including acceptable use and intellectual property.",
    path: "/terms",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Terms of Service", path: "/terms" },
    ],
  });

  return (
    <section
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
      data-ocid="terms.page"
    >
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-display prose-p:text-muted-foreground prose-li:text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Acceptance of terms
        </h2>
        <p className="mt-3 leading-relaxed">
          By using QRNova you agree to these terms. If you do not agree, please
          do not use the service.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-foreground">
          Acceptable use
        </h2>
        <p className="mt-3 leading-relaxed">
          You are responsible for the content you encode into QR codes. Do not
          use QRNova to distribute malware, phishing links, illegal material or
          content that infringes the rights of others.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-foreground">
          Your content
        </h2>
        <p className="mt-3 leading-relaxed">
          You retain all rights to the content you encode. Because generation
          happens in your browser, QRNova does not claim ownership of your data
          or the codes you create.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-foreground">
          Service availability
        </h2>
        <p className="mt-3 leading-relaxed">
          QRNova is provided free of charge and on an "as is" basis, without
          warranties of any kind. We may update or change the service at any
          time.
        </p>
      </div>
    </section>
  );
}
