import * as THREE from "three";

// Eigene Studio-Umgebung statt RoomEnvironment (harte Kisten -> Streifen in Reflexionen):
// Equirect 2048x1024 mit wenigen großen, weichen Softboxen auf warm-dunklem Grund, als HDR (Half-Float), dann PMREM.
export function makeStudioEnv(renderer: THREE.WebGLRenderer, bright = false) {
  const W = 2048, H = 1024;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  // Grund: warmes Dunkel, oben/unten leicht heller (Raum)
  const bg = g.createLinearGradient(0, 0, 0, H);
  if (bright) { bg.addColorStop(0, "#f0c2aa"); bg.addColorStop(0.42, "#8a4c3a"); bg.addColorStop(0.62, "#d89c84"); bg.addColorStop(1, "#6a3a2e"); }
  else { bg.addColorStop(0, "#2a1812"); bg.addColorStop(0.5, "#1d100c"); bg.addColorStop(1, "#2c1a15"); }
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  const soft = (x: number, y: number, w: number, h: number, color: string, blur: number, r = 60) => {
    g.save();
    g.filter = `blur(${blur}px)`;
    g.fillStyle = color;
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fill();
    g.restore();
  };
  // Hauptdecke: langer Lichtstreifen oben
  soft(300, 60, 1450, 190, "#fff4e2", 40, 80);
  // zwei große Softboxen links/rechts (Key warm, Fill kühl-neutral)
  soft(200, 280, 400, 440, "#ffe9cc", 50, 110);
  soft(1450, 280, 400, 440, "#f6f1ff", 50, 110);
  // Frontal (Kamera-Seite): flache, breite Softbox schwach
  soft(780, 380, 480, 300, "#e8d8c8", 60, 90);
  // warmes Rim-Licht hinten (an der Naht des Equirects)
  soft(1880, 360, 168, 300, "#ffb27d", 50, 80);
  soft(0, 360, 130, 300, "#ffb27d", 50, 80);
  // Boden: weicher rosa Bounce
  soft(300, 800, 1450, 140, "#a8626a", 70, 80);

  // Float-HDR: Softbox-Helligkeit anheben
  const img = g.getImageData(0, 0, W, H).data;
  const half = new Uint16Array(W * H * 4);
  const lin = (v: number) => Math.pow(v / 255, 2.2);
  for (let i = 0; i < W * H; i++) {
    const r = lin(img[i * 4]), gg = lin(img[i * 4 + 1]), b = lin(img[i * 4 + 2]);
    const lum = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
    const boost = 1 + 10 * Math.max(0, Math.min(1, (lum - 0.2) / 0.5)); // nur helle Boxen werden HDR
    half[i * 4] = THREE.DataUtils.toHalfFloat(r * boost);
    half[i * 4 + 1] = THREE.DataUtils.toHalfFloat(gg * boost);
    half[i * 4 + 2] = THREE.DataUtils.toHalfFloat(b * boost);
    half[i * 4 + 3] = THREE.DataUtils.toHalfFloat(1);
  }
  const tex = new THREE.DataTexture(half, W, H, THREE.RGBAFormat, THREE.HalfFloatType);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.LinearSRGBColorSpace;
  tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex);
  tex.dispose();
  return { texture: env.texture, dispose: () => { env.dispose(); pmrem.dispose(); } };
}
