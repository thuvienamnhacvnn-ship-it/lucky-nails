import * as THREE from "three";
import { defaultNail } from "./nailGeometry";

// Echte 3D-Applikationen auf dem Nagel: Strasssteine (facettiert, AB-Schimmer), Blüten aus Blütenblatt-Körpern,
// Goldperlen. Position per (u quer 0..1, t Länge 0..1 = Spitze) auf der Außenfläche des Nagelmodells.

type Surf = (u: number, t: number) => { p: THREE.Vector3; n: THREE.Vector3 };

export function makeSurface(geo: THREE.BufferGeometry): Surf {
  const pos = geo.attributes.position, nor = geo.attributes.normal, uv = geo.attributes.uv;
  const ns = defaultNail.ns, nu = defaultNail.nb + defaultNail.nt, W = ns + 1;
  const rowT = (i: number) => uv.getY(i * W);
  return (u, t) => {
    const jf = Math.min(1, Math.max(0, u)) * ns;
    const j0 = Math.min(ns - 1, Math.floor(jf)), fj = jf - j0;
    let lo = 0, hi = nu;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (rowT(m) <= t) lo = m; else hi = m; }
    const t0 = rowT(lo), t1 = rowT(lo + 1);
    const fi = Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1)));
    const at = (arr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, i: number, j: number) => new THREE.Vector3().fromBufferAttribute(arr, i * W + j);
    const mix = (arr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) => {
      const a = at(arr, lo, j0).lerp(at(arr, lo, j0 + 1), fj);
      const b = at(arr, lo + 1, j0).lerp(at(arr, lo + 1, j0 + 1), fj);
      return a.lerp(b, fi);
    };
    return { p: mix(pos), n: mix(nor).normalize() };
  };
}

const Z = new THREE.Vector3(0, 0, 1);
const place = (o: THREE.Object3D, s: { p: THREE.Vector3; n: THREE.Vector3 }, lift: number, spin = 0) => {
  o.position.copy(s.p).addScaledVector(s.n, lift);
  o.quaternion.setFromUnitVectors(Z, s.n);
  if (spin) o.rotateZ(spin);
};

const AB = ["#ffffff", "#cfe6ff", "#ffd3ec", "#d4ffd9", "#fff0bd", "#e0d0ff"];
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function gemGeometry(): THREE.BufferGeometry {
  // Rhinestone: flache Rückseite, Gürtel, 8-Facetten-Krone mit Tafel
  const pts = [[0, 0], [0.98, 0], [1.04, 0.1], [1.0, 0.2], [0.78, 0.4], [0.5, 0.62], [0.4, 0.7], [0, 0.7]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, 8);
  g.rotateX(Math.PI / 2);
  return g;
}

// Blütenblatt als Gel-Körper: a = Länge 0..1, b = quer -1..1. Dicker, bombierter Rand, Mittelrille, Spitze rollt auf.
function petalPoints(L: number, W: number, thick: number, pointed: boolean, groove: number, curl: number, tilt: number, lift: number) {
  const NA = 16, NB = 12, pts: number[] = [];
  for (let i = 0; i <= NA; i++) {
    const a = i / NA;
    const base = Math.sin(Math.PI * Math.min(1, 0.04 + a * 0.96));
    const w = W * (pointed ? Math.pow(base, 0.95) * (1.08 - 0.25 * a) : Math.pow(base, 0.5));
    for (let j = 0; j <= NB; j++) {
      const b = (j / NB) * 2 - 1;
      let h = thick * Math.pow(Math.max(0, 1 - b * b), 0.55) * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, a * 1.15)));
      if (groove) h -= groove * thick * (Math.exp(-Math.pow(b / 0.13, 2)) + 0.4 * Math.exp(-Math.pow((Math.abs(b) - 0.5) / 0.1, 2))) * Math.sin(Math.PI * Math.min(1, a * 0.95 + 0.05));
      const x = b * w, y = a * L, z = -0.012 + Math.max(0, h) + curl * L * Math.pow(a, 2.4);
      const c = Math.cos(tilt), sn = Math.sin(tilt);
      pts.push(x, y * c - z * sn, y * sn + z * c + lift);
    }
  }
  return { pts, NA, NB };
}

export function buildDecor(kind: string, geo: THREE.BufferGeometry, env: THREE.Texture | null): THREE.Group | null {
  const spec = DECOR[kind];
  if (!spec) return null;
  const surf = makeSurface(geo);
  const grp = new THREE.Group();
  const gemMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 1, roughness: 0.02, flatShading: true, iridescence: 1, iridescenceIOR: 2.2,
    iridescenceThicknessRange: [180, 750], envMap: env, envMapIntensity: 2.8,
  });
  const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xe7b94c, metalness: 1, roughness: 0.18, envMap: env, envMapIntensity: 1.6, clearcoat: 0.6 });
  // Acryl-/Gel-Weiß: leicht mattes Gel mit Glanzlack
  const pearl = new THREE.MeshPhysicalMaterial({
    color: 0xfffbf7, roughness: 0.4, clearcoat: 0.85, clearcoatRoughness: 0.22, sheen: 0.8, sheenColor: new THREE.Color(0xefe6ff), sheenRoughness: 0.5,
    envMap: env, envMapIntensity: 0.85, side: THREE.DoubleSide,
  });

  // Steine (+ kleine Füllsteine in den Lücken)
  if (spec.gems && spec.gems.length) {
    const list: [number, number, number, number][] = [];
    spec.gems.forEach(([u, t, r, lf], i) => list.push([u, t, r * (0.95 + 0.17 * hash(i)), lf ?? 0]));
    if (spec.fill) for (let i = 0; i < spec.gems.length - 1; i += 2) {
      const A = spec.gems[i], B = spec.gems[i + 1];
      list.push([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, Math.min(A[2], B[2]) * 0.42, 0.004]);
    }
    const gg = gemGeometry();
    const im = new THREE.InstancedMesh(gg, gemMat, list.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
    list.forEach(([u, t, r, up], i) => {
      const s = surf(u, t);
      const o = new THREE.Object3D();
      place(o, s, -0.002 + up, hash(i + 9) * 6.28);
      q.copy(o.quaternion);
      sc.set(r, r, r * 1.05);
      m4.compose(o.position, q, sc);
      im.setMatrixAt(i, m4);
      im.setColorAt(i, new THREE.Color(AB[Math.floor(hash(i + 3) * AB.length)]));
    });
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.frustumCulled = false;
    grp.add(im);
  }

  // Goldperlen
  (spec.pearls ?? []).forEach(([u, t, r]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), goldMat);
    const o = surf(u, t);
    m.position.copy(o.p).addScaledVector(o.n, r * 0.55);
    grp.add(m);
  });

  // Blüten: Vertices werden auf die Nagelkrümmung projiziert -> sitzen bündig, schweben nicht am Rand
  (spec.flowers ?? []).forEach((f) => {
    const c0 = surf(f.u, f.t);
    const du = 0.02, dt = 0.02;
    const su = c0.p.distanceTo(surf(f.u + du, f.t).p) / du, st = c0.p.distanceTo(surf(f.u, f.t + dt).p) / dt;
    const rot = f.rot ?? 0, cr = Math.cos(rot), sr = Math.sin(rot);
    const conform = (x: number, y: number, z: number) => {
      const xr = x * cr - y * sr, yr = x * sr + y * cr;
      const s = surf(f.u + xr / su, f.t + yr / st);
      return s.p.addScaledVector(s.n, z + 0.003);
    };
    const pos: number[] = [], idx: number[] = [];
    const addPetal = (L: number, W: number, thick: number, groove: number, curl: number, tilt: number, lift: number, ang: number) => {
      const { pts, NA, NB } = petalPoints(L, W, thick, !!f.pointed, groove, curl, tilt, lift);
      const base = pos.length / 3, ca = Math.cos(ang), sa = Math.sin(ang);
      for (let k = 0; k < pts.length; k += 3) {
        const x = pts[k] * ca - pts[k + 1] * sa, y = pts[k] * sa + pts[k + 1] * ca;
        const v = conform(x, y, pts[k + 2]);
        pos.push(v.x, v.y, v.z);
      }
      for (let i = 0; i < NA; i++) for (let j = 0; j < NB; j++) {
        const a = base + i * (NB + 1) + j, b = a + 1, c = a + NB + 1, d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    };
    const S = f.size, n = f.petals;
    const g = f.pointed ? 0.5 : 0;
    // 3 Lagen: außen flach + groß, Mitte höher, innen steil/klein
    for (let k = 0; k < n; k++) addPetal(S * 0.5, S * 0.5 * f.wide, S * 0.2, g * 0.5, 0.05, 0.1, 0, (k * Math.PI * 2) / n);
    for (let k = 0; k < n; k++) addPetal(S * 0.38, S * 0.38 * f.wide, S * 0.22, g * 0.6, 0.12, 0.38, 0.015, ((k + 0.5) * Math.PI * 2) / n);
    for (let k = 0; k < n; k++) addPetal(S * 0.22, S * 0.22 * f.wide, S * 0.22, g * 0.5, 0.25, 0.75, 0.035, ((k + 0.25) * Math.PI * 2) / n);
    const fg = new THREE.BufferGeometry();
    fg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    fg.setIndex(idx);
    fg.computeVertexNormals();
    const mesh = new THREE.Mesh(fg, pearl);
    mesh.frustumCulled = false;
    grp.add(mesh);

    const bead = S * 0.06, cz = S * 0.27;
    const c = f.center ?? "gold3";
    const addBead = (x: number, y: number, rr: number, mat: THREE.Material = goldMat) => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(rr, 20, 14), mat);
      b.position.copy(conform(x, y, cz + rr * 0.3));
      grp.add(b);
    };
    if (c === "gold5") { addBead(0, 0, bead); [0, 1, 2, 3, 4].forEach((k) => addBead(Math.cos((k * 2 * Math.PI) / 5) * bead * 1.9, Math.sin((k * 2 * Math.PI) / 5) * bead * 1.9, bead * 0.9)); }
    else if (c === "gold3") [[-0.55, -0.3], [0.55, -0.3], [0, 0.6]].forEach(([x, y]) => addBead(x * bead * 1.5, y * bead * 1.5, bead));
    else if (c === "pearl" || c === "gold") addBead(0, 0, bead * 1.2, c === "pearl" ? pearl : goldMat);
  });
  return grp;
}

export function disposeDecor(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((x) => x.dispose());
  });
}

type Flower = { u: number; t: number; size: number; petals: number; wide: number; center?: "gold3" | "gold5" | "pearl" | "gold" | "gems" | "none"; rot?: number; pointed?: boolean };
type Spec = { fill?: boolean; gems?: [number, number, number, number?][]; pearls?: [number, number, number][]; flowers?: Flower[] };

const row = (n: number, f: (k: number) => [number, number], r: number): [number, number, number][] =>
  Array.from({ length: n }, (_, k) => { const [u, t] = f(k); return [u, t, r] as [number, number, number]; });
// Smile-Linie: Mitte tiefer (Richtung Nagelbett), Seiten höher
const smileY = (u: number, base: number, amp: number) => base + amp * (2 * u - 1) ** 2;
const smileRow = (n: number, base: number, amp: number, r: number) =>
  row(n, (k) => { const u = 0.04 + (0.92 * k) / (n - 1); return [u, smileY(u, base, amp)]; }, r);
const ring = (n: number, cu: number, ct: number, ru: number, rt: number, r: number) =>
  row(n, (k) => { const a = (k / n) * Math.PI * 2; return [cu + Math.cos(a) * ru, ct + Math.sin(a) * rt]; }, r);

const DECOR: Record<string, Spec> = {
  // Poinsettia: grosse spitze weisse Blütenblätter + Goldperlen-Cluster (Foto: Mitte des Nagels, fast Nagelbreite)
  xmas3: { flowers: [{ u: 0.5, t: 0.5, size: 1.0, petals: 6, wide: 0.42, pointed: true, center: "gold5" }] },
  // 1 Steine am Nagelbett-Bogen (Cuticle)
  strass1: { fill: true, gems: row(12, (k) => { const u = 0.07 + (0.86 * k) / 11; return [u, 0.12 - 0.09 * (2 * u - 1) ** 2]; }, 0.048) },
  // 2 Steine als U um das rosa Nagelbett, offen zur Spitze hin geschlossen durch die weisse Spitze (obere Halbellipse)
  strass2: { fill: true, gems: row(16, (k) => { const a = (k / 15) * Math.PI; return [0.5 + Math.cos(a) * 0.46, 0.4 + Math.sin(a) * 0.3]; }, 0.048) },
  // 3 Blüte (5 runde Blätter) an der Smile-Linie
  strass3: { flowers: [{ u: 0.5, t: 0.52, size: 0.72, petals: 5, wide: 0.62, center: "none" }] },
  // 4 Blüte mit Stein-Mitte
  strass4: { flowers: [{ u: 0.5, t: 0.5, size: 0.78, petals: 6, wide: 0.5, center: "gems" }], gems: [[0.5, 0.5, 0.05, 0.19], [0.45, 0.56, 0.03, 0.17], [0.55, 0.56, 0.03, 0.17], [0.45, 0.44, 0.03, 0.17], [0.55, 0.44, 0.03, 0.17]] },
  // 5 Steine entlang der Smile-Linie
  strass5: { fill: true, gems: smileRow(13, 0.58, 0.12, 0.048) },
};
