import SeoGeneratorLandingPage from "./SeoGeneratorLandingPage";

export default function UrlQrLandingPage() {
  return (
    <SeoGeneratorLandingPage
      category="url"
      path="/url-qr-code-generator"
      title="Free URL QR Code Generator Online | QRNova"
      description="Turn any valid website address into a free URL QR code. Create a QR code for your website, landing page or online menu, then download it without signup."
      heading="Free URL QR Code Generator"
      intro="Turn a web address into a scannable link. QRNova's free URL QR code maker lets you create a code for a website, landing page, online menu, portfolio or other public URL, then customize and download it without signing up."
      steps={[
        "Paste the full website address into the URL field. Use a public, complete link and check that it opens correctly.",
        "Select Generate QR Code to create the code and preview it on the page.",
        "Customize the appearance if needed, then download a PNG or JPG for digital use or printing.",
        "Scan the downloaded image with a phone before publishing it. If the destination changes, update the URL and generate a replacement code."
      ]}
      faqs={[
        { question: "Can I make a QR code for any website?", answer: "You can encode a valid website URL that you are allowed to share. The QR code points to the address; it does not host the destination page." },
        { question: "Is this QR code maker free and does it require signup?", answer: "QRNova offers free browser-based URL QR code creation without requiring an account." },
        { question: "Can I edit the destination after downloading?", answer: "A standard QR code contains the URL encoded when it was created. To change the destination, create and distribute a new QR code." },
        { question: "Does the QR code expire?", answer: "A static QR code does not expire by itself. It will work as long as the destination URL remains available and readable by the scanning device." }
      ]}
    />
  );
}
