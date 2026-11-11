"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { galleryFilters, galleryItems, realItems, type GalleryFilter, type GalleryItem } from "@/config/gallery";
import GalleryLightbox from "./GalleryLightbox";

const Badge = ({ it }: { it: GalleryItem }) => <span className="pgx-badge">{it.kind === "real" ? "Echte Arbeit" : "Im Studio"}</span>;

// Vorschau auf der Startseite: nur echte Fotos, 5 x 2.
export function GalleryPreview() {
  const [idx, setIdx] = useState<number | null>(null);
  const items = realItems.slice(0, 10);
  return (
    <>
      <div className="gal-grid5">
        {items.map((it, i) => (
          <button key={it.src} className="gal-tile" onClick={() => setIdx(i)} aria-label={`Bild vergrößern: ${it.alt}`}>
            <Image src={it.src} alt={it.alt} fill sizes="(max-width: 767px) 50vw, 240px" loading="lazy" />
          </button>
        ))}
      </div>
      <GalleryLightbox items={items} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />
    </>
  );
}

// Galerie: Filter (nur Kategorien mit Bildern) + Masonry mit natürlichen Seitenverhältnissen + Lightbox.
export default function GalleryGrid() {
  const filters = useMemo(() => galleryFilters.filter((f) => f === "Alle" || galleryItems.some((g) => g.cat === f)), []);
  const [filter, setFilter] = useState<GalleryFilter>("Alle");
  const [idx, setIdx] = useState<number | null>(null);
  const items = useMemo(() => (filter === "Alle" ? galleryItems : galleryItems.filter((g) => g.cat === filter)), [filter]);

  return (
    <>
      <div className="filters" role="group" aria-label="Galerie filtern">
        {filters.map((f) => (
          <button key={f} className="pill pg-pill" aria-pressed={filter === f} onClick={() => { setFilter(f); setIdx(null); }}>
            {f}
            <small>{f === "Alle" ? galleryItems.length : galleryItems.filter((g) => g.cat === f).length}</small>
          </button>
        ))}
      </div>
      <p className="pg-count" role="status" aria-live="polite">
        {items.length} {items.length === 1 ? "Bild" : "Bilder"}
        {filter !== "Alle" ? ` · ${filter}` : ""} – Tippen zum Vergrößern
      </p>
      <div className="pgx-mas" key={filter}>
        {items.map((it, i) => (
          <button key={it.src} className="pgx-mi pgx-edge" style={{ "--i": i } as CSSProperties} onClick={() => setIdx(i)} aria-label={`Bild vergrößern: ${it.alt}`}>
            <Image src={it.src} alt={it.alt} width={it.w} height={it.h} sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 320px" loading={i < 4 ? "eager" : "lazy"} />
            <Badge it={it} />
          </button>
        ))}
      </div>
      <GalleryLightbox items={items} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />
    </>
  );
}
