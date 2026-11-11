"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/config/gallery";

export default function GalleryLightbox({ items, index, onClose, onIndex }: { items: GalleryItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const touch = useRef<number | null>(null);
  const open = index !== null;
  const n = items.length;

  // Fokus beim Öffnen merken (vor dem Rendern des Dialogs) und beim Schließen zurückgeben
  const opener = useRef<HTMLElement | null>(null);
  if (open && !opener.current && typeof document !== "undefined") opener.current = document.activeElement as HTMLElement | null;
  useEffect(() => {
    if (open || !opener.current) return;
    const o = opener.current;
    opener.current = null;
    if (document.contains(o)) o.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((index! - 1 + n) % n);
      if (e.key === "ArrowRight") onIndex((index! + 1) % n);
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", key); };
  }, [open, index, n, onClose, onIndex]);

  if (!open || typeof document === "undefined") return null;
  const it = items[index!];
  const next = items[(index! + 1) % n];
  const prevI = items[(index! - 1 + n) % n];

  return createPortal(
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Bildansicht"
      onClick={onClose}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 40) onIndex((index! + (dx < 0 ? 1 : -1) + n) % n);
      }}
    >
      <figure onClick={(e) => e.stopPropagation()}>
        <Image key={it.src} src={it.src} alt={it.alt} width={it.w} height={it.h} sizes="90vw" quality={85} priority />
        <figcaption>
          {index! + 1} / {n} · {it.kind === "real" ? "Echte Arbeit" : it.kind === "studio" ? "Im Studio" : "Illustration"} · {it.alt}
        </figcaption>
      </figure>
      <button className="lb-btn lb-close" aria-label="Schließen" onClick={(e) => { e.stopPropagation(); onClose(); }} autoFocus>
        <X size={24} />
      </button>
      <button className="lb-btn lb-prev" aria-label="Vorheriges Bild" onClick={(e) => { e.stopPropagation(); onIndex((index! - 1 + n) % n); }}>
        <ChevronLeft size={26} />
      </button>
      <button className="lb-btn lb-next" aria-label="Nächstes Bild" onClick={(e) => { e.stopPropagation(); onIndex((index! + 1) % n); }}>
        <ChevronRight size={26} />
      </button>
      {/* Nachbarbilder vorladen */}
      <link rel="preload" as="image" href={next.src} />
      <link rel="preload" as="image" href={prevI.src} />
    </div>,
    document.body,
  );
}
