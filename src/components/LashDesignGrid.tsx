import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { lashes } from "@/config/lashes";

// Gleiche Kachel wie Nail Designs (pgx-nd), mit echtem Foto statt Nagel-Rendering. Klick -> Preisliste Reiter Wimpern.
export default function LashDesignGrid() {
  return (
    <div className="pgx-ndgrid">
      {lashes.map((l, i) => (
        <Link key={l.slug} href="/leistungen?tab=wimpern#preise" className="pgx-nd lash pgx-tilt pgx-edge" data-r style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
          <span className="stage">
            <Image src={l.photo} alt={`${l.name} Wimpernverlängerung bei Lucky Nails Berlin`} fill quality={90} sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 440px" />
          </span>
          <span className="info">
            <small>{l.tag}</small>
            <b>{l.name}</b>
            <span>{l.desc}</span>
            <span className="foot">
              <em>{l.from}</em>
              <i aria-hidden>›</i>
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
