"use client";

import { useEffect, useRef, useState } from "react";

// Laedt genau EIN Hero-Video (Desktop ODER Mobil) statt beide zu dekodieren; pausiert ausserhalb des Sichtbereichs und im Hintergrund-Tab.
export default function XmasHeroVideo() {
  const [src, setSrc] = useState<{ v: string; poster: string; cls: string } | null>(null);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mob = window.matchMedia("(max-width: 767px)").matches;
    setSrc(
      mob
        ? { v: "/video/xmas-mobile.mp4", poster: "/img/m/home-xmas.webp?v=1", cls: "bgm bgm-xmas-vid" }
        : { v: "/video/xmas-desktop.mp4", poster: "/img/salon-xmas.webp?v=1", cls: "bg bg-xmas-vid" },
    );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) el.play().catch(() => {});
      else el.pause();
    };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [src]);

  if (!src) return null;
  return <video ref={ref} className={src.cls} src={src.v} poster={src.poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />;
}
