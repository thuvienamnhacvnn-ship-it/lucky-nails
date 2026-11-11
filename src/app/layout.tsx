import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { img } from "@/config/images";
import { site } from "@/config/site";
import { localBusinessJsonLd } from "@/lib/seo";
import "./globals.css";

// Schriften liegen lokal in src/fonts (woff2, Latin inkl. ä ö ü ß €) – der Build braucht kein Netz.
const cinzel = localFont({ src: "../fonts/cinzel-normal-500.woff2", weight: "500", variable: "--font-cinzel", display: "swap" });
const playfair = localFont({ src: "../fonts/playfair-normal-400-700.woff2", weight: "400 700", variable: "--font-playfair", display: "swap" });
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-normal-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-normal-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cormorant-italic-500.woff2", weight: "500", style: "italic" },
    { path: "../fonts/cormorant-italic-600.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});
const mulish = localFont({ src: "../fonts/mulish-normal-400-700.woff2", weight: "400 700", variable: "--font-mulish", display: "swap" });

export const viewport: Viewport = { themeColor: "#1c0d0c", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Lucky Nails Berlin – Maniküre, Pediküre & Nageldesign in Friedrichshain", template: "%s | Lucky Nails Berlin" },
  description: "Lucky Nails in Berlin-Friedrichshain: professionelle Maniküre, Pediküre und kreatives Nageldesign. Jetzt online Termin buchen.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.name, locale: "de_DE", type: "website", url: "/",
    title: "Lucky Nails Berlin – Nagelstudio in Friedrichshain",
    description: "Maniküre, Pediküre & Nageldesign in Berlin-Friedrichshain. Jetzt online Termin buchen.",
    images: [{ url: img.og, width: 1200, height: 630, type: "image/jpeg", alt: "Lucky Nails Berlin – Logo und Nagelstudio in Friedrichshain" }],
  },
  twitter: { card: "summary_large_image", title: "Lucky Nails Berlin – Nagelstudio in Friedrichshain", description: "Maniküre, Pediküre & Nageldesign in Berlin-Friedrichshain. Jetzt online Termin buchen.", images: [img.og] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${cinzel.variable} ${playfair.variable} ${cormorant.variable} ${mulish.variable}`}>
      <body>
        <a href="#main" className="skip">Zum Inhalt springen</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
      </body>
    </html>
  );
}
