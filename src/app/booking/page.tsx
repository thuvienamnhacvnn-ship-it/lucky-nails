import Image from "next/image";
import Link from "next/link";
import BookingCTA from "@/components/BookingCTA";
import CheckinQR from "@/components/CheckinQR";
import CtaBand from "@/components/CtaBand";
import { PgxHero, PgxMarquee, PgxSteps } from "@/components/Pgx";
import PgxFx from "@/components/PgxFx";
import SectionHead from "@/components/SectionHead";
import { img } from "@/config/images";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Online Booking",
  "Buche deinen Termin bei Lucky Nails Berlin ganz einfach online. Schnell, bequem und rund um die Uhr – mit Check-in per QR-Code.",
  "/booking",
);

const steps = [
  { h: "Leistung wählen", p: "Maniküre, Pediküre oder Nagelmodellage." },
  { h: "Datum & Uhrzeit", p: "Deinen Wunschtermin aussuchen." },
  { h: "Daten eingeben", p: "Kurz und unkompliziert." },
  { h: "Bestätigung", p: "Du erhältst deine Terminbestätigung." },
];

export default function Page() {
  return (
    <>
      <PgxFx />
      <PgxHero src="/img/pgx-detail-schale.webp" mobile="/img/m/booking.webp" alts={["/img/salon-day-2.webp", "/img/salon-day.webp"]} alt="Maniküre mit Schale und Pflegeprodukten im Studio" pos="50% 55%" eyebrow="In vier Schritten" title="Online Booking" sub="Buche deinen Termin ganz einfach und bequem online.">
        <div className="pgx-actions">
          <BookingCTA variant="primary" label="Jetzt Termin buchen" />
        </div>
      </PgxHero>
      <PgxMarquee items={["Online buchen", "Check-in per QR-Code", "Persönlich beraten", "Berlin-Friedrichshain"]} />

      <section className="section on-ivory" aria-labelledby="book-h">
        <div className="wrap">
          <SectionHead id="book-h" eyebrow="Termin buchen" title="Dein Termin in wenigen Minuten" sub="Du wählst deine Leistung und deine Wunschzeit – die Buchung läuft über unser Online-Terminsystem BePro." />
          <PgxSteps steps={steps} />
        </div>
      </section>

      <section className="section on-dark" aria-label="Termin und Hilfe">
        <div className="wrap">
          <div className="pgx-split" style={{ alignItems: "center" }}>
            <div className="pgx-frame" data-r="left">
              <div className="pgx-photo tall">
                <Image src={img.pedicure2} alt="Pediküre-Stuhl im Lucky Nails Studio" fill sizes="(max-width: 1023px) 100vw, 520px" />
              </div>
            </div>
            <div className="pgx-copy">
              <span className="pg-eyebrow" data-r>Persönlich oder online</span>
              <h2 data-r>Wir sind für dich da</h2>
              <p data-r>
                Lieber telefonisch? Ruf uns an: <a className="pgx-link" href={`tel:${site.phone.tel}`}>{site.phone.display}</a>. Die Preise findest du unter <Link className="pgx-link" href="/leistungen#preise">Leistungen &amp; Preise</Link>.
              </p>
              <div className="pgx-actions" data-r>
                <BookingCTA variant="primary" label="Jetzt Termin buchen" />
                <Link href="/studio" className="btn btn-outline">Über uns</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-ivory" aria-label="Check-in">
        <div className="wrap">
          <CheckinQR />
        </div>
      </section>

      <section className="section on-dark" aria-label="Studio kennenlernen">
        <div className="wrap">
          <CtaBand title="Lerne unser Studio kennen" text="Komm vorbei – wir freuen uns auf dich." image="/img/pg-studio-wide.webp" second={{ href: "/studio", label: "Über uns" }} />
        </div>
      </section>
    </>
  );
}
