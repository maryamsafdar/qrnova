import {
  CategoryGrid,
  Faq,
  Features,
  Hero,
  HowItWorks,
  SeoContent,
} from "@/components/home";
import { NativeSponsoredAd } from "@/components/layout/NativeSponsoredAd";
import { useSeo } from "@/lib/seo";

export default function HomePage() {
  useSeo({
    title: "Free QR Code Generator Online | Create QR Codes – QRNova",
    description:
      "Create free QR codes for websites, Wi-Fi, contacts and more with QRNova. Customize your code and download PNG or JPG in seconds. No signup required.",
    path: "/",
    breadcrumbs: [{ name: "Home", path: "/" }],
  });

  return (
    <>
      <Hero />
      <CategoryGrid />
      <HowItWorks />
      <NativeSponsoredAd />
      <Features />
      <SeoContent />
      <Faq />
    </>
  );
}
