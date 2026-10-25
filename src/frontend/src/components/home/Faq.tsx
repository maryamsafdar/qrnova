import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Is QRNova really free?",
    answer:
      "Yes. Generating, customizing and downloading QR codes is completely free, with no account, subscription or watermark. There are no hidden limits on how many codes you create.",
  },
  {
    question: "Do my QR codes expire?",
    answer:
      "No. QRNova creates static QR codes that encode your content directly. They keep working for as long as the destination — your website, Wi-Fi network or contact details — remains available.",
  },
  {
    question: "Is my data private?",
    answer:
      "Absolutely. Every QR code is generated in your browser using client-side JavaScript. Your links, Wi-Fi passwords and contact details are never uploaded to a server or stored anywhere.",
  },
  {
    question: "Which file formats can I download?",
    answer:
      "You can download a PNG for digital use, a JPG for smaller file sizes, or a high-resolution 2048px print PNG for signage, packaging and other printed material.",
  },
  {
    question: "Can I add my logo to the QR code?",
    answer:
      "Yes. Upload a center logo in the customization panel. QRNova automatically raises the error-correction level so the code stays scannable, and warns you if the design becomes risky.",
  },
  {
    question: "Will my QR code work on all phones?",
    answer:
      "Modern iOS and Android cameras scan QR codes natively without an app. For the best results, keep strong contrast, leave a clear margin and test the code on a couple of devices before printing.",
  },
  {
    question: "Can I use QRNova QR codes commercially?",
    answer:
      "Yes. You can use the codes you generate for personal or commercial projects, including marketing, packaging, menus and business cards.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 py-16 sm:py-20"
      data-ocid="faq.section"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Everything you need to know about creating and using QR codes with
            QRNova.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              data-ocid={`faq.item.${index + 1}`}
              className="border-border"
            >
              <AccordionTrigger
                data-ocid={`faq.toggle.${index + 1}`}
                className="font-display text-base font-semibold text-foreground hover:no-underline"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
