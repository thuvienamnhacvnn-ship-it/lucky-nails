import * as THREE from "three";
import { applyShaders } from "./nailShaders";

// 6 Stile als MeshPhysicalMaterial. Texturen: nur glatte Verläufe (kein Rauschen, keine Normal-/Bumpmaps).
// Canvas: oben = Spitze (uv.y = 1).
export function canvasTex(draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 1024;
  draw(c.getContext("2d")!, c.width, c.height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

export const baseMat = { clearcoat: 1, clearcoatRoughness: 0.03, side: THREE.DoubleSide, vertexColors: true } as const;

export function makeMaterials(): THREE.MeshPhysicalMaterial[][] {
  // 1 NATUR – transparentes Rosé-Nude mit Tiefe
  const natur = new THREE.MeshPhysicalMaterial({
    ...baseMat, color: 0xdc8c7a, roughness: 0.08, transmission: 0.2, thickness: 0.7, ior: 1.42,
    attenuationColor: new THREE.Color(0xe0806e), attenuationDistance: 0.5, sheen: 0.4, sheenColor: new THREE.Color(0xf6b8a6), sheenRoughness: 0.6,
  });

  // 2 FULL COVER FARBE – Burgundy, Hochglanz
  const full = new THREE.MeshPhysicalMaterial({ ...baseMat, color: 0x7a0b1d, roughness: 0.07, ior: 1.5 });

  // 3 FRENCH – Nude-Grund, sauberes Milchweiß an der Spitze (Smile-Line)
  const frenchMap = canvasTex((g, w, h) => {
    const gr = g.createLinearGradient(0, h, 0, 0);
    gr.addColorStop(0, "#e29682");
    gr.addColorStop(1, "#ebab99");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#fffdf9";
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(w, 0);
    g.lineTo(w, h * 0.34);
    g.quadraticCurveTo(w / 2, h * 0.08, 0, h * 0.34);
    g.closePath();
    g.fill();
  });
  const french = new THREE.MeshPhysicalMaterial({ ...baseMat, map: frenchMap, color: 0xffffff, roughness: 0.08, transmission: 0.1, thickness: 0.4 });

  // 4 BABYBOOMER – Spitze rosa, zum Fuß milchweiß
  const babyMap = canvasTex((g, w, h) => {
    const gr = g.createLinearGradient(0, h, 0, 0);
    gr.addColorStop(0, "#fff8f5");
    gr.addColorStop(0.28, "#f9d3d3");
    gr.addColorStop(0.62, "#f2939f");
    gr.addColorStop(1, "#ee7f90");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const baby = new THREE.MeshPhysicalMaterial({ ...baseMat, map: babyMap, color: 0xffffff, roughness: 0.08, transmission: 0.05, thickness: 0.4 });

  // 5 CAT EYE – rosé-rot mit glattem, schrägem Lichtband (Textur) + wenige feine Glitzerpunkte
  const catMap = canvasTex((g, w, h) => {
    // tiefer Rotbraun-Grund, metallisch dunkel (die Flocken + das Lichtband kommen aus dem Shader)
    const gr = g.createLinearGradient(0, h, 0, 0);
    gr.addColorStop(0, "#4a0613");
    gr.addColorStop(0.55, "#8a0f2c");
    gr.addColorStop(1, "#a51a3a");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const cat = new THREE.MeshPhysicalMaterial({ ...baseMat, map: catMap, color: 0xffffff, roughness: 0.06, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03, ior: 1.5, envMapIntensity: 0.55 });

  // 6 CHROME – Spiegel Rosé-Gold
  const chrome = new THREE.MeshPhysicalMaterial({ ...baseMat, color: 0xe08a74, metalness: 1, roughness: 0.04, clearcoat: 0.3, clearcoatRoughness: 0.04 });

  // Geometrie-Gruppen: 0 außen + Rand, 1 innen (AO über Vertexfarben)
  return [natur, full, french, baby, cat, chrome].map((o, idx) => {
    const i = o.clone();
    i.transmission = 0;
    applyShaders(o, idx === 4);
    applyShaders(i, idx === 4);
    return [o, i];
  });
}

// Cat-Eye-Farbvarianten (gleiche Shader-Schicht, nur Gel-Grund + Bandtönung ändern sich)
export const CAT_VARIANTS = [
  { name: "Rubin", c: ["#4a0613", "#8a0f2c", "#a51a3a"], sw: "#b01a3c" },
  { name: "Bernstein", c: ["#3a1405", "#a2480f", "#dc8f1f"], sw: "#d4841a" },
  { name: "Rauch", c: ["#121318", "#383b45", "#6f7380"], sw: "#7b7f8c" },
  { name: "Ozean", c: ["#040c28", "#0e3a86", "#1f70c4"], sw: "#2377c8" },
  { name: "Violett", c: ["#120a2e", "#4a2f86", "#8c66c8"], sw: "#8a62c6" },
] as const;

export function makeCatVariants(n: number = CAT_VARIANTS.length): THREE.MeshPhysicalMaterial[][] {
  return CAT_VARIANTS.slice(0, n).map((v) => {
    const map = canvasTex((g, w, h) => {
      const gr = g.createLinearGradient(0, h, 0, 0);
      gr.addColorStop(0, v.c[0]); gr.addColorStop(0.55, v.c[1]); gr.addColorStop(1, v.c[2]);
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
    const o = new THREE.MeshPhysicalMaterial({ ...baseMat, map, color: 0xffffff, roughness: 0.06, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03, ior: 1.5, envMapIntensity: 0.55 });
    const i = o.clone();
    i.transmission = 0;
    applyShaders(o, true);
    applyShaders(i, true);
    return [o, i];
  });
}
