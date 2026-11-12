"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Gem, Gift, Circle, Droplets, Hand, LayoutGrid, Sparkles, RotateCcw, ZoomIn } from "lucide-react";
import * as THREE from "three";
import { HERO_CATS, heroDesigns, type HeroCat } from "@/config/heroDesigns";
import { buildNailGeometry, defaultNail } from "@/lib/nailGeometry";
import { NAIL_HOME } from "@/lib/nailPose";
import { site } from "@/config/site";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "./Icons";
import { makeHeroMaterials } from "@/lib/heroMaterials";
import { buildDecor, disposeDecor } from "@/lib/nailDecor";
import { dissolve, updateCatUniforms } from "@/lib/nailShaders";
import { makeStudioEnv } from "@/lib/studioEnv";

// 3D-Galerie im Hero: ein Nagel schwebt im Raum (Orbit-Ring), links Kategorien, unten "Design Galerie" mit Vorschaubildern
// (zur Laufzeit aus denselben 3D-Modellen gerendert). Wechsel: alter Nagel zerfällt (Dissolve + Goldstaub), neuer baut sich auf.
// Auto-Wechsel alle 6 s; Ziehen = freie Arcball-Drehung (bleibt stehen); Mausrad/Pinch = Zoom bis 120 %; Hover pausiert.
const N = heroDesigns.length;
const HOME = NAIL_HOME; // Startpose wie gestern: Spitze nach unten-links, Körper ~45° geneigt
const AUTO_MS = 6000;
const RESUME_MS = 12000;
const T_OUT = 0.5, T_GAP = 0.15, T_IN = 0.6;
const NP = 160;
const ZMAX_DESK = 1.2, ZMAX_MOB = 1.8;
const isMob = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
const ICONS: Record<HeroCat, typeof Gem> = { alle: LayoutGrid, french: Hand, glitzer: Sparkles, verlauf: Droplets, minimal: Circle, xmas: Gift, strass: Gem, blood: Droplets };

type S = { q: THREE.Quaternion; axis: THREE.Vector3; speed: number; touched: boolean };
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const inCat = (i: number, f: HeroCat) => f === "alle" || heroDesigns[i].cats.includes(f);

type Ctl = { go: (i: number, user?: boolean) => void; reset: () => void; spin: () => boolean; zoom: () => boolean };

export default function HeroNail3D() {
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<HeroCat>("alle");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [uiHost, setUiHost] = useState<HTMLElement | null>(null);
  const [spinOn, setSpinOn] = useState(false);
  const [zoomOn, setZoomOn] = useState(false);
  const [fallback, setFallback] = useState(false);
  const ctl = useRef<Ctl | null>(null);
  const hover = useRef(false);
  const filterRef = useRef<HeroCat>("alle");

  useEffect(() => { setUiHost(document.querySelector<HTMLElement>(".hero-ui")); }, []);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFallback(true);
      return;
    }
    const PR = Math.min(Math.max(window.devicePixelRatio, 1), 1.5);
    renderer.setPixelRatio(PR);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.72;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const cv = renderer.domElement;
    cv.style.cssText = "display:block;width:100%;height:100%;";
    el.appendChild(cv);

    const scene = new THREE.Scene();
    const env = makeStudioEnv(renderer);
    const envB = makeStudioEnv(renderer, true); // hellere Umgebung für Chrome (Rosé-Gold-Spiegel)
    scene.environment = env.texture;
    scene.environmentIntensity = 0.5;
    const key = new THREE.DirectionalLight(0xffe0b5, 0.5); key.position.set(2.5, 3, 4);
    const rim = new THREE.DirectionalLight(0xffb9a4, 0.45); rim.position.set(-3, 2, -3);
    const fill = new THREE.DirectionalLight(0xfff1e6, 0.35); fill.position.set(-2, -2.5, 3);
    scene.add(key, rim, fill);
    const camera = new THREE.PerspectiveCamera(28, 0.9, 0.1, 50);
    camera.position.set(0, 0, 6.3);

    const mats = makeHeroMaterials();
    heroDesigns.forEach((d) => { if (d.bright) mats[d.kind].forEach((m) => { m.envMap = envB.texture; m.envMapIntensity = 0.7; }); });
    // Sếp 12.11: weniger Glanz, weniger Lichtpunkte -> rauere Oberflaeche, schwaecheres Streiflicht
    Object.values(mats).flat().forEach((m) => {
      const p = m as THREE.MeshPhysicalMaterial;
      p.roughness = Math.max(p.roughness ?? 0, 0.3);
      if ("clearcoatRoughness" in p) p.clearcoatRoughness = Math.max(p.clearcoatRoughness ?? 0, 0.28);
      if ("clearcoat" in p) p.clearcoat = Math.min(p.clearcoat ?? 0, 0.55);
      if (p.envMapIntensity !== undefined) p.envMapIntensity = Math.min(p.envMapIntensity, 0.6);
    });
    const geo = buildNailGeometry();
    // Nagelformen: Mandel (Standard), eckig (square), spitz (stiletto) - gleiche Mitte wie die Mandelform
    geo.computeBoundingBox();
    const c0 = geo.boundingBox!.getCenter(new THREE.Vector3());
    const shapeGeo = (pp: Partial<typeof defaultNail>, k: number) => {
      const g2 = buildNailGeometry({ ...defaultNail, ...pp });
      g2.scale(k, k, k); g2.computeBoundingBox();
      const c = g2.boundingBox!.getCenter(new THREE.Vector3());
      g2.translate(c0.x - c.x, c0.y - c.y, c0.z - c.z);
      return g2;
    };
    const geos: Record<string, THREE.BufferGeometry> = {
      almond: geo,
      almondLong: shapeGeo({ length: 2.5, halfWidth: 0.46, p: 1.55, t0: 0.32, arcTip: 0.55 }, 0.9),
      square: shapeGeo({ length: 1.8, halfWidth: 0.5, p: 14, t0: 0.9, end: 0.78, arc: 0.72, arcTip: 0.5, bend: 0.06, thick: 0.034, thin: 0.62 }, 1),
      stiletto: shapeGeo({ length: 2.8, halfWidth: 0.42, p: 1.2, t0: 0.22, arcTip: 0.5 }, 0.8),
    };
    const geoOf = (d: { shape?: string }) => geos[d.shape ?? "almond"];
    const meshes = heroDesigns.map((d) => { const m = new THREE.Mesh(geoOf(d), mats[d.kind]); m.visible = false; scene.add(m); return m; });
    // echte 3D-Applikationen (Strass, Blüten, Perlen) als Kinder des Nagels
    const decors = heroDesigns.map((d, i) => { const dg = buildDecor(d.kind, geoOf(d), envB.texture); if (dg) meshes[i].add(dg); return dg; });
    const st: S[] = heroDesigns.map(() => ({ q: HOME.clone(), axis: new THREE.Vector3(0, 1, 0), speed: 0, touched: false }));
    const stretch = (m: THREE.Object3D, z = 1) => m.scale.setScalar(z * 0.8);

    // Goldstaub
    const dot = document.createElement("canvas"); dot.width = dot.height = 32;
    { const g = dot.getContext("2d")!; const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, "rgba(255,236,190,1)"); gr.addColorStop(0.6, "rgba(246,208,120,0.9)"); gr.addColorStop(1, "rgba(246,208,120,0)"); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); }
    const dotTex = new THREE.CanvasTexture(dot);
    const pPos = new Float32Array(NP * 3), pVel = new Float32Array(NP * 3), pTarget = new Float32Array(NP * 3);
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ map: dotTex, size: 0.06, sizeAttenuation: true, transparent: true, depthWrite: false, opacity: 0 });
    const points = new THREE.Points(pGeo, pMat);
    points.visible = false; points.frustumCulled = false;
    scene.add(points);
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    // Vorschaubilder aus den 3D-Modellen rendern (einmalig): Nagel von vorn, leicht geneigt wie in der Vorlage, gedämpftes Licht = echte Farben
    const tw = 220, th = 290;
    renderer.setPixelRatio(1);
    renderer.setSize(tw, th, false);
    renderer.toneMappingExposure = 0.62;
    scene.environmentIntensity = 0.55;
    key.intensity = 0.7;
    camera.aspect = tw / th; camera.updateProjectionMatrix();
    dissolve.value = 0;
    const THUMB_Q = HOME.clone(); // gleiche Pose wie der große Nagel (Spitze unten-links, ~45°)
        const shots: string[] = [];
    heroDesigns.forEach((d, i) => {
      meshes.forEach((m) => { m.visible = false; });
      const m = meshes[i];
      const g0 = m.geometry; m.geometry = geoOf(d);
      m.quaternion.copy(THUMB_Q); m.position.set(0, 0, 0); m.scale.set(1, 1, 1); m.visible = true; m.updateMatrixWorld(true);
      if (d.cat) updateCatUniforms(m, camera, key.position);
      renderer.clear(); renderer.render(scene, camera);
      m.geometry = g0;
      // Alle Vorschaubilder gleich groß/gleich ausgerichtet: Nagel per Alpha-Rahmen auf feste Höhe skalieren und zentrieren
      const src = document.createElement("canvas"); src.width = tw; src.height = th;
      const sg = src.getContext("2d", { willReadFrequently: true })!;
      sg.drawImage(cv, 0, 0, tw, th);
      const px = sg.getImageData(0, 0, tw, th).data;
      let x0 = tw, x1 = 0, y0 = th, y1 = 0;
      for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) if (px[(y * tw + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const out = document.createElement("canvas"); out.width = tw; out.height = th;
      const og = out.getContext("2d")!;
      if (x1 > x0 && y1 > y0) {
        const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
        const k = Math.min((th * 0.84) / bh, (tw * 0.72) / bw);
        og.imageSmoothingQuality = "high"; og.filter = "saturate(1.25) contrast(1.1) brightness(0.95)";
        og.drawImage(src, x0, y0, bw, bh, (tw - bw * k) / 2, (th - bh * k) / 2, bw * k, bh * k);
      }
      shots.push(out.toDataURL("image/png"));
    });
    meshes.forEach((m) => { m.visible = false; });
    renderer.setPixelRatio(PR);
    renderer.toneMappingExposure = 0.72;
    scene.environmentIntensity = 0.6;
    key.intensity = 0.5;
    setThumbs(shots);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let shown = 0, pending = 0;
    let phase: "idle" | "out" | "gap" | "in" = "idle", pt = 0;
    let lastSwitch = performance.now(), lastTouch = -1e9, touchedEver = false, dragging = false;
    let zoom = 1, zoomT = 1, pinch0 = 0, zoom0 = 1, spinning = false;
    const ZMAX = () => (isMob() ? ZMAX_MOB : ZMAX_DESK);
    // Beim Zoomen (Handy): Seite sperren, damit das Banner nicht nach unten wegrutscht
    let locked = false;
    // Vuetschen ausserhalb des Nagels (nach unten/oben) = Rueckkehr: Zoom zurueck, Werkzeuge wieder sichtbar, Seite scrollt wieder
    let t0: { y: number; inside: boolean } | null = null;
    const lockStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) { t0 = null; return; }
      t0 = { y: e.touches[0].clientY, inside: el.contains(e.target as Node) };
    };
    const lockMove = (e: TouchEvent) => {
      e.preventDefault();
      if (t0 && !t0.inside && e.touches.length === 1 && Math.abs(e.touches[0].clientY - t0.y) > 36) {
        t0 = null; zoomT = 1; setLock(false); setZoomOn(false);
      }
    };
    const setLock = (on: boolean) => {
      if (on === locked) return;
      locked = on;
      document.documentElement.classList.toggle("n3d-zoomlock", on);
      if (on) { window.addEventListener("touchstart", lockStart, { passive: true }); window.addEventListener("touchmove", lockMove, { passive: false }); }
      else { window.removeEventListener("touchstart", lockStart); window.removeEventListener("touchmove", lockMove); }
    };
    const ptrs = new Map<number, { x: number; y: number }>();
    let px = 0, py = 0, sx = 0, sy = 0, st0 = 0, moved = 0;

    const order = () => heroDesigns.map((_, i) => i).filter((i) => inCat(i, filterRef.current));
    const go = (to: number, user = false) => {
      const n = ((to % N) + N) % N;
      pending = n; lastSwitch = performance.now();
      if (user) { lastTouch = performance.now(); touchedEver = true; }
      if (reduced && n !== shown) {
        cv.style.transition = "opacity .25s"; cv.style.opacity = "0";
        window.setTimeout(() => { shown = n; st[n].q.copy(HOME); st[n].speed = 0; st[n].touched = false; setActive(n); cv.style.opacity = "1"; }, 260);
      }
    };
    ctl.current = {
      go,
      reset: () => { const s = st[shown]; s.q.copy(HOME); s.speed = 0; s.touched = false; zoomT = 1; spinning = false; setSpinOn(false); setZoomOn(false); },
      spin: () => { spinning = !spinning; if (spinning) { st[shown].touched = true; touchedEver = true; lastTouch = performance.now(); } return spinning; },
      zoom: () => { zoomT = zoomT > 1.05 ? 1 : ZMAX(); lastTouch = performance.now(); touchedEver = true; return zoomT > 1.05; },
    };

    const spawnBurst = () => {
      for (let i = 0; i < NP; i++) {
        pPos[i * 3] = rnd(-0.45, 0.45); pPos[i * 3 + 1] = rnd(-0.9, 0.9); pPos[i * 3 + 2] = rnd(-0.25, 0.25);
        pVel[i * 3] = rnd(-0.25, 0.25); pVel[i * 3 + 1] = rnd(0.4, 1.3); pVel[i * 3 + 2] = rnd(-0.2, 0.2);
      }
    };
    const spawnConverge = () => {
      for (let i = 0; i < NP; i++) {
        const a = rnd(0, Math.PI * 2), r = rnd(0.7, 1.3);
        pPos[i * 3] = Math.cos(a) * r; pPos[i * 3 + 1] = -1.25 + rnd(-0.05, 0.05); pPos[i * 3 + 2] = Math.sin(a) * r * 0.5;
        pTarget[i * 3] = rnd(-0.15, 0.15); pTarget[i * 3 + 1] = rnd(-0.7, 0.8); pTarget[i * 3 + 2] = rnd(-0.1, 0.1);
      }
    };

    const pdist = () => { const a = [...ptrs.values()]; return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1; };
    // 2 Finger: gleichzeitig zoomen (Abstand), drehen (Mittelpunkt wandert) und rollen (Finger verdrehen)
    let mid0 = { x: 0, y: 0 }, ang0 = 0;
    const pmid = () => { const a = [...ptrs.values()]; return { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 }; };
    const pang = () => { const a = [...ptrs.values()]; return Math.atan2(a[1].y - a[0].y, a[1].x - a[0].x); };
    const down = (e: PointerEvent) => {
      try { el.setPointerCapture(e.pointerId); } catch {}
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size >= 2) { dragging = false; touchedEver = true; lastTouch = performance.now(); pinch0 = pdist(); zoom0 = zoomT; moved = 999; mid0 = pmid(); ang0 = pang(); const s2 = st[shown]; s2.speed = 0; s2.touched = true; return; }
      dragging = true; touchedEver = true; lastTouch = performance.now();
      px = sx = e.clientX; py = sy = e.clientY; st0 = performance.now(); moved = 0;
      const s = st[shown]; s.speed = 0; s.touched = true;
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size >= 2) {
        zoomT = Math.min(ZMAX(), Math.max(1, zoom0 * pdist() / pinch0));
        const m = pmid(), a = pang(), s2 = st[shown];
        const dx2 = m.x - mid0.x, dy2 = m.y - mid0.y;
        let da = a - ang0; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
        mid0 = m; ang0 = a;
        const l2 = Math.hypot(dx2, dy2);
        if (l2 > 0.01) s2.q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(dy2, dx2, 0).normalize(), l2 * 0.012)).normalize();
        if (Math.abs(da) > 0.0005) s2.q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -da)).normalize();
        s2.speed = 0; s2.touched = true;
        lastTouch = performance.now(); return;
      }
      if (!dragging) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy));
      const len = Math.hypot(dx, dy);
      if (len < 0.01) return;
      const s = st[shown];
      const axis = new THREE.Vector3(dy, dx, 0).normalize();
      const ang = len * 0.012;
      s.q.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, ang)).normalize();
      s.axis.copy(axis); s.speed = ang;
      lastTouch = performance.now();
    };
    const wheel = (e: WheelEvent) => {
      const next = Math.min(ZMAX(), Math.max(1, zoomT - e.deltaY * (e.ctrlKey ? 0.008 : 0.0015)));
      if (next === zoomT && !e.ctrlKey) return; // am Anschlag: Seite scrollt normal weiter
      e.preventDefault(); zoomT = next; lastTouch = performance.now(); touchedEver = true; setZoomOn(next > 1.05);
    };
    const up = (e: PointerEvent) => {
      const was = ptrs.size; ptrs.delete(e.pointerId);
      if (was >= 2) { try { el.releasePointerCapture(e.pointerId); } catch {} return; }
      if (!dragging) return;
      dragging = false; lastTouch = performance.now(); el.style.cursor = "grab";
      try { el.releasePointerCapture(e.pointerId); } catch {}
      const slug = heroDesigns[shown].slug;
      if (slug && moved < 6 && performance.now() - st0 < 500) router.push(`/nail-designs/${slug}`);
    };
    const enter = () => { hover.current = true; };
    const leave = () => { hover.current = false; };
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    let visible = true, raf = 0, last = performance.now();
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });
    io.observe(el);
    const qs = new THREE.Quaternion(), yAxis = new THREE.Vector3(0, 1, 0), vAxis = new THREE.Vector3(0, 1, 0);

    function loop(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;

      // Auto-Wechsel innerhalb der gewählten Kategorie
      if (!reduced && phase === "idle" && !hover.current && !dragging && !spinning && now - lastSwitch > AUTO_MS && now - lastTouch > (touchedEver ? RESUME_MS : 0)) {
        const ord = order(); const pos = ord.indexOf(shown);
        go(ord[(pos + 1) % ord.length] ?? 0);
      }
      if (!reduced && phase === "idle" && pending !== shown) { phase = "out"; pt = 0; spawnBurst(); points.visible = true; }

      pt += dt;
      let dis = 0, nailVisible = true;
      if (phase === "out") {
        const k = Math.min(1, pt / T_OUT); dis = ease(k);
        if (k >= 1) { phase = "gap"; pt = 0; nailVisible = false; spawnConverge(); }
      } else if (phase === "gap") {
        nailVisible = false;
        if (pt >= T_GAP) {
          phase = "in"; pt = 0; shown = pending;
          st[shown].q.copy(HOME); st[shown].speed = 0; st[shown].touched = spinning;
          setActive(shown); dis = 1; nailVisible = true;
        }
      } else if (phase === "in") {
        const k = Math.min(1, pt / T_IN); dis = 1 - ease(k);
        if (k >= 1) { phase = "idle"; dis = 0; points.visible = false; pMat.opacity = 0; }
      }
      dissolve.value = dis;
      // Applikationen (Strass/Blueten) loesen sich mit dem Nagel auf, schweben nie allein
      const df = Math.max(0, 1 - dis * 2.4);
      decors.forEach((d) => { if (d) { d.scale.setScalar(Math.max(df, 0.0001)); d.visible = df > 0.02; } });

      if (points.visible) {
        const arr = pGeo.getAttribute("position") as THREE.BufferAttribute;
        if (phase === "out") {
          for (let i = 0; i < NP * 3; i++) pPos[i] += pVel[i] * dt;
          pMat.opacity = Math.min(1, pt / 0.08) * (1 - Math.max(0, (pt / T_OUT - 0.55) / 0.45));
        } else if (phase === "gap" || phase === "in") {
          const total = T_GAP + T_IN, tt = (phase === "gap" ? pt : T_GAP + pt) / total, e = ease(Math.min(1, tt * 1.15));
          for (let i = 0; i < NP; i++) for (let c = 0; c < 3; c++) pPos[i * 3 + c] += (pTarget[i * 3 + c] - pPos[i * 3 + c]) * Math.min(1, dt * (3 + 6 * e));
          pMat.opacity = Math.min(1, tt * 4) * (1 - Math.max(0, (tt - 0.6) / 0.4));
        }
        arr.needsUpdate = true;
      }

      zoom += (zoomT - zoom) * Math.min(1, dt * 10);
      if (isMob()) { setLock(zoomT > 1.05); setZoomOn(zoomT > 1.05); }
      renderer.clear();
      meshes.forEach((m, i) => {
        if (i !== shown || !nailVisible) { m.visible = false; return; }
        const s = st[i];
        if (spinning && !dragging) { s.q.premultiply(new THREE.Quaternion().setFromAxisAngle(vAxis, dt * 0.9)).normalize(); s.speed = 0; }
        else if (!(dragging && i === shown) && s.speed > 0.0004) {
          const f = dt * 60;
          s.q.premultiply(new THREE.Quaternion().setFromAxisAngle(s.axis, s.speed * f)).normalize();
          s.speed *= Math.pow(0.9, f);
        } else if (!dragging) s.speed = 0;
        if (!s.touched && !reduced) { qs.setFromAxisAngle(yAxis, Math.sin(now / 1000 * 0.55) * 0.4); m.quaternion.copy(s.q).multiply(qs); }
        else m.quaternion.copy(s.q);
        m.position.y = reduced ? 0 : Math.sin(now / 1000 * 1.2) * 0.05;
        stretch(m, zoom);
        if (heroDesigns[i].cat) updateCatUniforms(m, camera, key.position);
        m.visible = true;
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); setLock(false);
      el.removeEventListener("wheel", wheel); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
      el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave);
      decors.forEach((x) => x && disposeDecor(x)); Object.values(geos).forEach((x) => x.dispose()); pGeo.dispose(); pMat.dispose(); dotTex.dispose();
      Object.values(mats).flat().forEach((m) => { m.map?.dispose(); m.dispose(); });
      env.dispose(); envB.dispose(); renderer.dispose();
      if (cv.parentNode === el) el.removeChild(cv);
      ctl.current = null;
    };
  }, [router]);

  // aktive Vorschau in den sichtbaren Bereich der Leiste holen (nur horizontal, ohne die Seite zu scrollen)
  useEffect(() => {
    const s = strip.current;
    const b = s?.querySelector<HTMLElement>('[aria-current="true"]');
    if (s && b) s.scrollTo({ left: Math.max(0, b.offsetLeft - (s.clientWidth - b.clientWidth) / 2), behavior: "smooth" });
  }, [active, filter, thumbs.length]);

  const list = heroDesigns.map((_, i) => i).filter((i) => inCat(i, filter));
  const pick = (f: HeroCat) => {
    setFilter(f); filterRef.current = f;
    if (!inCat(active, f)) ctl.current?.go(heroDesigns.findIndex((_, i) => inCat(i, f)), true);
  };
  const cur = heroDesigns[active];
  const hov = { onMouseEnter: () => { hover.current = true; }, onMouseLeave: () => { hover.current = false; } };

  const ui = (
    <div className="hui" {...hov}>
      <nav className="hm-menu" aria-label="Design-Kategorien">
        {HERO_CATS.map((c) => {
          const Ic = ICONS[c.id];
          return (
            <button key={c.id} type="button" className={`hm-item${filter === c.id ? " on" : ""}`} aria-pressed={filter === c.id} onClick={() => pick(c.id)}>
              <Ic size={22} strokeWidth={1.5} aria-hidden /><span>{c.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="hm-soc" role="group" aria-label="Soziale Netzwerke">
        {site.whatsapp && <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>}
        <a href={site.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><TikTokIcon /></a>
        {site.instagram && <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>}
      </div>
      <div className="hm-tools" role="group" aria-label="Ansicht">
        <button type="button" className="hm-tool" aria-pressed={spinOn} aria-label="360°-Drehung ein/aus" title="360°" onClick={() => setSpinOn(ctl.current?.spin() ?? false)}>
          <span className="t360">360°</span>
        </button>
        <button type="button" className="hm-tool" aria-pressed={zoomOn} aria-label="Zoom ein/aus" title="Zoom" onClick={() => setZoomOn(ctl.current?.zoom() ?? false)}>
          <ZoomIn size={26} strokeWidth={1.5} aria-hidden />
        </button>
        <button type="button" className="hm-tool" aria-label="Ansicht zurücksetzen" title="Zurücksetzen" onClick={() => ctl.current?.reset()}>
          <RotateCcw size={26} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <div className="hg-title"><i aria-hidden /><h2>Design Galerie</h2><i aria-hidden /></div>
      <div className="hg-row">
        <button type="button" className="hg-arrow" aria-label="Zurück" onClick={() => strip.current?.scrollBy({ left: -(strip.current.clientWidth * 0.85), behavior: "smooth" })}><ChevronLeft size={22} /></button>
        <div className="hg-strip" ref={strip} role="listbox" aria-label="Design Galerie">
          {list.map((i) => (
            <button key={heroDesigns[i].id} type="button" role="option" aria-selected={i === active} aria-current={i === active} aria-label={heroDesigns[i].name} title={heroDesigns[i].name} className={`hg-thumb${i === active ? " on" : ""}`} onClick={() => ctl.current?.go(i, true)}>
              {thumbs[i] && /* eslint-disable-next-line @next/next/no-img-element */ <img src={thumbs[i]} alt="" width={150} height={200} />}
            </button>
          ))}
        </div>
        <button type="button" className="hg-arrow" aria-label="Weiter" onClick={() => strip.current?.scrollBy({ left: strip.current.clientWidth * 0.85, behavior: "smooth" })}><ChevronRight size={22} /></button>
      </div>
    </div>
  );

  return (
    <>
      <div key={active} className="n3d-glow" aria-hidden="true" />
      <svg className="n3d-orbit n3d-orbit-back" viewBox="0 0 320 170" aria-hidden="true">
        <defs>
          <linearGradient id="orb" x1="0" x2="1"><stop offset="0" stopColor="#f6d58a" stopOpacity="0.15" /><stop offset="0.5" stopColor="#ffe3a0" stopOpacity="1" /><stop offset="1" stopColor="#f6d58a" stopOpacity="0.2" /></linearGradient>
          <filter id="orbBlur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
          <clipPath id="orbUp"><rect x="-20" y="-20" width="360" height="105" /></clipPath>
        </defs>
        <g clipPath="url(#orbUp)">
          <ellipse cx="160" cy="85" rx="156" ry="66" transform="rotate(-8 160 85)" fill="none" stroke="#f0b858" strokeWidth="5" opacity="0.5" filter="url(#orbBlur)" />
          <ellipse cx="160" cy="85" rx="156" ry="66" transform="rotate(-8 160 85)" fill="none" stroke="url(#orb)" strokeWidth="2" />
        </g>
        <g className="orb-spark" fill="#ffe9b0">
          <circle cx="38" cy="50" r="1.6" /><circle cx="70" cy="30" r="1.1" /><circle cx="258" cy="28" r="1.4" /><circle cx="292" cy="58" r="1.8" /><circle cx="22" cy="92" r="1.2" /><circle cx="300" cy="104" r="1.2" />
        </g>
      </svg>
      <svg className="n3d-orbit n3d-orbit-front" viewBox="0 0 320 170" aria-hidden="true">
        <defs>
          <clipPath id="orbDown"><rect x="-20" y="85" width="360" height="100" /></clipPath>
        </defs>
        <g clipPath="url(#orbDown)">
          <ellipse cx="160" cy="85" rx="156" ry="66" transform="rotate(-8 160 85)" fill="none" stroke="#f0b858" strokeWidth="5" opacity="0.5" filter="url(#orbBlur)" />
          <ellipse cx="160" cy="85" rx="156" ry="66" transform="rotate(-8 160 85)" fill="none" stroke="url(#orb)" strokeWidth="2" />
        </g>
      </svg>
      <div className="n3d-canvas" ref={host} role="img" aria-label={`3D-Nagel ${cur.name} – ziehen zum Drehen, Mausrad zum Zoomen`}>
        {fallback && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/img/nail-6-still.png" alt="Nagel-Design" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        )}
      </div>
      <span className="sr-only" aria-live="polite">{cur.name}</span>
      {uiHost ? createPortal(ui, uiHost) : null}
    </>
  );
}
