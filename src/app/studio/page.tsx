import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import BookingCTA from "@/components/BookingCTA";
import CtaBand from "@/components/CtaBand";
import { PgxHero, PgxMarquee } from "@/components/Pgx";
import { PgxBento } from "@/components/PgxClient";
import PgxFx from "@/components/PgxFx";
import { PgCard } from "@/components/PageKit";
import SalonVideo from "@/components/SalonVideo";
import SectionHead from "@/components/SectionHead";
import { studioBento } from "@/config/gallery";
import { img } from "@/config/images";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Studio & Team – Über uns",
  "Lernt das Lucky Nails Studio in Berlin-Friedrichshain kennen: unser Studio, unser Team, Hygiene & Qualität, unsere Produkte und dein Besuch.",
  "/studio",
  img.og,
);

const values = [
  { Icon: Users, t: "Persönlicher Service" },
  { Icon: Heart, t: "Hochwertige Produkte" },
  { Icon: ShieldCheck, t: "Saubere & sichere Behandlung" },
];

export default function Page() {
  return (
    <>
      <PgxFx />
      <PgxHero src="/img/pg-studio-wide.webp" mobile="/img/m/studio.webp?v=3" alts={["/img/salon-day.webp", "/img/salon-day-2.webp"]} alt="Das Lucky Nails Studio in Berlin-Friedrichshain: Blick durch die Arbeitsplätze und die Lack-Wand" pos="40% 55%" eyebrow="Studio & Team" title="Über uns" sub="Leidenschaft für schöne Nägel – in entspannter Atmosphäre, mit Präzision, Kreativität und Liebe zum Detail." />
      <PgxMarquee items={["Persönlicher Service", "Hochwertige Produkte", "Saubere Behandlung", "Handarbeit", "Entspannte Atmosphäre", "Berlin-Friedrichshain"]} />

      <section className="section on-ivory" aria-labelledby="intro-h">
        <div className="wrap">
          <div className="pgx-split rev">
            <div className="pgx-copy">
              <span className="pg-eyebrow" data-r>Willkommen</span>
              <h2 id="intro-h" data-r>Zeit für dich und deine Nägel</h2>
              <p data-r>Lucky Nails steht für professionelle Nagelpflege, individuelles Design und persönlichen Service. Wir nehmen uns Zeit für deine Wünsche – damit du dich bei uns rundum wohlfühlst.</p>
              <ul className="pgx-perks">
                {values.map(({ Icon, t }, i) => (
                  <li key={t} data-r style={{ "--d": `${i * 110}ms` } as React.CSSProperties}>
                    <span className="ic"><Icon aria-hidden /></span>
                    <div><b>{t}</b></div>
                  </li>
                ))}
              </ul>
              <div className="pgx-actions" data-r>
                <BookingCTA variant="primary" label="Termin online buchen" className="" />
                <Link href="/galerie" className="btn btn-wine">Zur Galerie ›</Link>
              </div>
            </div>
            <div className="pgx-sticky pgx-frame" data-r="right">
              <div className="pgx-photo tall">
                <Image src="/img/pg-lamps-portrait.webp" alt="Studio mit Kupfer-Pendelleuchten und Kristallleuchter" fill sizes="(max-width: 1023px) 100vw, 520px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-dark" aria-labelledby="studio-h">
        <div className="wrap">
          <SectionHead id="studio-h" eyebrow="Eindrücke" title="Unser Studio" sub="Wohlfühlen, entspannen, verschönern – tippe auf ein Bild, um es zu vergrößern." />
          <PgxBento items={studioBento} />
        </div>
      </section>

      <section className="section on-ivory" aria-labelledby="video-h">
        <div className="wrap">
          <div className="pg-video-wrap pg-on-ivory">
            <div data-r="left"><SalonVideo src="/video/studio-rundgang.mp4" poster="/video/studio-rundgang-poster.webp" label="Kurzer Rundgang durch das Lucky Nails Studio in Berlin-Friedrichshain" /></div>
            <div className="pg-video-copy pgx-copy">
              <span className="pg-eyebrow" data-r>Studio-Rundgang</span>
              <h2 id="video-h" data-r>Ein Blick ins Studio</h2>
              <p data-r>Arbeitsplätze, Pediküre-Stühle und die lange Lack-Wand: So sieht es bei uns aus. Schau dich in Ruhe um – wir freuen uns auf deinen Besuch.</p>
              <ul className="pg-facts" data-r>
                <li><MapPin aria-hidden />{site.address.street}, {site.address.zip} {site.address.city}-{site.address.district}</li>
                <li><Sparkles aria-hidden />{site.services}</li>
              </ul>
              <BookingCTA variant="primary" label="Termin online buchen" className="" />
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="section on-dark" aria-labelledby="team-h">
        <div className="wrap">
          <SectionHead id="team-h" eyebrow="Menschen" title="Unser Team" sub="Ein persönliches Team kümmert sich um dich – mit Zeit, Sorgfalt und einem offenen Ohr für deine Wünsche." />
          <div className="pgk-grid3">
            <PgCard src="/img/pg-scissors-wide.webp" alt="Nagelhautpflege bei der Maniküre" title="Präzise Maniküre" text="Sorgfältige Handarbeit für gepflegte Hände und saubere Nägel." i={0} />
            <PgCard src={img.pedicure} alt="Zwei Pediküre-Stühle im Studio" title="Pediküre & Pflege" text="Wohlfühlpflege für gesunde Füße in entspannter Atmosphäre." i={1} />
            <PgCard src="/img/pg-counter-portrait.webp" alt="Empfangstresen im Lucky Nails Studio" title="Beratung mit Stil" text="Wir besprechen deinen Wunschlook persönlich mit dir." i={2} />
          </div>
        </div>
      </section>

      <section id="hygiene" className="section on-dark" style={{ paddingTop: 0 }} aria-labelledby="hyg-h">
        <div className="wrap">
          <SectionHead id="hyg-h" eyebrow="Sauber & sicher" title="Hygiene & Qualität" sub="Damit du dich bei uns rundum wohlfühlst." />
          <div className="pgk-grid3">
            <PgCard src={img.hygiene} alt="Behandlung mit Handschuhen am sauberen Arbeitsplatz" title="Saubere Arbeitsplätze" text="Gepflegte, aufgeräumte Plätze für jede Behandlung." i={0} />
            <PgCard src="/img/pg-work-portrait.webp" alt="Maniküre am Arbeitsplatz mit Ringleuchte" title="Arbeiten mit Handschuhen" text="Sorgfältiges, hygienisches Arbeiten gehört für uns dazu." i={1} />
            <PgCard src={img.products2} alt="Regal mit Gel-Lacken im Studio" title="Hochwertige Produkte" text="Eine große Auswahl an Farben und Gel-Lacken." i={2} />
          </div>
        </div>
      </section>

      <section id="produkte" className="section on-ivory" aria-labelledby="prod-h">
        <div className="wrap">
          <div className="pgx-split">
            <div className="pgx-sticky pgx-frame" data-r="left">
              <div className="pgx-photo">
                <Image src={img.products} alt="Regal mit Gel-Lacken im Lucky Nails Studio" fill sizes="(max-width: 1023px) 100vw, 600px" />
              </div>
            </div>
            <div className="pgx-copy">
              <span className="pg-eyebrow" data-r>Farben &amp; Gel-Lacke</span>
              <h2 id="prod-h" data-r>Produkte im Studio</h2>
              <p data-r>Eine große Auswahl an hochwertigen Farben und Gel-Lacken – damit dein Look genau so wird, wie du ihn dir vorstellst.</p>
              <div className="pgx-actions" data-r>
                <Link href="/leistungen" className="btn btn-wine">Zu den Leistungen ›</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-dark" aria-label="Termin buchen">
        <div className="wrap">
          <CtaBand title="Besuche unser Studio" text="Buche deinen Termin online oder ruf uns an." image="/img/pg-produkte-wide.webp" />
        </div>
      </section>
    </>
  );
}
