import { Download, Palette, Type } from "lucide-react";

const STEPS = [
  {
    icon: Type,
    title: "Choose a QR code type",
    description:
      "Pick from URL, Wi-Fi, contact, social media and nine more categories. Each one opens a form tailored to that content.",
  },
  {
    icon: Palette,
    title: "Customize the design",
    description:
      "Adjust colors, gradients, dot and corner styles, add a center logo and set the resolution — with a live preview as you go.",
  },
  {
    icon: Download,
    title: "Download and share",
    description:
      "Export a PNG, JPG or high-resolution print PNG instantly. Your code is generated in the browser, so nothing is uploaded.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border bg-secondary/30 py-16 sm:py-20"
      data-ocid="how_it_works.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Three simple steps from idea to a scannable, print-ready QR code.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-ocid={`how_it_works.item.${index + 1}`}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-glow">
                {index + 1}
              </span>
              <step.icon
                className="absolute right-6 top-6 size-6 text-primary/30"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
