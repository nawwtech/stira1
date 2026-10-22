import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { IntroOverlay } from "@/components/intro-overlay";
export const metadata: Metadata = {
  title: { default: "Cerita yang Menggerakkan", template: "%s" },
  description: "Ruang untuk mengenal isu sosial dan lingkungan lewat cerita, aksi, dan sudut pandang para kreator."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><IntroOverlay /><SiteHeader /><main className="page-enter">{children}</main><SiteFooter /></body></html>;
}