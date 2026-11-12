import Image from "next/image";
import { Globe, MapPin, Phone, CalendarCheck, HeartHandshake } from "lucide-react";
import BookingCTA from "@/components/BookingCTA";
import CtaBand from "@/components/CtaBand";
import { TikTokIcon, WhatsAppIcon } from "@/components/Icons";
import { PgxHero, PgxMarquee, PgxSteps } from "@/components/Pgx";
import { PgxRail } from "@/components/PgxClient";
import PgxFx from "@/components/PgxFx";
import { PgTrio } from "@/components/PageKit";
import SectionHead from "@/components/SectionHead";
import { studioBento } from "@/config/gallery";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Kontakt & Anfahrt",
  "Lucky Nails, Boxhagener Str. 19, 10245 Berlin-Friedrichshain. Telefon 0152 09666888 – oder gleich online Termin buchen.",
  "/kontakt",
);

const steps = [
  { h: "Leistung wählen", p: "Maniküre, Pediküre oder Nagelmodellage." },
  { h: "Datum & Uhrzeit", p: "Deinen Wunschtermin aussuchen." },
  { h: "Daten eingeben", p: "Kurz und unkompliziert." },
  { h: "Bestätigung erhalten", p: "Fertig – wir freuen uns auf dich." },
];

export default function Page() {
  return (
    <>
      <PgxFx />
      <PgxHero src="/img/fassade-video-poster.webp" mobile="/img/m/kontakt.webp" video="/video/fassade-lucky.mp4" alt="Das Lucky Nails Studio an der Boxhagener Straße in Berlin-Friedrichshain" pos="50% 8%" eyebrow="Besuch uns" title="Kontakt & Termin buchen" sub="Wir freuen uns auf deinen Besuch in Berlin-Friedrichshain.">
        <div className="pgx-actions">
          <BookingCTA variant="primary" label="Jetzt Termin buchen" chevron={false} />
          <a className="btn btn-outline" href={`tel:${site.phone.tel}`}>
            <Phone size={18} aria-hidden /> {site.phone.display}
          </a>
        </div>
      </PgxHero>
      <PgxMarquee items={[`${site.address.street}`, `${site.address.zip} ${site.address.city}`, site.phone.display, site.web.display, "Online Termin buchen"]} />

      <section className="section on-dark" aria-label="Kontakt und Anfahrt">
        <div className="wrap">
          <div className="pgx-kgrid">
            <div className="pgk-card pgk-kc pgx-tilt pgx-edge" data-r>
              <h2>Kontakt</h2>
              <ul className="k-list">
                <li>
                  <MapPin aria-hidden />
                  <span>
                    {site.name}
                    <br />
                    {site.address.street}
                    <br />
                    {site.address.zip} {site.address.city}
                  </span>
                </li>
                <li>
                  <Phone aria-hidden />
                  <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
                </li>
                <li>
                  <Globe aria-hidden />
                  <a href={site.web.url}>{site.web.display}</a>
                </li>
                <li>
                  <TikTokIcon width={24} height={24} style={{ color: "#a57635", flex: "none", marginTop: 2 }} />
                  <a href={site.tiktok.url} target="_blank" rel="noopener noreferrer">
                    @{site.tiktok.handle}
                  </a>
                </li>
              </ul>
              <div className="pgx-photo" style={{ aspectRatio: "4 / 3", margin: "8px 0 4px" }}>
                <Image src="/img/pg-studio-wide.webp" alt="Blick durch das Lucky Nails Studio" fill sizes="(max-width: 767px) 100vw, 520px" />
              </div>
              <div className="k-btns">
                <a className="btn btn-wine" href={`tel:${site.phone.tel}`}>
                  <Phone size={18} aria-hidden /> Jetzt anrufen
                </a>
                {site.whatsapp && (
                  <a className="btn btn-ghost-ivory" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon width={20} height={20} /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="pgk-card pgk-kc pgx-tilt pgx-edge" data-r style={{ "--d": "110ms" } as React.CSSProperties}>
              <h2>Anfahrt</h2>
              <div className="pgx-photo" style={{ aspectRatio: "4 / 3", marginBottom: 16 }}>
                <Image src="/img/pgx-fassade.webp" alt="Eingang des Lucky Nails Studios in der Boxhagener Straße" fill sizes="(max-width: 767px) 100vw, 520px" style={{ objectPosition: "50% 45%" }} />
              </div>
              <p>
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}-{site.address.district}
              </p>
              <div className="k-btns">
                <a className="btn btn-wine" href={site.mapsLink} target="_blank" rel="noopener noreferrer">
                  <MapPin size={18} aria-hidden /> Route planen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-ivory" aria-labelledby="bk-h">
        <div className="wrap">
          <SectionHead id="bk-h" eyebrow="Online Booking" title="In vier Schritten zum Termin" />
          <PgxSteps steps={steps} />
          <div className="pgx-actions center" style={{ marginTop: 40 }}>
            <BookingCTA variant="primary" label="Jetzt Termin buchen" chevron={false} />
          </div>
        </div>
      </section>

      <section className="section on-dark" aria-label="Vorteile">
        <div className="wrap">
          <PgTrio
            items={[
              { Icon: CalendarCheck, h: "Schnelle Online-Buchung", p: "In wenigen Minuten zum Wunschtermin – direkt über BePro." },
              { Icon: HeartHandshake, h: "Persönliche Beratung", p: "Wir nehmen uns Zeit für deine Wünsche." },
              { Icon: MapPin, h: "Berlin-Friedrichshain", p: `${site.address.street}, ${site.address.zip} ${site.address.city}` },
            ]}
          />
        </div>
      </section>

      <section className="section on-dark" style={{ paddingTop: 0 }} aria-labelledby="k-rail">
        <div className="wrap">
          <SectionHead id="k-rail" eyebrow="Schau vorbei" title="So sieht es bei uns aus" />
          <PgxRail items={studioBento} label="Eindrücke aus dem Studio" />
        </div>
      </section>

      <section className="section on-dark" style={{ paddingTop: 0 }} aria-label="Studio kennenlernen">
        <div className="wrap">
          <CtaBand title="Lerne unser Studio kennen" text="Komm vorbei oder buche deinen Termin gleich online." image="/img/pg-studio-wide.webp" />
        </div>
      </section>
    </>
  );
}
