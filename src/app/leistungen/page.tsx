import { Suspense } from "react";
import Image from "next/image";
import { HandHeart, ShieldCheck, Sparkles } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import LeistungenQuickNav from "@/components/LeistungenQuickNav";
import { PgxHero, PgxMarquee, PgxStats } from "@/components/Pgx";
import { PgxRail } from "@/components/PgxClient";
import PgxFx from "@/components/PgxFx";
import PriceTable from "@/components/PriceTable";
import SectionHead from "@/components/SectionHead";
import ServiceGrid from "@/components/ServiceCard";
import { realItems } from "@/config/gallery";
import { nails } from "@/config/nails";
import { priceGroups } from "@/config/prices";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Leistungen & Preise",
  "Preisliste von Lucky Nails Berlin: Nagelmodellage, Maniküre, Pediküre und Add-ons – transparente Preise, direkt online Termin buchen.",
  "/leistungen",
);

const perks = [
  { Icon: Sparkles, h: "Hochwertige Produkte", p: "Eine große Auswahl an Farben und Gel-Lacken für deinen Look." },
  { Icon: ShieldCheck, h: "Saubere Behandlung", p: "Saubere Arbeitsplätze und Arbeiten mit Handschuhen." },
  { Icon: HandHeart, h: "Persönlich beraten", p: "Wir nehmen uns Zeit für deine Wünsche – mit Liebe zum Detail." },
];

const words = ["Nagelmodellage", "Maniküre", "Pediküre", "Nail Art", ...nails.map((n) => n.name)];
const priceCount = priceGroups.reduce((a, g) => a + g.rows.length, 0);

export default function Page() {
  return (
    <>
      <PgxFx />
      <PgxHero src="/img/pg-pedi-wide.webp" mobile="/img/m/leistungen.webp" alts={["/img/salon-day-2.webp", "/img/salon-day-3.webp"]} alt="Pediküre-Stühle im Lucky Nails Studio" pos="50% 60%" eyebrow="Preise & Pflege" title="Unsere Leistungen" sub="Professionelle Nagelpflege für schöne und gesunde Nägel – transparente Preise, direkt online buchbar." />
      <PgxMarquee items={words} />
      <Suspense fallback={null}>
        <LeistungenQuickNav />
      </Suspense>

      <section className="section on-dark" aria-labelledby="svc-h">
        <div className="wrap">
          <SectionHead id="svc-h" eyebrow="Was wir für dich tun" title="Wähle deine Behandlung" sub="Tippe auf eine Kachel – die passende Preisliste öffnet sich direkt darunter." />
          <ServiceGrid />
        </div>
      </section>

      <section className="pgx-band on-dark" aria-label="Zahlen">
        <div className="wrap">
          <PgxStats
            items={[
              { n: priceGroups.length, l: "Leistungsbereiche" },
              { n: priceCount, l: "Preise in der Liste" },
              { n: nails.length, l: "Nail-Design-Stile" },
              { n: realItems.length, l: "Echte Arbeiten online" },
            ]}
          />
        </div>
      </section>

      <section className="section on-ivory" aria-labelledby="work-h">
        <div className="wrap">
          <div className="pgx-split">
            <div className="pgx-sticky pgx-frame" data-r="left">
              <div className="pgx-photo tall">
                <Image src="/img/pg-work-portrait.webp" alt="Maniküre am Arbeitsplatz im Lucky Nails Studio mit Ringleuchte" fill sizes="(max-width: 1023px) 100vw, 520px" />
              </div>
            </div>
            <div className="pgx-copy">
              <span className="pg-eyebrow" data-r>Handarbeit mit Liebe zum Detail</span>
              <h2 id="work-h" data-r>Zeit für schöne Nägel</h2>
              <p data-r>Von der Pflege bis zum Design: Wir arbeiten sorgfältig und in Ruhe – damit dein Ergebnis genau so wird, wie du es dir vorstellst. Besondere Designs besprechen wir gern persönlich mit dir.</p>
              <ul className="pgx-perks">
                {perks.map(({ Icon, h, p }, i) => (
                  <li key={h} data-r style={{ "--d": `${i * 110}ms` } as React.CSSProperties}>
                    <span className="ic"><Icon aria-hidden /></span>
                    <div>
                      <b>{h}</b>
                      <span>{p}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pgx-actions" data-r>
                <a className="btn btn-wine" href="#preise">Zur Preisliste ›</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-dark" aria-labelledby="pl-h">
        <div className="wrap">
          <SectionHead id="pl-h" eyebrow="Alle Preise in Euro" title={<>Unsere <span className="gold-text">Preisliste</span></>} />
          <Suspense fallback={null}>
            <PriceTable />
          </Suspense>
        </div>
      </section>

      <section className="section on-dark" style={{ paddingTop: 0 }} aria-labelledby="rail-h">
        <div className="wrap">
          <SectionHead id="rail-h" eyebrow="Aus unserem Studio" title="Echte Arbeiten" sub="Wische oder nutze die Pfeile – Tippen vergrößert das Bild." />
          <PgxRail items={realItems} label="Echte Arbeiten aus dem Studio" />
        </div>
      </section>

      <section className="section on-dark" style={{ paddingTop: 0 }} aria-label="Termin buchen">
        <div className="wrap">
          <CtaBand image="/img/pg-pedi-wide.webp" />
        </div>
      </section>
    </>
  );
}
