"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryItem } from "@/config/gallery";
import GalleryLightbox from "./GalleryLightbox";

// Studio-Eindrücke als Mosaik; Klick öffnet die Lightbox (Pfeiltasten, ESC, Wischen).
const shape = ["wide", "tall", "", "", "tall", "", "", "wide"];

export default function StudioGallery({ items, variant }: { items: GalleryItem[]; variant?: "row" }) {
  const [idx, setIdx] = useState<number | null>(null);
  return (
    <>
      <div className={variant === "row" ? "pgk-sq" : "pg-mosaic"}>
        {items.map((it, i) => (
          <button key={it.src} className={variant === "row" ? "pgk-sqi" : shape[i] ?? ""} onClick={() => setIdx(i)} aria-label={`Bild vergrößern: ${it.alt}`}>
            <Image src={it.src} alt={it.alt} fill sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 340px" loading="lazy" />
          </button>
        ))}
      </div>
      <GalleryLightbox items={items} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />
    </>
  );
}
