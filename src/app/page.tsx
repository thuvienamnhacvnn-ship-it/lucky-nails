import Link from "next/link";
import FeatureStrip from "@/components/FeatureStrip";
import { GalleryPreview } from "@/components/GalleryGrid";
import GutscheinTeaser from "@/components/GutscheinTeaser";
import Hero3DShowcase from "@/components/Hero3DShowcase";
import PgxFx from "@/components/PgxFx";
import NailDesignGrid from "@/components/NailDesignGrid";
import SectionHead from "@/components/SectionHead";
import ServiceGrid from "@/components/ServiceCard";
import WelcomeSection from "@/components/WelcomeSection";
import { isPromoActive } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600; // Promo-Ablauf wird stündlich neu geprüft
export const metadata = pageMeta(
  "Lucky Nails Berlin – Nagelstudio in Friedrichshain",
  "Dein modernes Nagelstudio in Berlin-Friedrichshain: Maniküre, Pediküre und kreatives Nageldesign mit Liebe zum Detail. Jetzt online Termin buchen.",
  "/",
);

export default function Home() {
  const promo = isPromoActive();
  return (
    <>
      <PgxFx />
      <Hero3DShowcase />
      <FeatureStrip />
      <WelcomeSection showPromo={promo} />
      <section className="section on-dark" aria-labelledby="svc-h">
        <div className="wrap">
          <SectionHead id="svc-h" eyebrow="Pflege & Design" title="Unsere Leistungen" sub="Professionelle Nagelpflege für schöne und gesunde Nägel" />
          <ServiceGrid />
        </div>
      </section>
      <section className="section on-ivory" aria-labelledby="nd-h">
        <div className="wrap">
          <SectionHead id="nd-h" eyebrow="Dein Stil" title="Unsere 9 Nail Designs" sub="Von natürlich bis Statement – finde deinen Lieblingslook." />
          <NailDesignGrid />
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/nail-designs" className="btn btn-wine">Alle Designs ansehen ›</Link>
          </div>
        </div>
      </section>
      <section className="section on-dark" aria-labelledby="gal-h">
        <div className="wrap">
          <SectionHead id="gal-h" eyebrow="Inspiration" title="Galerie – Unsere Arbeiten" sub="Echte Nägel aus unserem Studio." />
          <GalleryPreview />
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/galerie" className="btn btn-outline">Zur Galerie ›</Link>
          </div>
        </div>
      </section>
      <section aria-label="Gutschein">
        <GutscheinTeaser />
      </section>
    </>
  );
}
