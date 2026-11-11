import CtaBand from "@/components/CtaBand";
import { PgxHero, PgxMarquee, PgxSteps } from "@/components/Pgx";
import PgxFx from "@/components/PgxFx";
import GutscheinFlip from "@/components/GutscheinFlip";
import { PgCard } from "@/components/PageKit";
import SectionHead from "@/components/SectionHead";
import { img } from "@/config/images";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Gutscheine",
  "Verschenke Zeit für schöne Nägel: der Lucky Nails Geschenkgutschein, erhältlich im Studio in Berlin-Friedrichshain.",
  "/gutscheine",
  img.gutscheinFront,
);

const how = [
  { h: "Wert wählen", p: "Ruf an oder schreib uns – wir beraten dich gern, welcher Gutschein passt." },
  { h: "Im Studio kaufen", p: "Den Gutschein bekommst du direkt bei uns im Studio." },
  { h: "Freude verschenken", p: "Zeit für schöne Nägel, ganz nach dem Geschmack der beschenkten Person." },
];

export default function Page() {
  return (
    <>
      <PgxFx />
      <PgxHero src="/img/pg-pedi-wide.webp" alts={["/img/salon-day-3.webp", "/img/salon-day.webp"]} alt="Zwei Pediküre-Stühle im Lucky Nails Studio" pos="50% 50%" eyebrow="Zum Verschenken" title="Gutscheine" sub="Ein Geschenk, das Freude macht – erhältlich im Studio." />
      <PgxMarquee items={["Geschenkgutschein", "Zeit für schöne Nägel", "Im Studio erhältlich", "Lucky Nails Berlin"]} />

      <section className="on-dark gsf-sec" aria-labelledby="gs-h">
        <div className="wrap gsf-head">
          <SectionHead id="gs-h" eyebrow="Lucky Nails" title="Unser Geschenkgutschein" />
        </div>
        <GutscheinFlip front={img.gutscheinFront} back={img.gutscheinBack} />
      </section>

      <section className="section on-ivory" aria-labelledby="how-h">
        <div className="wrap">
          <SectionHead id="how-h" eyebrow="So einfach" title="In drei Schritten verschenkt" />
          <PgxSteps steps={how} />
        </div>
      </section>

      <section className="section on-dark" aria-labelledby="idea-h">
        <div className="wrap">
          <SectionHead id="idea-h" eyebrow="Passende Geschenkidee" title="Für jeden Anlass" />
          <div className="pgk-grid3">
            <PgCard src="/img/real-05.webp" alt="Rote Nägel mit Herz-Design" title="Geburtstag" text="Ein Geschenk, das Freude macht." i={0} />
            <PgCard src="/img/pg-orchid-portrait.webp" alt="Weiße Orchidee im Studio" title="Danke sagen" text="Zeit für schöne Nägel als kleines Dankeschön." i={1} />
            <PgCard src="/img/pg-pedi-wide.webp" alt="Pediküre-Stühle im Studio" title="Self-Care" text="Eine entspannte Auszeit für dich selbst." i={2} />
          </div>
        </div>
      </section>

      <section className="section on-dark" style={{ paddingTop: 0 }} aria-label="Gutschein sichern">
        <div className="wrap">
          <CtaBand title="Jetzt Gutschein sichern" text="Ruf uns an – wir beraten dich gern." image="/img/pg-studio-wide.webp" />
        </div>
      </section>
    </>
  );
}
