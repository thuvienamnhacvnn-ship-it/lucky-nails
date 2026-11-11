"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// Gutschein dreht sich beim Hover/Fokus/Tippen auf die Rückseite; Raum = dunkle, virtuelle 3D-Bühne.
export default function GutscheinFlip({ front, back, children }: { front: string; back: string; children?: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  const [pin, setPin] = useState(false);
  const flip = hover !== pin; // Hover dreht um, Klick/Tippen dreht zusaetzlich (Touch: nur Tippen)
  const card = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tx", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--ty", `${(x * 14).toFixed(2)}deg`);
  };
  const leave = () => {
    const el = card.current;
    if (el) { el.style.setProperty("--tx", "0deg"); el.style.setProperty("--ty", "0deg"); }
    setHover(false);
  };

  return (
    <div className="gsf-scene" onPointerMove={move} onPointerLeave={leave}>
      <div className="gsf-floor" aria-hidden="true" />
      <div className="gsf-orbs" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ ["--i" as string]: i }} />)}</div>
      <div className={`gsf-inner${children ? " has-copy" : ""}`}>
      {children}
      <div className="gsf-stage">
        <div
          className="gsf-hit"
          role="button"
          tabIndex={0}
          aria-pressed={flip}
          aria-label={flip ? "Gutschein Rückseite – tippen für Vorderseite" : "Gutschein Vorderseite – Hover oder tippen für Rückseite"}
          onPointerEnter={(e) => { if (e.pointerType !== "touch") setHover(true); }}
          onPointerLeave={(e) => { if (e.pointerType !== "touch") setHover(false); }}
          onClick={() => setPin((v) => !v)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPin((v) => !v); } }}
        >
        <div ref={card} className={`gsf-card${flip ? " is-flip" : ""}`}>
          <div className="gsf-face gsf-front">
            <Image src={front} alt="Lucky Nails Geschenkgutschein, Vorderseite" fill sizes="(max-width: 900px) 92vw, 780px" />
          </div>
          <div className="gsf-face gsf-back">
            <Image src={back} alt="Gutschein Rückseite mit QR-Code zur Online-Buchung" fill sizes="(max-width: 900px) 92vw, 780px" />
          </div>
          <span className="gsf-shine" aria-hidden="true" />
        </div>
        </div>
        <p className="gsf-hint">{flip ? "Rückseite" : "Vorderseite"} · Hover oder Klick zum Wenden</p>
      </div>
      </div>
    </div>
  );
}
