"use client";

import { useEffect, useRef } from "react";

// Hintergrund wie ein 360°-Foto: 80 Frames (Kamerafahrt links -> rechts) werden je nach Mausposition überblendet.
// Maus x 0..1 über dem Hero -> Frame 1..80 (weich nachgeführt, Crossfade zwischen Nachbarframes). Maus raus -> Rückkehr zur Mitte (Frame ~40).
// Touch: horizontal ziehen; optional Geräteneigung (DeviceOrientation gamma, iOS-Erlaubnis beim ersten Tippen).
// reduced-motion: nur Mittelframe. Lädt zuerst f040 (Poster), dann jeden 8. Frame, dann den Rest.
const N = 80, MID = 40;
const W = 1264, H = 720;
const src = (i: number) => `/img/salon-pan/f${String(i).padStart(3, "0")}.webp`;
const POSTER = "/img/salon-bg-poster.webp";
const FALLBACK = "/img/hero-space.webp";

export default function HeroPanorama() {
  const cv = useRef<HTMLCanvasElement>(null);
  const base = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = cv.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = W; canvas.height = H;
    const hero = canvas.closest(".hero") as HTMLElement;
    const art = canvas.closest(".hero-art") as HTMLElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames: (HTMLImageElement | null)[] = new Array(N + 1).fill(null);
    let cur = MID, target = MID, raf = 0, last = performance.now(), ready = false, lastDrag = -1e9, tilt: number | null = null;

    const draw = () => {
      // nächstliegende geladene Frames unter/über dem aktuellen Wert, Überblendung nach Abstand
      const f = Math.min(N, Math.max(1, cur));
      let lo = Math.floor(f), hi = Math.ceil(f);
      while (lo > 1 && !frames[lo]) lo--;
      while (hi < N && !frames[hi]) hi++;
      const a = frames[lo] ?? frames[hi], b = frames[hi] ?? frames[lo];
      if (!a || !b) return;
      ctx.globalAlpha = 1;
      ctx.drawImage(a, 0, 0, W, H);
      if (b !== a && hi !== lo) {
        const t = Math.min(1, Math.max(0, (f - lo) / (hi - lo)));
        ctx.globalAlpha = t;
        ctx.drawImage(b, 0, 0, W, H);
        ctx.globalAlpha = 1;
      }
      if (!ready) { ready = true; canvas.style.opacity = "1"; }
    };

    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const k = 1 - Math.pow(1 - 0.08, dt * 60);
      cur += (target - cur) * k;
      draw();
      if (Math.abs(target - cur) > 0.02) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    const load = (i: number) => new Promise<void>((res) => {
      if (frames[i]) return res();
      const im = new Image();
      im.onload = () => { frames[i] = im; res(); };
      im.onerror = () => res();
      im.src = src(i);
    });
    (async () => {
      await load(MID); draw(); kick();
      if (reduced) return;
      for (let i = 1; i <= N; i += 8) { await load(i); kick(); }
      await load(N);
      for (let i = 1; i <= N; i++) { await load(i); if (i % 6 === 0) kick(); }
      kick();
    })();

    if (reduced) return () => {};

    const inHero = (x: number, y: number) => { const r = hero.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom ? r : null; };
    const onMove = (e: MouseEvent) => {
      const r = inHero(e.clientX, e.clientY);
      if (r) target = 1 + ((e.clientX - r.left) / r.width) * (N - 1);
      else target = MID;
      kick();
    };
    const onLeave = () => { target = MID; kick(); };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    // Touch-Ziehen (horizontal); Seitenscrollen vertikal bleibt (touch-action: pan-y)
    let sx = 0, st = MID, dragging = false;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      dragging = true; sx = e.clientX; st = target; lastDrag = performance.now();
      // iOS: Erlaubnis für Geräteneigung beim ersten Tippen
      const DO = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (DO && typeof DO.requestPermission === "function") DO.requestPermission().then((s) => { if (s === "granted") window.addEventListener("deviceorientation", onOri); }).catch(() => {});
    };
    const pm = (e: PointerEvent) => {
      if (!dragging) return;
      const w = art.getBoundingClientRect().width;
      target = Math.min(N, Math.max(1, st - ((e.clientX - sx) / w) * (N - 1) * 1.1));
      lastDrag = performance.now(); kick();
    };
    const pu = () => { dragging = false; };
    art.addEventListener("pointerdown", pd); art.addEventListener("pointermove", pm);
    art.addEventListener("pointerup", pu); art.addEventListener("pointercancel", pu);
    const onOri = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || performance.now() - lastDrag < 2500) return;
      tilt = Math.max(-30, Math.min(30, e.gamma));
      target = MID + (tilt / 30) * (MID - 1) * 0.8; kick();
    };
    if (!(window.DeviceOrientationEvent as unknown as { requestPermission?: unknown })?.requestPermission) window.addEventListener("deviceorientation", onOri);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove); document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("deviceorientation", onOri);
      art.removeEventListener("pointerdown", pd); art.removeEventListener("pointermove", pm);
      art.removeEventListener("pointerup", pu); art.removeEventListener("pointercancel", pu);
    };
  }, []);

  const fill = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } as const;
  return (
    <>
      {/* Rückfallebene: Poster, dann hero-space.webp */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={base} src={POSTER} alt="" style={fill} onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }} />
      <canvas ref={cv} aria-hidden="true" style={{ ...fill, opacity: 0, transition: "opacity .3s" }} />
    </>
  );
}
