"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { nails } from "@/config/nails";

const N = nails.length;
const SCALE = [1.12, 0.96, 0.86, 0.78];
const LIFT = [-8, 0, 8, 14]; // translateY px
const FADE = [1, 0.95, 0.85, 0.7];
const AUTOPLAY_MS = 4000;

// kürzester Abstand auf dem Kreis, Bereich -2 … +3
function offset(i: number, active: number) {
  let d = (i - active) % N;
  if (d > 3) d -= N;
  if (d < -2) d += N;
  return d;
}

export default function NailCarousel() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [jump, setJump] = useState<number[]>([]);
  const prevOff = useRef<number[]>(nails.map((_, i) => offset(i, 0)));
  const touch = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const f = () => setReduced(mq.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const go = useCallback((to: number) => {
    const next = ((to % N) + N) % N;
    const wrapped: number[] = [];
    nails.forEach((_, i) => {
      if (Math.abs(offset(i, next) - prevOff.current[i]) > 3) wrapped.push(i);
    });
    prevOff.current = nails.map((_, i) => offset(i, next));
    setJump(wrapped);
    setActive(next);
    if (wrapped.length) requestAnimationFrame(() => requestAnimationFrame(() => setJump([])));
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => go(active + 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [active, paused, reduced, go]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
  };

  const cur = nails[active];

  return (
    <div
      ref={root}
      className="stage"
      role="region"
      aria-roledescription="Karussell"
      aria-label="Unsere sechs Nail Designs"
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        if (touch.current !== null) {
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) >= 35) go(active + (dx < 0 ? 1 : -1));
        }
        touch.current = null;
        setPaused(false);
      }}
    >
      <div className="stage-caption" aria-live="polite">
        <b>{cur.name}</b>
        <small>{cur.tag}</small>
      </div>


      <div className="stage-persp">
        {nails.map((n, i) => {
          const d = offset(i, active);
          const a = Math.abs(d);
          const isActive = d === 0;
          const x = `calc(var(--step) * ${d - 0.5})`;
          const style: React.CSSProperties = {
            transform: `translate3d(${x}, calc(var(--k) * ${LIFT[a]}px), calc(var(--k) * ${-a * 40}px)) rotateY(${-d * 10}deg) scale(${SCALE[a]})`,
            opacity: FADE[a],
            zIndex: 10 - a,
          };
          return (
            <div key={n.slug} className={`nail-wrap ${jump.includes(i) ? "wrap-jump" : ""}`} style={style}>
              <Image src={n.nail} alt={`${n.name} – ${n.en}`} width={227} height={480} sizes="120px" priority={i < 3} draggable={false} />
              <button
                className="nail-hit"
                tabIndex={-1}
                aria-label={isActive ? `${n.name} ansehen` : `${n.name} auswählen`}
                onClick={() => (isActive ? router.push(`/nail-designs/${n.slug}`) : go(i))}
              />
            </div>
          );
        })}
      </div>

      <button className="arrow prev" aria-label="Vorheriges Design" onClick={() => go(active - 1)}>
        <ChevronLeft size={26} strokeWidth={2} />
      </button>
      <button className="arrow next" aria-label="Nächstes Design" onClick={() => go(active + 1)}>
        <ChevronRight size={26} strokeWidth={2} />
      </button>

      <div className="dots">
        {nails.map((n, i) => (
          <button key={n.slug} className="dot" aria-label={`${n.name} anzeigen`} aria-pressed={i === active} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}
