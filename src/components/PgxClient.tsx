"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/config/gallery";
import GalleryLightbox from "./GalleryLightbox";

const d = (i: number, step = 80): CSSProperties => ({ "--d": `${(i % 4) * step}ms` }) as CSSProperties;

// Bento: 8er-Muster aus großen/kleinen Feldern, Klick = Lightbox.
export function PgxBento({ items }: { items: GalleryItem[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  return (
    <>
      <div className="pgx-bento8">
        {items.map((it, i) => (
          <button key={it.src} className="pgx-tile pgx-edge" data-r style={d(i)} onClick={() => setIdx(i)} aria-label={`Bild vergrößern: ${it.alt}`}>
            <Image src={it.src} alt={it.alt} fill sizes="(max-width: 767px) 50vw, (max-width: 1279px) 40vw, 620px" loading="lazy" />
            <span className="cap">
              <span>
                <small>{it.kind === "real" ? "Echte Arbeit" : "Im Studio"}</small>
              </span>
            </span>
          </button>
        ))}
      </div>
      <GalleryLightbox items={items} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />
    </>
  );
}

// Horizontale Bildleiste: Pfeile, Wischen, Fortschrittslinie, Lightbox.
export function PgxRail({ items, label }: { items: GalleryItem[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState<number | null>(null);
  const [p, setP] = useState(0);
  const [end, setEnd] = useState<"start" | "mid" | "end">("start");
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const v = max > 0 ? el.scrollLeft / max : 0;
    setP(v);
    setEnd(v <= 0.01 ? "start" : v >= 0.99 ? "end" : "mid");
  };
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="pgx-railwrap">
      <div className="pgx-rail-bar">
        <div className="pgx-rail-prog" aria-hidden="true">
          <i style={{ transform: `scaleX(${0.18 + p * 0.82})` }} />
        </div>
        <div className="pgx-rail-btns">
          <button type="button" aria-label="Zurück" onClick={() => go(-1)} disabled={end === "start"}>
            <ChevronLeft size={22} />
          </button>
          <button type="button" aria-label="Weiter" onClick={() => go(1)} disabled={end === "end"}>
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
      <div className="pgx-rail" ref={ref} onScroll={onScroll} role="group" aria-label={label} tabIndex={0}>
        {items.map((it, i) => (
          <button key={it.src} className="pgx-tile pgx-edge" onClick={() => setIdx(i)} aria-label={`Bild vergrößern: ${it.alt}`}>
            <Image src={it.src} alt={it.alt} fill sizes="(max-width: 767px) 72vw, 340px" loading="lazy" />
            <span className="cap">
              <span>
                <small>{it.kind === "real" ? "Echte Arbeit" : "Im Studio"}</small>
              </span>
            </span>
          </button>
        ))}
      </div>
      <GalleryLightbox items={items} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />
    </div>
  );
}
