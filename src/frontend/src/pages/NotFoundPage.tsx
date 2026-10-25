import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { Home, QrCode } from "lucide-react";

export default function NotFoundPage() {
  useSeo({
    title: "Page Not Found — QRNova",
    description:
      "The page you are looking for could not be found. Return to the QRNova homepage or open the free QR code generator.",
    path: "/404",
  });

  return (
    <section
      className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8"
      data-ocid="not_found.page"
    >
      <span className="font-display text-7xl font-bold text-gradient">404</span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        The page you are looking for does not exist or may have moved. Let us
        get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="rounded-full bg-gradient-primary shadow-glow"
        >
          <Link to="/" data-ocid="not_found.home_button">
            <Home className="size-4" />
            Back to homepage
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link
            to="/generator"
            search={{ type: "url" }}
            data-ocid="not_found.generator_button"
          >
            <QrCode className="size-4" />
            Open generator
          </Link>
        </Button>
      </div>
    </section>
  );
}
