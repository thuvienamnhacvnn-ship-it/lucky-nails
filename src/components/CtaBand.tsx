import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/config/site";
import BookingCTA from "./BookingCTA";

// Abschluss-Band: Studiofoto als Hintergrund, Titel + Champagner-Button (BePro) im Holz-Panel.
export default function CtaBand({
  title = "Termin online buchen",
  text = "Buche online in wenigen Minuten – oder ruf uns einfach an.",
  image = "/img/pg-studio-wide.webp",
  second,
}: {
  title?: string;
  text?: string;
  image?: string;
  second?: { href: string; label: string };
}) {
  return (
    <div className="pgx-cta" data-r>
      <Image src={image} alt="Das Lucky Nails Studio in Berlin-Friedrichshain" fill sizes="(max-width: 1440px) 100vw, 1312px" />
      <div className="pgx-cta-panel">
        <span className="pg-eyebrow">Lucky Nails Berlin</span>
        <h2>{title}</h2>
        <span className="pgx-line" aria-hidden="true" />
        <p>{text}</p>
        <div className="pgx-actions">
          <BookingCTA variant="primary" label="Termin buchen" />
          {second ? (
            <Link className="btn btn-outline" href={second.href}>{second.label}</Link>
          ) : (
            <a className="btn btn-outline" href={`tel:${site.phone.tel}`}>
              <Phone size={19} aria-hidden /> {site.phone.display}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
