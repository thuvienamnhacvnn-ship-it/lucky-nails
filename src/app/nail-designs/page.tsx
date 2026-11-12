import CtaBand from "@/components/CtaBand";
import NailDesignGrid from "@/components/NailDesignGrid";
import { PgxHero, PgxMarquee } from "@/components/Pgx";
import { PgxRail } from "@/components/PgxClient";
import PgxFx from "@/components/PgxFx";
import SectionHead from "@/components/SectionHead";
import { realItems } from "@/config/gallery";
import { nails } from "@/config/nails";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Nail Designs",
  "Sechs Nail-Design-Stile bei Lucky Nails Berlin: Natur, Full Cover Farbe, French, Babyboomer, Cat Eye und Chrome – mit Preisen und Terminbuchung.",
  "/nail-designs",
);

export default function Page() {
  return (
    <>
      <PgxFx />
      <PgxHero src="/img/pgx-detail-schale.webp" mobile="/img/m/nail-designs.webp" alts={["/img/salon-day-2.webp", "/img/salon-day.webp"]} alt="Maniküre mit Schale und Pflegeprodukten im Studio" pos="50% 55%" eyebrow="Dein Stil" title="Nail Designs" sub="Sechs Stile für deinen Lieblingslook – von natürlich bis Statement." />
      <PgxMarquee items={nails.map((n) => n.en)} />
      <section className="section on-dark" aria-labelledby="nd-h">
        <div className="wrap">
          <SectionHead id="nd-h" eyebrow="Nagelmodellage" title="Finde deinen Look" sub="Preise für Neumodellage – Details und echte Arbeiten findest du auf der jeweiligen Seite." />
          <NailDesignGrid price />
        </div>
      </section>
      <section className="section on-ivory" aria-labelledby="real-h">
        <div className="wrap">
          <SectionHead id="real-h" eyebrow="Aus unserem Studio" title="Echte Arbeiten zur Inspiration" sub="So sehen Designs an echten Händen aus." />
          <PgxRail items={realItems} label="Echte Arbeiten" />
        </div>
      </section>
      <section className="section on-dark" aria-label="Termin buchen">
        <div className="wrap">
          <CtaBand title="Welcher Look passt zu dir?" text="Wir beraten dich gern im Studio – oder du buchst direkt online." image="/img/pg-studio-wide.webp" />
        </div>
      </section>
    </>
  );
}
