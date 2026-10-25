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
            information in a square pattern. A phone camera can read it to open a
            website, connect to Wi-Fi, save contact details or start another action.
            QR codes make it easy to connect printed materials with useful digital
            information.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-foreground">
            How to create a QR code with QRNova
          </h2>
          <p className="mt-4 leading-relaxed">
            Choose the type of information you want to share, fill in the fields,
            customize the appearance if needed, and select Generate QR Code. Review
            the preview, download a PNG or JPG, and scan the saved image before you
            publish or print it. QRNova generates codes in your browser; your input
            is processed locally by the tool.
          </p>
          <p className="mt-4 leading-relaxed">
            Need a particular type? Use the <Link to="/url-qr-code-generator">URL QR code generator</Link>
            {" "}to share a website or landing page, or try the <Link to="/wifi-qr-code-generator">Wi-Fi QR code generator</Link>
            {" "}to help guests join a wireless network. You can also open the full
            <Link to="/generator" search={{ type: "url" }}> QR code maker</Link> for more content types.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-foreground">
            Popular QR code uses
          </h2>
          <ul className="mt-4 space-y-2 leading-relaxed">
            <li><strong className="text-foreground">Website links:</strong> Put a scannable link on a business card, poster, product package or printed menu.</li>
            <li><strong className="text-foreground">Wi-Fi access:</strong> Let visitors scan network details instead of typing the SSID and password.</li>
            <li><strong className="text-foreground">Digital contacts:</strong> Share contact details from a compatible vCard QR code.</li>
            <li><strong className="text-foreground">Social profiles:</strong> Direct people to a profile or channel using a URL QR code.</li>
          </ul>

          <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-foreground">
            Tips for QR codes that scan reliably
          </h2>
          <p className="mt-4 leading-relaxed">
            Use strong contrast, keep a clear quiet zone around the code, and avoid
            making the printed code too small. Test the final downloaded file with
            more than one phone and at the distance people will scan it. Make sure
            the destination link works and that Wi-Fi details are correct before
            sharing. If you customize colors or add a logo, test the finished design
            again before printing copies.
          </p>
          <p className="mt-4 leading-relaxed">
            Ready to start? <Link to="/generator" search={{ type: "url" }} className="font-medium text-primary underline-offset-4 hover:underline">Create a QR code online</Link>,
            or jump straight to the <Link to="/url-qr-code-generator">website QR tool</Link> and
            <Link to="/wifi-qr-code-generator"> Wi-Fi QR tool</Link>.
          </p>
        </article>
      </div>
    </section>
  );
}
