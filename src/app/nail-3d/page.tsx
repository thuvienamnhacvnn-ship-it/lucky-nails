import type { Metadata } from "next";
import NailViewerLoader from "@/components/NailViewerLoader";
import PageHero from "@/components/PageHero";

// Prototyp – nicht in Menü/Sitemap, noindex.
export const metadata: Metadata = { title: "Nail 3D (Prototyp)", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <PageHero title="3D-Nagel (Prototyp)" sub="Ein Nagel als echte Schale – außen gewölbt, innen hohl. Zum Drehen ziehen." />
      <section className="on-dark" style={{ paddingBottom: 80, background: "radial-gradient(ellipse at 50% 40%, #4a1520 0%, #2a0c12 60%, #1c0d0c 100%)" }}>
        <div className="wrap">
          <NailViewerLoader />
        </div>
      </section>
    </>
  );
}
