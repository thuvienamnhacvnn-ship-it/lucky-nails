"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryItem } from "@/config/gallery";
import GalleryLightbox from "./GalleryLightbox";

// Echte Arbeiten einer Kategorie – Klick öffnet die Lightbox.
export default function RealGrid({ items }: { items: GalleryItem[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  return (
    <>
      <div className="pg-real">
        {items.map((it, i) => (
          <button key={it.src} className="gal-tile" onClick={() => setIdx(i)} aria-label={`Bild vergrößern: ${it.alt}`}>
            <Image src={it.src} alt={it.alt} fill sizes="(max-width: 767px) 50vw, 240px" loading="lazy" />
            <span className="tag-real">Echte Arbeit</span>
          </button>
        ))}
      </div>
      <GalleryLightbox items={items} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />
    </>
  );
}
