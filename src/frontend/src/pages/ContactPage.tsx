import { useSeo } from "@/lib/seo";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

const CHANNELS = [
  {
    icon: Mail,
    title: "Email us",
    description: "For general questions, feedback and partnership enquiries.",
    action: "hello@qrnova.app",
    href: "mailto:hello@qrnova.app",
  },
  {
    icon: MessageSquare,
    title: "Report an issue",
    description: "Found a bug or a QR code that will not scan? Let us know.",
    action: "support@qrnova.app",
    href: "mailto:support@qrnova.app",
  },
  {
    icon: ShieldCheck,
    title: "Privacy requests",
    description: "Questions about how QRNova handles your data.",
    action: "privacy@qrnova.app",
    href: "mailto:privacy@qrnova.app",
  },
];

export default function ContactPage() {
  useSeo({
    title: "Contact QRNova — Support & Feedback",
    description:
      "Get in touch with the QRNova team for support, feedback, partnership enquiries or privacy questions about our free QR code generator.",
    path: "/contact",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ],
  });

  return (
    <section
      className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
      data-ocid="contact.page"
    >
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Contact us
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          We would love to hear from you. Choose the channel that fits your
          question and we will get back to you as soon as we can.
        </p>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-3">
        {CHANNELS.map((channel, index) => (
          <li
            key={channel.title}
            data-ocid={`contact.item.${index + 1}`}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-subtle"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <channel.icon className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              {channel.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {channel.description}
            </p>
            <a
              href={channel.href}
              data-ocid={`contact.link.${index + 1}`}
              className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {channel.action}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
