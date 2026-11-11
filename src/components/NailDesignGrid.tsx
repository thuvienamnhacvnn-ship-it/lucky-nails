import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { nails } from "@/config/nails";

// Hero-Rendering des Nagels (freigestellt auf Holz-Bühne) – keine KI-Illustrationen.
export const nailStill = (nail: string) => nail.replace(".webp", "-still.png");

export default function NailDesignGrid({ price = false }: { price?: boolean }) {
  return (
    <div className="pgx-ndgrid">
      {nails.map((n, i) => (
        <Link key={n.slug} href={`/nail-designs/${n.slug}`} className="pgx-nd pgx-tilt pgx-edge" data-r style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
          <span className="stage">
            <Image src={nailStill(n.nail)} alt={`${n.name} Nageldesign als 3D-Rendering`} fill sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 340px" />
          </span>
          <span className="info">
            <small>{n.tag}</small>
            <b>{n.name}</b>
            <span>{n.desc}</span>
            <span className="foot">
              {price ? <em>Neumodellage ab {n.price.neu}</em> : <em>Entdecken</em>}
              <i aria-hidden>›</i>
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
