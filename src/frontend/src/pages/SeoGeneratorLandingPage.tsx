import {
  CategoryForm,
  CustomizationPanel,
  DEFAULT_QR_STYLE,
  DownloadPanel,
  StyledQrPreview,
  type QrStyleOptions,
} from "@/components/generator";
import { useGenerator } from "@/hooks/useGenerator";
import { useSeo } from "@/lib/seo";
import type { QrCategoryId } from "@/lib/qr";
import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface SeoGeneratorLandingPageProps {
  category: QrCategoryId;
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  steps: string[];
  faqs: FaqItem[];
}

export default function SeoGeneratorLandingPage({
  category,
  path,
  title,
  description,
  heading,
  intro,
  steps,
  faqs,
}: SeoGeneratorLandingPageProps) {
  const { draft, update, options, setOptions, resetOptions, payload, error, generated, generate } =
    useGenerator(category);
  const [style, setStyleState] = useState<QrStyleOptions>(DEFAULT_QR_STYLE);
  const setStyle = useCallback((next: Partial<QrStyleOptions>) => {
    setStyleState((current) => ({ ...current, ...next }));
  }, []);

  useSeo({
    title,
    description,
    path,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: heading, path },
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  });

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>{heading}</span>
          </nav>
          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Free · No signup required
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
          </div>

          <div className="mt-9 grid gap-8 lg:grid-cols-2 lg:gap-10" id="qr-generator">
            <div className="glass rounded-3xl p-6 shadow-float sm:p-8">
              <h2 className="font-display text-lg font-semibold text-foreground">Create your QR code</h2>
              <p className="mt-2 text-sm text-muted-foreground">Enter the details below, then generate and download your code.</p>
              <div className="mt-5">
                <CategoryForm category={category} draft={draft} update={update} error={error} onGenerate={generate} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">QR preview</h2>
                  {generated && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success"><Check className="size-3.5" /> Ready</span>}
                </div>
                <div className="mt-5">
                  {generated && payload ? (
                    <StyledQrPreview value={payload} options={options} style={style} label={`QR code: ${heading}`} />
                  ) : (
                    <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
                      <Sparkles className="size-6 text-primary" />
                      <p className="text-sm font-medium">Your QR code appears here</p>
                      <p className="text-xs text-muted-foreground">Complete the form and select Generate QR Code.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-subtle">
                <DownloadPanel payload={payload} options={options} style={style} generated={generated} />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <CustomizationPanel options={options} setOptions={setOptions} resetOptions={resetOptions} style={style} setStyle={setStyle} />
          </div>

          <section className="mt-14 max-w-3xl" aria-labelledby="how-to-heading">
            <h2 id="how-to-heading" className="font-display text-2xl font-bold">How to use this free QR code generator</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-muted-foreground">
              {steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              QRNova creates the code in your browser. Check the generated code with your own phone before printing or sharing it. You can also explore the <Link to="/generator" search={{ type: "url" }} className="font-medium text-primary underline underline-offset-4">full QR code generator</Link> or return to the <Link to="/" className="font-medium text-primary underline underline-offset-4">QRNova homepage</Link>.
            </p>
          </section>

          <section className="mt-12 max-w-3xl" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-2xl font-bold">Frequently asked questions</h2>
            <div className="mt-5 divide-y divide-border">
              {faqs.map((faq) => (
                <details key={faq.question} className="py-4">
                  <summary className="cursor-pointer font-semibold text-foreground">{faq.question}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
