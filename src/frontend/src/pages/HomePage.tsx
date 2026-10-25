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
    title: "QRNova — Free QR Code Generator: Create, Customize & Download",
    description:
      "Generate free QR codes for websites, Wi-Fi, contacts, social media and more. Customize colors and styles, then download PNG, JPG or high-resolution print files — no account required.",
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
