import * as THREE from "three";

// Press-on-Nagel (Mandelform) als zweilagige Schale, vollständig analytisch (C2-glatt):
//  - Halbbreite: konstant (Fuß ~4 % schmaler), Spitze = Superellipse (p≈2,2) -> runde, symmetrische Spitze
//  - Querschnitt: Kreisbogen, Öffnungswinkel ändert sich glatt (smootherstep) entlang der Länge
//  - Längskrümmung: Polynom 2. Grades
//  - Innenfläche = Außenfläche um die Wandstärke entlang der Normalen versetzt, Rand = Halbrohr (Halbkreisprofil)
//  - EIN verschweißter Vertexsatz (Rand teilt Vertices mit Außen- und Innenfläche), Normalen per zentralen Differenzen der Funktion.
export type NailParams = {
  length: number;
  halfWidth: number;
  arc: number; // halber Öffnungswinkel am Fuß (rad)
  arcTip: number; // Öffnungswinkel an der Spitze (rad)
  bend: number; // Absenkung der Spitze
  thick: number; // Wandstärke
  t0: number; // Beginn der Spitzenrundung (Anteil der Länge)
  p: number; // Superellipsen-Exponent der Spitze
  foot: number; // Fußverengung (0.04 = 4 %)
  nb: number; // Zeilen im Körper
  nt: number; // Zeilen in der Spitze
  ns: number; // Spalten quer
  rimSteps: number;
  thin: number; // Verjuengung der Wandstaerke zur freien Kante (0 = keine, 0.6 = 40 % der Dicke an der Spitze)
};

export const defaultNail: NailParams = {
  length: 2.04, halfWidth: 0.5, arc: 1.08, arcTip: 0.62, bend: 0.12, thick: 0.032, t0: 0.45, p: 2.2, foot: 0.04,
  nb: 110, nt: 140, ns: 150, rimSteps: 12, thin: 0.62,
};

const sstep5 = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * t * (t * (t * 6 - 15) + 10); };

export function buildNailGeometry(p: NailParams = defaultNail) {
  const { nb, nt, ns } = p;
  const nu = nb + nt;

  // Zeilenparameter τ -> t (Länge 0..1) und s (Spitzenanteil). Spitze quadratisch verdichtet -> sauberer Abschluss.
  const rowT = (i: number): number => {
    if (i <= nb) return (i / nb) * p.t0;
    const k = (i - nb) / nt;
    const s = 1 - (1 - k) * (1 - k);
    return p.t0 + (1 - p.t0) * s;
  };

  const halfW = (t: number) => {
    let w = 1;
    const t1 = 0.3;
    if (t < t1) w = 1 - p.foot * Math.pow(1 - t / t1, 3);
    if (t > p.t0) {
      const s = Math.min(1, (t - p.t0) / (1 - p.t0));
      w *= Math.pow(Math.max(0, 1 - Math.pow(s, p.p)), 1 / p.p);
    }
    return p.halfWidth * w;
  };

  // P(t, σ): Punkt auf der Außenfläche, σ∈[-1,1] quer
  const P = (t: number, sg: number, out: number[]) => {
    const w = Math.max(halfW(t), 1e-9);
    const A = p.arc + (p.arcTip - p.arc) * sstep5((t - 0.4) / 0.6);
    const R = w / Math.sin(A);
    const a = sg * A;
    const x = R * Math.sin(a);
    let z = R * (Math.cos(a) - Math.cos(A));
    z -= p.bend * t * t;
    const g = t < 0.08 ? Math.pow(1 - t / 0.08, 3) : 0;
    const cuticle = -0.05 * (1 - sg * sg) * g;
    out[0] = x; out[1] = p.length * t + cuticle; out[2] = z;
  };

  const a0: number[] = [0, 0, 0], a1: number[] = [0, 0, 0], b0: number[] = [0, 0, 0], b1: number[] = [0, 0, 0];
  const V = THREE.Vector3;
  // Normale über zentrale Differenzen in den GRID-Parametern (τ-Zeile, σ), robust bis zur Spitze
  const normalAt = (i: number, j: number): THREE.Vector3 => {
    const sg = -1 + (2 * j) / ns;
    const di = 0.02, dj = 0.02;
    const iA = Math.max(0, i - di), iB = Math.min(nu, i + di);
    const jA = Math.max(-1, sg - dj * 2 / ns), jB = Math.min(1, sg + dj * 2 / ns);
    const rowTf = (f: number) => { const lo = Math.floor(f), hi = Math.min(nu, lo + 1), fr = f - lo; return rowT(lo) * (1 - fr) + rowT(hi) * fr; };
    P(rowTf(iA), sg, a0); P(rowTf(iB), sg, a1);
    P(rowTf(i), jA, b0); P(rowTf(i), jB, b1);
    const du = new V(a1[0] - a0[0], a1[1] - a0[1], a1[2] - a0[2]);
    const ds = new V(b1[0] - b0[0], b1[1] - b0[1], b1[2] - b0[2]);
    // du × ds zeigt nach +z (außen), wenn σ nach +x und t nach +y läuft: ds × du
    return ds.cross(du).normalize();
  };

  const pos: number[] = [], nor: number[] = [], uv: number[] = [], col: number[] = [];
  const idxOut = (i: number, j: number) => i * (ns + 1) + j;
  const idxIn = (i: number, j: number) => (nu + 1) * (ns + 1) + i * (ns + 1) + j;
  const tmp = [0, 0, 0];
  const normals: THREE.Vector3[] = [];

  // --- Außenfläche
  for (let i = 0; i <= nu; i++) {
    const t = rowT(i);
    for (let j = 0; j <= ns; j++) {
      const sg = -1 + (2 * j) / ns;
      P(t, sg, tmp);
      pos.push(tmp[0], tmp[1], tmp[2]);
      let n: THREE.Vector3;
      if (i === nu) {
        // Spitze: Grenzwert der Normalen = Normale der vorletzten Zeile in der Mitte
        n = normals[idxOut(nu - 1, Math.round(ns / 2))].clone();
      } else n = normalAt(i, j);
      normals.push(n);
      nor.push(n.x, n.y, n.z);
      uv.push((sg + 1) / 2, t);
      col.push(1, 1, 1);
    }
  }
  // --- Innenfläche (Versatz entlang -n), Normalen = -n, AO per Vertexfarbe
  for (let i = 0; i <= nu; i++) {
    const t = rowT(i);
    for (let j = 0; j <= ns; j++) {
      const sg = -1 + (2 * j) / ns;
      const k = idxOut(i, j);
      const th = p.thick * (0.96 + 0.08 * (1 - sg * sg)) * (1 - 0.2 * t * t) * (1 - p.thin * sstep5((t - 0.5) / 0.5)) * (0.4 + 0.6 * sstep5(t / 0.14));
      const n = normals[k];
      pos.push(pos[k * 3] - n.x * th, pos[k * 3 + 1] - n.y * th, pos[k * 3 + 2] - n.z * th);
      nor.push(-n.x, -n.y, -n.z);
      uv.push((sg + 1) / 2, t);
      const ao = (1 - 0.45 * sstep5(t * 1.1)) * (1 - 0.15 * (1 - sg * sg));
      col.push(ao, ao, ao);
    }
  }

  const g0: number[] = [], g1: number[] = [];
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < ns; j++) {
      const a = idxOut(i, j), b = idxOut(i + 1, j), c = idxOut(i + 1, j + 1), d = idxOut(i, j + 1);
      g0.push(a, d, b, d, c, b);
      const A = idxIn(i, j), B = idxIn(i + 1, j), C = idxIn(i + 1, j + 1), D = idxIn(i, j + 1);
      g1.push(A, B, D, D, B, C);
    }

  // --- Rand: geschlossene Schleife (Fuß links->rechts, rechte Seite hoch, Spitze, linke Seite runter)
  const loop: [number, number][] = [];
  for (let j = 0; j <= ns; j++) loop.push([0, j]);
  for (let i = 1; i <= nu; i++) loop.push([i, ns]);
  for (let i = nu - 1; i >= 1; i--) loop.push([i, 0]);
  const L = loop.length;
  const lp = (k: number) => { const [i, j] = loop[(k + L) % L]; const o = idxOut(i, j); return new V(pos[o * 3], pos[o * 3 + 1], pos[o * 3 + 2]); };
  const K = p.rimSteps;
  const ringBase = pos.length / 3;
  const ringIdx = (k: number, m: number) => (m === 0 ? idxOut(...loop[k]) : m === K ? idxIn(...loop[k]) : ringBase + k * (K - 1) + (m - 1));
  for (let k = 0; k < L; k++) {
    const [i, j] = loop[k];
    const o = idxOut(i, j);
    const n = normals[o];
    // Tangente entlang der Schleife (zentral über 3 Vertices für Glätte)
    const T = lp(k + 2).sub(lp(k - 2)).normalize();
    const b = new V().crossVectors(T, n).normalize();
    const O = new V(pos[o * 3], pos[o * 3 + 1], pos[o * 3 + 2]);
    const th = p.thick * (0.96 + 0.08 * (1 - (-1 + (2 * j) / ns) ** 2)) * (1 - 0.2 * rowT(i) ** 2) * (1 - p.thin * sstep5((rowT(i) - 0.5) / 0.5)) * (0.4 + 0.6 * sstep5(rowT(i) / 0.14));
    const r = th / 2;
    const C = O.clone().addScaledVector(n, -r);
    for (let m = 1; m < K; m++) {
      const phi = (m / K) * Math.PI;
      const N = n.clone().multiplyScalar(Math.cos(phi)).addScaledVector(b, Math.sin(phi)).normalize();
      const pt = C.clone().addScaledVector(N, r);
      pos.push(pt.x, pt.y, pt.z);
      nor.push(N.x, N.y, N.z);
      uv.push((-1 + (2 * j) / ns + 1) / 2, rowT(i));
      const ao = 1 - (1 - 0.8) * (m / K) * 0.5;
      col.push(ao, ao, ao);
    }
  }
  for (let k = 0; k < L; k++) {
    const k2 = (k + 1) % L;
    for (let m = 0; m < K; m++) {
      const a = ringIdx(k, m), b = ringIdx(k2, m), c = ringIdx(k2, m + 1), d = ringIdx(k, m + 1);
      g0.push(a, b, d, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex([...g0, ...g1]);
  geo.addGroup(0, g0.length, 0); // Außen + Rand
  geo.addGroup(g0.length, g1.length, 1); // Innen
  geo.computeBoundingBox();
  const c = new THREE.Vector3();
  geo.boundingBox!.getCenter(c);
  geo.translate(-c.x, -c.y, -c.z);
  return geo;
}
