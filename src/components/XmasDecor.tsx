"use client";

import { useEffect, useRef } from "react";

// Weihnachts-Deko: Tannengirlande mit Kugeln/Zapfen/Beeren, funkelnde Lichterkette, goldene Schleife, sanfter Schneefall.
// Alles prozedural (SVG-Kachel als Hintergrund), rein dekorativ (pointer-events: none, aria-hidden).
// Abschalten: <XmasDecor /> in app/layout.tsx entfernen.

const TW = 280, TH = 50, Y0 = 6, YC = 36; // Kachel + Durchhang (quadratische Kurve)
const curve = (t: number): [number, number] => [TW * t, (1 - t) * (1 - t) * Y0 + 2 * t * (1 - t) * YC + t * t * Y0];
const slope = (t: number) => Math.atan2(2 * (1 - t) * (YC - Y0) + 2 * t * (2 * Y0 - 2 * YC) * 0 + 2 * t * (Y0 - YC), TW);

let sd = 7;
const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };

function garlandSvg(): string {
  const o: string[] = [];
  // Zweig-Körper
  const pts: string[] = [];
  for (let i = 0; i <= 28; i++) { const [x, y] = curve(i / 28); pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`); }
  o.push(`<path d="${pts.join(" ")}" stroke="#16391f" stroke-width="13" fill="none" stroke-linecap="round"/>`);
  // Nadeln
  const greens = ["#1f5a30", "#2d7a42", "#174a28", "#3b8f50", "#245f35"];
  for (let k = 0; k < 520; k++) {
    const t = rnd(); const [x, y] = curve(t); const a = (rnd() - 0.5) * 3.1 + Math.PI / 2 * (rnd() < 0.5 ? 1 : -1) + slope(t) * 0.3;
    const L = 5 + rnd() * 9;
    const x2 = x + Math.cos(a) * L, y2 = y + Math.sin(a) * L;
    o.push(`<line x1="${x.toFixed(1)}" y1="${(y + (rnd() - 0.5) * 6).toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${greens[Math.floor(rnd() * greens.length)]}" stroke-width="${(1 + rnd() * 1.2).toFixed(1)}" stroke-linecap="round"/>`);
  }
  // Zapfen
  for (const t of [0.14, 0.64]) {
    const [x, y] = curve(t);
    o.push(`<g transform="translate(${x.toFixed(1)},${(y + 3).toFixed(1)}) rotate(${t < 0.3 ? -20 : 15})"><ellipse rx="6" ry="9" fill="#6b4423"/><path d="M-5,-4 L5,-4 M-6,0 L6,0 M-5,4 L5,4 M0,-8 L0,8" stroke="#3b2412" stroke-width="1.4"/><path d="M-4,-6 q4,3 8,0 M-5,-2 q5,3 10,0 M-5,2 q5,3 10,0" stroke="#a5743f" stroke-width="1" fill="none"/></g>`);
  }
  // Kugeln: rot / gold / rot
  const ball = (t: number, c1: string, c2: string, r: number, drop: number) => {
    const [x, y] = curve(t);
    return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + drop).toFixed(1)}" stroke="#c9a25a" stroke-width="1"/>` +
      `<circle cx="${x.toFixed(1)}" cy="${(y + drop + r).toFixed(1)}" r="${r}" fill="url(#${c1})"/>` +
      `<rect x="${(x - 2.2).toFixed(1)}" y="${(y + drop - 2).toFixed(1)}" width="4.4" height="3.4" rx="1" fill="#d8b25c"/>` +
      `<ellipse cx="${(x - r * 0.35).toFixed(1)}" cy="${(y + drop + r * 0.65).toFixed(1)}" rx="${(r * 0.28).toFixed(1)}" ry="${(r * 0.18).toFixed(1)}" fill="#fff" opacity=".75"/>`;
  };
  o.push(ball(0.3, "gR", "", 7.5, 3), ball(0.5, "gG", "", 8.5, 4), ball(0.72, "gR", "", 7, 3));
  // Beeren (Stechpalme)
  for (const t of [0.04, 0.4, 0.88]) {
    const [x, y] = curve(t);
    o.push(`<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><path d="M-9,2 q4,-7 9,-3 q-2,7 -9,3z M9,2 q-4,-7 -9,-3 q2,7 9,3z" fill="#1f5a30" stroke="#143a1f" stroke-width=".6"/><circle cx="-3" cy="3" r="3" fill="#c4122f"/><circle cx="3" cy="3.5" r="3" fill="#a60d27"/><circle cx="0" cy="-1" r="3" fill="#d6203c"/><circle cx="-4" cy="2" r=".9" fill="#fff" opacity=".7"/></g>`);
  }
  // Sterne (Gold)
  for (const t of [0.2, 0.58, 0.95]) {
    const [x, y] = curve(t);
    let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 2.8 : 6; d += `${i ? "L" : "M"}${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }
    o.push(`<path transform="translate(${x.toFixed(1)},${(y + 1).toFixed(1)})" d="${d}Z" fill="#e8c46a" stroke="#a87a25" stroke-width=".5"/>`);
  }
  const defs = `<defs><radialGradient id="gR" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff6b78"/><stop offset=".45" stop-color="#c4122f"/><stop offset="1" stop-color="#6b0a1a"/></radialGradient><radialGradient id="gG" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff3bf"/><stop offset=".5" stop-color="#d8a944"/><stop offset="1" stop-color="#7d5516"/></radialGradient></defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${TW} ${TH}">${defs}${o.join("")}</svg>`;
}

// Lichterkette: Draht + Birnen; zwei Phasen (A/B) funkeln abwechselnd
function lightsSvg(phase: 0 | 1): string {
  const cols = ["#fff0b0", "#ff5a5a", "#ffd24d", "#7be07b", "#ffb347", "#8fd3ff"];
  const o: string[] = [];
  const N = 9;
  for (let i = 0; i < N; i++) {
    if (i % 2 !== phase) continue;
    const t = (i + 0.5) / N; const [x, y] = curve(t);
    const c = cols[(i * 5 + 1) % cols.length];
    const by = y + 8;
    o.push(`<circle cx="${x.toFixed(1)}" cy="${(by + 2).toFixed(1)}" r="13" fill="${c}" opacity=".28"/><circle cx="${x.toFixed(1)}" cy="${(by + 2).toFixed(1)}" r="7" fill="${c}" opacity=".45"/>`);
    o.push(`<rect x="${(x - 2).toFixed(1)}" y="${(by - 5).toFixed(1)}" width="4" height="4" rx=".8" fill="#3a3a3a"/><path d="M${(x - 3).toFixed(1)},${(by - 1).toFixed(1)} q3,-3 6,0 q2,6 -3,8 q-5,-2 -3,-8z" fill="${c}" stroke="#fff" stroke-opacity=".55" stroke-width=".6"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${TW} ${TH}">${o.join("")}</svg>`;
}
const wireSvg = () => {
  const pts: string[] = [];
  for (let i = 0; i <= 28; i++) { const [x, y] = curve(i / 28); pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${(y + 6).toFixed(1)}`); }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${TW} ${TH}"><path d="${pts.join(" ")}" stroke="#2c2c2c" stroke-width="1.2" fill="none"/></svg>`;
};

const uri = (s: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(s)}")`;

const BOW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 110" width="150" height="110"><defs><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0243d"/><stop offset=".6" stop-color="#a50f26"/><stop offset="1" stop-color="#6f0818"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".5" stop-color="#dcae4c"/><stop offset="1" stop-color="#8a5f1a"/></linearGradient></defs>
<path d="M66,34 C58,60 40,82 30,100 L52,92 L58,106 C66,84 72,62 75,48Z" fill="url(#r)" stroke="#5b0714" stroke-width=".8"/><path d="M84,34 C92,60 110,82 120,100 L98,92 L92,106 C84,84 78,62 75,48Z" fill="url(#r)" stroke="#5b0714" stroke-width=".8"/>
<path d="M72,40 C50,6 8,2 6,28 C5,52 46,54 72,44Z" fill="url(#r)" stroke="#5b0714" stroke-width="1"/><path d="M78,40 C100,6 142,2 144,28 C145,52 104,54 78,44Z" fill="url(#r)" stroke="#5b0714" stroke-width="1"/>
<path d="M68,38 C48,16 22,12 16,26 M82,38 C102,16 128,12 134,26" stroke="#ff8a96" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>
<path d="M70,42 C48,30 26,34 22,40 M80,42 C102,30 124,34 128,40" stroke="#5b0714" stroke-width="1.2" fill="none" opacity=".55"/>
<rect x="64" y="30" width="22" height="22" rx="7" fill="url(#g)" stroke="#7a5216" stroke-width="1"/><path d="M68,36 q7,-4 14,0" stroke="#fff6d0" stroke-width="1.6" fill="none" opacity=".8"/>
<g fill="url(#g)" stroke="#7a5216" stroke-width=".7"><ellipse cx="42" cy="98" rx="6" ry="7"/><ellipse cx="108" cy="98" rx="6" ry="7"/></g></svg>`;

export default function XmasDecor() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const g = c.getContext("2d");
    if (!g) return;
    let w = 0, h = 0, raf = 0;
    const dpr = 1; // Schnee ist weich: 1x reicht
    const resize = () => { w = window.innerWidth; h = window.innerHeight; c.width = w * dpr; c.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const N = w < 700 ? 30 : 60;
    const fl = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 1 + Math.random() * 2.6, v: 18 + Math.random() * 34, s: Math.random() * 6.28, a: 0.4 + Math.random() * 0.5 }));
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      g.clearRect(0, 0, w, h);
      g.fillStyle = "#fff";
      for (let b = 0; b < 3; b++) { // 3 Alpha-Stufen, je ein Pfad statt Einzelpfade
        g.globalAlpha = 0.45 + b * 0.22; g.beginPath();
        for (let i = b; i < fl.length; i += 3) {
          const f = fl[i];
          f.y += f.v * dt; f.s += dt * 0.9; f.x += Math.sin(f.s) * 12 * dt;
          if (f.y > h + 6) { f.y = -6; f.x = Math.random() * w; }
          g.moveTo(f.x + f.r, f.y); g.arc(f.x, f.y, f.r, 0, 6.283);
        }
        g.fill();
      }
      g.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else { last = performance.now(); raf = requestAnimationFrame(tick); } };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const G = uri(garlandSvg()), W = uri(wireSvg()), LA = uri(lightsSvg(0)), LB = uri(lightsSvg(1));
  return (
    <div className="xm" aria-hidden="true">
      <div className="xm-g" style={{ backgroundImage: G }} />
      <div className="xm-g" style={{ backgroundImage: W }} />
      <div className="xm-g xm-la" style={{ backgroundImage: LA }} />
      <div className="xm-g xm-lb" style={{ backgroundImage: LB }} />
      <div className="xm-bow l" style={{ backgroundImage: uri(BOW) }} />
      <div className="xm-bow r" style={{ backgroundImage: uri(BOW) }} />
      <canvas ref={cv} className="xm-snow" />
    </div>
  );
}
