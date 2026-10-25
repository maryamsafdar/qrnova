import {
  CategoryGrid,
  Faq,
  Features,
  Hero,
  HowItWorks,
  SeoContent,
} from "@/components/home";
import { useSeo } from "@/lib/seo";

export default function HomePage() {
  useSeo({
    title: "Free QR Code Generator & Maker Online | QRNova",
    description:
      "Use QRNova as a free QR code generator and maker online. Create website, URL and Wi-Fi QR codes, customize them, and download PNG or JPG files without signup.",
    path: "/",
    breadcrumbs: [{ name: "Home", path: "/" }],
  });

  return (
    <>
      <Hero />
      <CategoryGrid />
      <HowItWorks />
      <Features />
      <SeoContent />
      <Faq />
    </>
  );
}
