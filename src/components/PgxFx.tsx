"use client";

import { useEffect } from "react";

// Sanfte Effekte der Unterseiten: Reveal beim Scrollen, Zähler, Parallax, 3D-Neigung der Karten.
// Nur transform/opacity. Bei prefers-reduced-motion bleibt alles ruhig und sofort sichtbar.
export default function PgxFx() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    const runCount = (el: HTMLElement) => {
      const to = parseFloat(el.dataset.count ?? "0");
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = "0";
      requestAnimationFrame(step);
    };

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-r]"));
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));

    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((e) => e.classList.add("in"));
    } else {
      root.classList.add("pgx-js");
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            const el = en.target as HTMLElement;
            io.unobserve(el);
            el.classList.add("in");
            const d = parseInt(getComputedStyle(el).getPropertyValue("--d")) || 0;
            // nach dem Einblenden Reveal-Regeln entfernen, damit Hover/Neigung frei arbeiten
            window.setTimeout(() => el.removeAttribute("data-r"), 1200 + d);
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
      );
      reveals.forEach((e) => io.observe(e));
      cleanups.push(() => io.disconnect());

      const co = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            co.unobserve(en.target);
            runCount(en.target as HTMLElement);
          }
        },
        { threshold: 0.4 },
      );
      counters.forEach((e) => co.observe(e));
      cleanups.push(() => co.disconnect());
      cleanups.push(() => root.classList.remove("pgx-js"));
    }

    // Parallax (Hero-Bilder)
    const par = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"));
    if (par.length && !reduce) {
      let tick = false;
      const upd = () => {
        tick = false;
        for (const el of par) {
          const r = el.parentElement!.getBoundingClientRect();
          if (r.bottom < -50 || r.top > window.innerHeight + 50) continue;
          const k = parseFloat(el.dataset.par ?? "0.15");
          el.style.transform = `translate3d(0, ${(-r.top * k).toFixed(1)}px, 0)`;
        }
      };
      const onScroll = () => {
        if (!tick) {
          tick = true;
          requestAnimationFrame(upd);
        }
      };
      upd();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    // 3D-Neigung + Lichtpunkt für Karten (nur Maus)
    if (!reduce && window.matchMedia("(hover: hover)").matches) {
      const tiltOf = (e: Event) => (e.target as HTMLElement).closest?.(".pgx-tilt") as HTMLElement | null;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const t = tiltOf(e);
        if (!t) return;
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        t.style.setProperty("--ry", `${((x - 0.5) * 7).toFixed(2)}deg`);
        t.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
        t.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        t.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      };
      const onOut = (e: PointerEvent) => {
        const t = tiltOf(e);
        if (!t || t.contains(e.relatedTarget as Node)) return;
        t.style.setProperty("--ry", "0deg");
        t.style.setProperty("--rx", "0deg");
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onOut);
      });
    }

    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
