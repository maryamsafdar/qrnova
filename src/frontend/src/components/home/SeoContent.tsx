import { Link } from "@tanstack/react-router";

export function SeoContent() {
  return (
    <section
      className="border-y border-border bg-secondary/30 py-16 sm:py-20"
      data-ocid="seo_content.section"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <article className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What is a QR code?
          </h2>
          <p className="mt-4 leading-relaxed">
            A QR (quick response) code is a two-dimensional barcode that stores
            data in a square grid of black and white modules. A smartphone
            camera reads the pattern and instantly opens a link, joins a
            network, saves a contact or performs another action. Because QR
            codes hold far more information than a traditional barcode, they are
            ideal for bridging printed material and digital experiences.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-foreground">
            How to create a QR code with QRNova
          </h2>
          <p className="mt-4 leading-relaxed">
            Choose a category from the grid above, fill in the fields for your
            content type, then customize the colors and style to match your
            brand. Press generate to see a live preview, and download the file
            in the format that suits your project. The entire process runs in
            your browser, so your data stays on your device.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-foreground">
            Popular QR code types
          </h2>
          <ul className="mt-4 space-y-2 leading-relaxed">
            <li>
              <strong className="text-foreground">URL QR codes</strong> send
              scanners to a website, landing page or online store.
            </li>
            <li>
              <strong className="text-foreground">Wi-Fi QR codes</strong> let
              guests join your network without typing a password.
            </li>
            <li>
              <strong className="text-foreground">vCard QR codes</strong> save
              your full contact details to a phone in one scan.
            </li>
            <li>
              <strong className="text-foreground">Social QR codes</strong> grow
              your following on Instagram, X, Facebook, LinkedIn, TikTok and
              YouTube.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-foreground">
            Tips for scannable QR codes
          </h2>
          <p className="mt-4 leading-relaxed">
            Keep strong contrast between the foreground and background, leave a
            clear margin around the code, and test the result with more than one
            phone before printing. If you add a center logo, use a higher
            error-correction level so the code stays readable. QRNova warns you
            when a design choice could affect scannability.
          </p>
          <p className="mt-4 leading-relaxed">
            Ready to start?{" "}
            <Link
              to="/generator"
              search={{ type: "url" }}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Open the QR code generator
            </Link>{" "}
            and create your first code in seconds.
          </p>
        </article>
      </div>
    </section>
  );
}
