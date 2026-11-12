import CtaBand from "@/components/CtaBand";
import GalleryGrid from "@/components/GalleryGrid";
import { PgxHero, PgxMarquee } from "@/components/Pgx";
import { PgxRail } from "@/components/PgxClient";
import PgxFx from "@/components/PgxFx";
import SectionHead from "@/components/SectionHead";
import { studioBento } from "@/config/gallery";
import { nails } from "@/config/nails";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Galerie – Unsere Arbeiten",
  "Echte Nägel aus dem Lucky Nails Studio in Berlin: Natur, French und Full Cover Farbe – dazu Eindrücke aus dem Studio.",
  "/galerie",
);

export default function Page() {
  return (
    <>
      <PgxFx />
      <PgxHero src="/img/pgx-detail-hand.webp" mobile="/img/m/galerie.webp" mobilePos="100% 40%" alts={["/img/pgx-detail-schale.webp", "/img/salon-day-3.webp"]} alt="Nagelpflege im Lucky Nails Studio: Hände bei der Behandlung" pos="50% 45%" eyebrow="Inspiration" title="Galerie – Unsere Arbeiten" sub="Echte Fotos aus unserem Studio: Nägel, Handarbeit und Räume – nichts davon ist gestellt oder generiert." />
      <PgxMarquee items={["Natur", "French", "Full Cover Farbe", ...nails.slice(3).map((n) => n.name), "Handarbeit", "Studio Friedrichshain"]} />
      <section className="on-dark" style={{ padding: "64px 0 80px" }} aria-label="Galerie">
        <div className="wrap">
          <GalleryGrid />
        </div>
      </section>
      <section className="section on-dark" style={{ paddingTop: 0 }} aria-labelledby="gs-studio">
        <div className="wrap">
          <SectionHead id="gs-studio" eyebrow="Eindrücke" title="Unser Studio" sub="Ein Blick hinter die Kulissen – wische durch die Bilder." />
          <PgxRail items={studioBento} label="Eindrücke aus dem Studio" />
        </div>
      </section>
      <section className="section on-dark" style={{ paddingTop: 0 }} aria-label="Termin buchen">
        <div className="wrap">
          <CtaBand title="Dein Lieblingslook wartet schon" text="Such dir ein Design aus und buche deinen Termin online." image="/img/pg-pedi-wide.webp" second={{ href: "/nail-designs", label: "Nail Designs ansehen" }} />
        </div>
      </section>
    </>
  );
}
