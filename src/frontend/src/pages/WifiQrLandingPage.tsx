import SeoGeneratorLandingPage from "./SeoGeneratorLandingPage";

export default function WifiQrLandingPage() {
  return (
    <SeoGeneratorLandingPage
      category="wifi"
      path="/wifi-qr-code-generator"
      title="Free Wi-Fi QR Code Generator Online | QRNova"
      description="Create a free Wi-Fi QR code online. Let guests connect by scanning instead of typing network details. Customize and download with QRNova, no signup required."
      heading="Free Wi-Fi QR Code Generator"
      intro="Make joining your wireless network easier. Create a Wi-Fi QR code with your network name and security details, then let guests scan it with a compatible phone. QRNova generates the code in your browser, with no account required."
      steps={[
        "Enter the exact Wi-Fi network name (SSID). Network names are case-sensitive, so check spelling carefully.",
        "Choose the network security type and enter its password if the network uses one. For an open network, select the no-password option.",
        "Select Generate QR Code and scan the preview with a phone to test it before sharing.",
        "Download the QR code and place it where guests can scan it. Keep it somewhere only intended visitors can access if it encodes a private network password."
      ]}
      faqs={[
        { question: "Is this Wi-Fi QR code generator free?", answer: "Yes. You can create and download a Wi-Fi QR code with QRNova without creating an account." },
        { question: "Does scanning the code reveal my Wi-Fi password?", answer: "A Wi-Fi QR code stores connection details in a machine-readable format. Anyone who can scan it may be able to connect, so share it only with people you trust." },
        { question: "Will it work on every phone?", answer: "Many modern iPhone and Android cameras can recognize Wi-Fi QR codes, but behavior varies by device and operating system. Test the code with the devices your guests use." },
        { question: "Can I change the network name after creating the code?", answer: "The encoded network details do not update automatically. If the SSID, password, or security type changes, generate and distribute a new QR code." }
      ]}
    />
  );
}
