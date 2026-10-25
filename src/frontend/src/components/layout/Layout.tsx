import type { ReactNode } from "react";
import { StickyBottomAd } from "./StickyBottomAd";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyBottomAd />
    </div>
  );
}
