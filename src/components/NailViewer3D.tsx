"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { nails } from "@/config/nails";
import { buildNailGeometry } from "@/lib/nailGeometry";
import { makeMaterials } from "@/lib/nailMaterials";
import { makeStudioEnv } from "@/lib/studioEnv";
import { NAIL_HOME } from "@/lib/nailPose";
import { updateCatUniforms } from "@/lib/nailShaders";

// PROTOTYP: alle 6 Nägel (Schalen mit hohler Rückseite) in einem Renderer (Scissor/Viewport).
// Jeder Nagel dreht sich unabhängig per Arcball (Quaternionen). Nach dem Loslassen: leichte Trägheit, dann STILLSTAND.
const HOME = NAIL_HOME;

type S = { q: THREE.Quaternion; axis: THREE.Vector3; speed: number; dragging: boolean; from: THREE.Quaternion | null; t: number };

export default function NailViewer3D() {
  const root = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = root.current!;
    const views = Array.from(el.querySelectorAll<HTMLElement>(".nv-view"));
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1.5), 2)); // mind. 1,5x Supersampling
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setScissorTest(true);
    const cv = renderer.domElement;
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
    el.prepend(cv);

    const scene = new THREE.Scene();
    const env = makeStudioEnv(renderer);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.85;
    const key = new THREE.DirectionalLight(0xffe0b5, 1.3); key.position.set(2.5, 3, 4);
    const rim = new THREE.DirectionalLight(0xffb9a4, 0.9); rim.position.set(-3, 2, -3);
    const fill = new THREE.DirectionalLight(0xfff1e6, 0.35); fill.position.set(-2, -2.5, 3);
    scene.add(key, rim, fill);
    const camera = new THREE.PerspectiveCamera(28, 0.8, 0.1, 50);
    camera.position.set(0, 0, 4.9);

    const mats = makeMaterials();
    const geo = buildNailGeometry();
    if (new URLSearchParams(location.search).has("wire")) mats.flat().forEach((m) => { m.wireframe = true; }); // Prüfansicht: Netz
    const meshes = nails.map((_, i) => {
      const m = new THREE.Mesh(geo, mats[i]);
      m.visible = false;
      scene.add(m);
      return m;
    });
    const st: S[] = nails.map(() => ({ q: HOME.clone(), axis: new THREE.Vector3(0, 1, 0), speed: 0, dragging: false, from: null, t: 1 }));

    // Arcball-artige Drehung: Ziehbewegung in Bildschirmachsen -> Quaternion links-multipliziert (frei in alle Richtungen)
    const drag = new Map<number, { i: number; x: number; y: number }>();
    const cleanups: (() => void)[] = [];
    views.forEach((v, i) => {
      const down = (e: PointerEvent) => {
        v.setPointerCapture(e.pointerId);
        drag.set(e.pointerId, { i, x: e.clientX, y: e.clientY });
        st[i].dragging = true; st[i].speed = 0; st[i].from = null; st[i].t = 1;
        v.style.cursor = "grabbing";
      };
      const move = (e: PointerEvent) => {
        const d = drag.get(e.pointerId);
        if (!d) return;
        const dx = e.clientX - d.x, dy = e.clientY - d.y;
        d.x = e.clientX; d.y = e.clientY;
        const len = Math.hypot(dx, dy);
        if (len < 0.01) return;
        const axis = new THREE.Vector3(dy, dx, 0).normalize();
        const ang = len * 0.012;
        st[i].q.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, ang)).normalize();
        st[i].axis.copy(axis); st[i].speed = ang;
      };
      const up = (e: PointerEvent) => {
        drag.delete(e.pointerId); st[i].dragging = false; v.style.cursor = "grab";
        try { v.releasePointerCapture(e.pointerId); } catch {}
      };
      v.addEventListener("pointerdown", down); v.addEventListener("pointermove", move);
      v.addEventListener("pointerup", up); v.addEventListener("pointercancel", up);
      cleanups.push(() => { v.removeEventListener("pointerdown", down); v.removeEventListener("pointermove", move); v.removeEventListener("pointerup", up); v.removeEventListener("pointercancel", up); });
    });

    resetRef.current = () => st.forEach((s) => { s.from = s.q.clone(); s.t = 0; s.speed = 0; });

    const resize = () => { const r = el.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    let visible = true, raf = 0, last = performance.now();
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });
    io.observe(el);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function loop(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const er = el.getBoundingClientRect();
      const size = renderer.getSize(new THREE.Vector2());
      renderer.clear();
      views.forEach((v, i) => {
        const s = st[i];
        if (s.t < 1) { s.t = Math.min(1, s.t + dt / 0.45); s.q.copy(s.from!).slerp(HOME, 1 - Math.pow(1 - s.t, 3)); }
        else if (!s.dragging && s.speed > 0.0004) {
          const f = dt * 60; // zeitbasiert (unabhängig von der Framerate)
          s.q.premultiply(new THREE.Quaternion().setFromAxisAngle(s.axis, s.speed * f)).normalize();
          s.speed *= Math.pow(0.9, f); // abklingen -> vollständiger Stillstand, keine Eigenrotation
        } else if (!s.dragging) s.speed = 0;
        const r = v.getBoundingClientRect();
        const x = r.left - er.left, y = er.bottom - r.bottom, w = r.width, h = r.height;
        if (w < 2 || h < 2) return;
        renderer.setViewport(x, y, w, h);
        renderer.setScissor(x, y, w, h);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        const m = meshes[i];
        m.visible = true;
        m.quaternion.copy(s.q);
        if (i === 4) updateCatUniforms(m, camera, key.position);
        m.position.y = reduced ? 0 : Math.sin(now / 1000 * 1.1 + i * 1.3) * 0.04; // nur Schweben, Winkel bleibt
        renderer.render(scene, camera);
        m.visible = false;
      });
      void size;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cleanups.forEach((f) => f());
      geo.dispose(); mats.flat().forEach((m) => { m.map?.dispose(); m.dispose(); });
      env.dispose(); renderer.dispose();
      el.removeChild(cv);
    };
  }, []);

  return (
    <div className="nv3d">
      <div className="nv-grid" ref={root}>
        {nails.map((n) => (
          <div key={n.slug} className="nv-cell">
            <div className="nv-view" role="img" aria-label={`3D-Nagel ${n.name} – zum Drehen ziehen`} />
            <b>{n.name}</b>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button className="pill" onClick={() => resetRef.current()}>Zurücksetzen</button>
        <p className="note" style={{ marginTop: 14 }}>Jeden Nagel einzeln mit Maus oder Finger drehen – in alle Richtungen, auch von hinten · Prototyp</p>
      </div>
    </div>
  );
}
