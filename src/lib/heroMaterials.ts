import * as THREE from "three";
import { applyShaders } from "./nailShaders";
import { canvasTex, baseMat, makeCatVariants, makeMaterials } from "./nailMaterials";

// Hero-Galerie: weitere 3D-Designs (Texturen = glatte Canvas-Zeichnungen, Spitze oben = uv.y 1).
let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const pair = (o: THREE.MeshPhysicalMaterial): THREE.MeshPhysicalMaterial[] => {
  const i = o.clone();
  i.transmission = 0;
  applyShaders(o, false);
  applyShaders(i, false);
  return [o, i];
};
const phys = (map: THREE.Texture | null, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({ ...baseMat, ...(map ? { map } : {}), color: 0xffffff, roughness: 0.07, ior: 1.5, ...extra } as THREE.MeshPhysicalMaterialParameters);
const vgrad = (g: CanvasRenderingContext2D, w: number, h: number, stops: [number, string][]) => {
  const gr = g.createLinearGradient(0, h, 0, 0);
  stops.forEach(([p, c]) => gr.addColorStop(p, c));
  g.fillStyle = gr;
  g.fillRect(0, 0, w, h);
};
const specks = (g: CanvasRenderingContext2D, w: number, h: number, n: number, y0: number, y1: number, cols: string[], rMin: number, rMax: number) => {
  for (let k = 0; k < n; k++) {
    g.fillStyle = cols[Math.floor(rnd() * cols.length)];
    g.globalAlpha = 0.55 + rnd() * 0.45;
    const x = rnd() * w, y = (y0 + rnd() * (y1 - y0)) * h, r = rMin + rnd() * (rMax - rMin);
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
};
const veins = (g: CanvasRenderingContext2D, w: number, h: number, n: number, col: string, lw: number, alpha: number) => {
  g.save();
  g.strokeStyle = col;
  g.lineCap = "round";
  g.globalAlpha = alpha;
  for (let k = 0; k < n; k++) {
    let x = rnd() * w, y = rnd() * h;
    g.lineWidth = lw * (0.5 + rnd());
    g.beginPath();
    g.moveTo(x, y);
    for (let s = 0; s < 7; s++) {
      x += (rnd() - 0.4) * 130;
      y += (rnd() - 0.5) * 150;
      g.quadraticCurveTo(x - 30 + rnd() * 60, y - 30 + rnd() * 60, x, y);
    }
    g.stroke();
  }
  g.restore();
};

export function makeHeroMaterials(): Record<string, THREE.MeshPhysicalMaterial[]> {
  seed = 7;
  const old = makeMaterials();
  const out: Record<string, THREE.MeshPhysicalMaterial[]> = {
    natur: old[0], full: old[1], french: old[2], baby: old[3], chrome: old[5],
  };
  const gloss = { roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03 };

  out.ombreGlitter = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#fbe8e4"], [0.4, "#f4bfc6"], [0.8, "#ec93a6"], [1, "#e57b95"]]);
    specks(g, w, h, 260, 0.02, 0.5, ["#fff7f2", "#ffe3ea", "#ffd0a8", "#ffffff"], 1.6, 4.2);
  }), gloss));

  const marble = (bg: [string, string], vein: string) =>
    pair(phys(canvasTex((g, w, h) => {
      vgrad(g, w, h, [[0, bg[0]], [1, bg[1]]]);
      veins(g, w, h, 11, "#6f6a72", 4.2, 0.8);
      veins(g, w, h, 12, vein, 4, 1);
      veins(g, w, h, 8, "#a9a3a8", 9, 0.35);
    }), { roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 }));
  out.marble = marble(["#ece8e4", "#dcd5d1"], "#cf9f3f");
  out.marbleRose = marble(["#f6e4e2", "#efd2d0"], "#c9975a");

  const flowerMat = (bg: [string, string], p0: string, p1: string, edge: string) =>
    pair(phys(canvasTex((g, w, h) => {
      vgrad(g, w, h, [[0, bg[0]], [1, bg[1]]]);
      const fl = (cx: number, cy: number, R: number, rot: number) => {
        for (let p = 0; p < 5; p++) {
          g.save();
          g.translate(cx, cy);
          g.rotate(rot + (p * Math.PI * 2) / 5);
          const gr = g.createLinearGradient(0, 0, 0, -R * 1.9);
          gr.addColorStop(0, p0);
          gr.addColorStop(1, p1);
          g.fillStyle = gr;
          g.beginPath();
          g.ellipse(0, -R, R * 0.62, R, 0, 0, Math.PI * 2);
          g.fill();
          g.strokeStyle = edge;
          g.lineWidth = 2.5;
          g.stroke();
          g.restore();
        }
        g.fillStyle = "#e6b24f";
        g.beginPath();
        g.arc(cx, cy, R * 0.3, 0, Math.PI * 2);
        g.fill();
      };
      g.fillStyle = "#8db07a";
      ([[150, 330, -0.9], [370, 470, 0.9], [260, 220, 0.3]] as const).forEach(([x, y, r]) => {
        g.save();
        g.translate(x, y);
        g.rotate(r);
        g.beginPath();
        g.ellipse(0, 0, 18, 56, 0, 0, Math.PI * 2);
        g.fill();
        g.restore();
      });
      fl(256, 400, 78, 0.2);
      fl(140, 215, 42, 0.8);
      fl(385, 245, 36, 0.1);
    }), gloss));
  out.flower = flowerMat(["#f6d0d2", "#f2aab8"], "#f48aa6", "#fff0f3", "rgba(214,90,125,0.55)");
  out.flowerWhite = flowerMat(["#f4d8cd", "#f1cfc2"], "#ffffff", "#f6efe9", "rgba(190,150,130,0.5)");

  out.silverGlitter = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#8d919c"], [0.5, "#c3c6cf"], [1, "#eceef3"]]);
    specks(g, w, h, 900, 0, 1, ["#ffffff", "#dfe6f5", "#9aa3b5", "#f4f1ff", "#6f7787"], 1.2, 4.2);
  }), { roughness: 0.18, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 }));

  out.snow = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#6d0a1a"], [1, "#a8132b"]]);
    g.strokeStyle = "rgba(255,255,255,0.95)";
    g.lineCap = "round";
    const flake = (cx: number, cy: number, R: number) => {
      g.lineWidth = Math.max(2, R / 9);
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3;
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        g.moveTo(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55);
        g.lineTo(cx + Math.cos(a + 0.5) * R * 0.8, cy + Math.sin(a + 0.5) * R * 0.8);
        g.moveTo(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55);
        g.lineTo(cx + Math.cos(a - 0.5) * R * 0.8, cy + Math.sin(a - 0.5) * R * 0.8);
        g.stroke();
      }
    };
    flake(256, 330, 78);
    flake(140, 160, 40);
    flake(380, 150, 34);
    flake(370, 560, 30);
    specks(g, w, h, 70, 0, 1, ["#ffffff"], 1.5, 3.2);
  }), gloss));

  out.champagne = pair(phys(null, { color: 0xf0d9a8, metalness: 1, roughness: 0.04, clearcoat: 0.3, clearcoatRoughness: 0.04 }));

  out.goldGlitter = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#a9741f"], [0.5, "#d9a84a"], [1, "#f2cf7d"]]);
    specks(g, w, h, 900, 0, 1, ["#fff1b8", "#fffaf0", "#c88a22", "#f7d47a", "#8a5a14"], 1.2, 4.2);
  }), { roughness: 0.18, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 }));

  out.goldLine = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#f1cdbf"], [1, "#f6d9cd"]]);
    g.lineCap = "round";
    g.strokeStyle = "#d8a63f";
    g.lineWidth = 11;
    g.beginPath();
    g.moveTo(40, h * 0.75);
    g.bezierCurveTo(200, h * 0.55, 330, h * 0.62, 470, h * 0.28);
    g.stroke();
    g.lineWidth = 4;
    g.strokeStyle = "#fff0b5";
    g.beginPath();
    g.moveTo(40, h * 0.75 - 3);
    g.bezierCurveTo(200, h * 0.55 - 3, 330, h * 0.62 - 3, 470, h * 0.28 - 3);
    g.stroke();
  }), gloss));

  out.pearl = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#d9c6f0"], [0.5, "#b79ee0"], [1, "#e3c4e6"]]);
  }), { roughness: 0.1, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [180, 520], sheen: 1, sheenColor: new THREE.Color(0xc9f0ff), sheenRoughness: 0.4 }));

  out.frenchGold = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#e8ad9c"], [1, "#efbfae"]]);
    const gr = g.createLinearGradient(0, 0, w, h * 0.3);
    gr.addColorStop(0, "#c8922e");
    gr.addColorStop(0.5, "#f5d88a");
    gr.addColorStop(1, "#c8922e");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(w, 0);
    g.lineTo(w, h * 0.3);
    g.quadraticCurveTo(w / 2, h * 0.07, 0, h * 0.3);
    g.closePath();
    g.fill();
  }), gloss));

  out.foil = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#5a0a1b"], [1, "#7a0b1d"]]);
    for (let k = 0; k < 70; k++) {
      const x = rnd() * w, y = rnd() * h * 0.7, s = 8 + rnd() * 30, a = rnd() * 3;
      const gr = g.createLinearGradient(x, y, x + s, y + s);
      gr.addColorStop(0, "#f3d27c");
      gr.addColorStop(1, "#b9852a");
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + s * Math.cos(a), y + s * 0.6 * Math.sin(a + 1));
      g.lineTo(x + s * 0.7, y + s);
      g.closePath();
      g.fill();
    }
  }), gloss));


  // ---- Neue Designs nach Kundenfotos (Sets = jeder Finger anders, Milky = ein Design fuer alle) ----
  out.milky = pair(phys(canvasTex((g, w, h) => {
    vgrad(g, w, h, [[0, "#f3e8e6"], [0.5, "#f8f2f1"], [1, "#fdfbfb"]]);
  }), gloss));

  const smile = (g: CanvasRenderingContext2D, w: number, h: number, y: number, dip: number) => {
    g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h * y);
    g.quadraticCurveTo(w / 2, h * (y - dip), 0, h * y); g.closePath();
  };
  const smileEdge = (g: CanvasRenderingContext2D, w: number, h: number, y: number, dip: number) => {
    g.save(); g.strokeStyle = "#e2b24e"; g.lineWidth = 7; g.lineCap = "round";
    g.beginPath(); g.moveTo(0, h * y); g.quadraticCurveTo(w / 2, h * (y - dip), w, h * y); g.stroke();
    g.restore();
    for (let k = 0; k < 40; k++) {
      const t = rnd(), x = t * w, yy = h * ((1 - t) * (1 - t) * y + 2 * t * (1 - t) * (y - dip) + t * t * y) + (rnd() - 0.5) * 26;
      g.fillStyle = rnd() > 0.5 ? "#f3d27c" : "#b9852a"; g.beginPath(); g.arc(x, yy, 2 + rnd() * 3, 0, 7); g.fill();
    }
  };
  const flake = (g: CanvasRenderingContext2D, cx: number, cy: number, R: number) => {
    g.save(); g.strokeStyle = "rgba(255,255,255,0.97)"; g.lineCap = "round"; g.lineWidth = Math.max(2.5, R / 8);
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      for (const d of [0.5, -0.5]) { g.moveTo(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55); g.lineTo(cx + Math.cos(a + d) * R * 0.85, cy + Math.sin(a + d) * R * 0.85); }
      g.stroke();
    }
    g.restore();
  };
  const dots = (g: CanvasRenderingContext2D, w: number, h: number, n: number, y0: number, y1: number) => specks(g, w, h, n, y0, y1, ["#ffffff"], 2.2, 5.5);
  const nude = (g: CanvasRenderingContext2D, w: number, h: number) => vgrad(g, w, h, [[0, "#efc6bd"], [0.6, "#f3cfc6"], [1, "#f6d8cf"]]);
  const gold = (g: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    gr.addColorStop(0, "#fff3b8"); gr.addColorStop(1, "#c8922e"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  };
  const petalFlower = (g: CanvasRenderingContext2D, cx: number, cy: number, R: number, n: number, rot: number) => {
    for (let p = 0; p < n; p++) {
      g.save(); g.translate(cx, cy); g.rotate(rot + (p * Math.PI * 2) / n);
      const gr = g.createLinearGradient(0, 0, 0, -R * 1.9);
      gr.addColorStop(0, "#d9d3dc"); gr.addColorStop(0.5, "#ffffff"); gr.addColorStop(1, "#f1ecf3");
      g.fillStyle = gr; g.beginPath(); g.ellipse(0, -R, R * 0.6, R, 0, 0, 7); g.fill();
      g.strokeStyle = "rgba(160,150,170,0.7)"; g.lineWidth = 3; g.stroke();
      g.strokeStyle = "rgba(190,180,200,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -R * 0.2); g.lineTo(0, -R * 1.7); g.stroke();
      g.restore();
    }
  };

  // Weihnachten (5 Finger)
  out.xmas1 = pair(phys(canvasTex((g, w, h) => {
    nude(g, w, h); g.fillStyle = "#7d0b1e"; smile(g, w, h, 0.34, 0.14); g.fill(); smileEdge(g, w, h, 0.34, 0.14);
    flake(g, 150, 150, 70); dots(g, w, h, 18, 0.05, 0.5);
  }), gloss));
  out.xmas2 = pair(phys(canvasTex((g, w, h) => {
    nude(g, w, h); g.fillStyle = "#1b4a30"; smile(g, w, h, 0.34, 0.14); g.fill(); smileEdge(g, w, h, 0.34, 0.14);
    dots(g, w, h, 40, 0.05, 0.8);
  }), gloss));
  out.xmas3 = pair(phys(canvasTex((g, w, h) => {
    nude(g, w, h); petalFlower(g, 256, 430, 112, 6, 0.3);
    gold(g, 232, 420, 16); gold(g, 282, 420, 16); gold(g, 257, 458, 16); dots(g, w, h, 16, 0.05, 0.3);
  }), gloss));
  out.xmas4 = pair(phys(canvasTex((g, w, h) => {
    nude(g, w, h); g.fillStyle = "#7d0b1e"; smile(g, w, h, 0.16, 0.06); g.fill(); smileEdge(g, w, h, 0.16, 0.06);
    g.fillStyle = "#1d5a38";
    [[420, 56], [330, 82], [235, 106]].forEach(([y, hw]) => { g.beginPath(); g.moveTo(256, y - 100); g.lineTo(256 + hw, y); g.lineTo(256 - hw, y); g.closePath(); g.fill(); });
    g.fillStyle = "#4d8a63"; g.fillRect(250, 560, 12, 44);
    g.strokeStyle = "#f0c96a"; g.lineWidth = 4; g.beginPath(); g.moveTo(205, 400); g.lineTo(300, 350); g.lineTo(215, 290); g.lineTo(290, 250); g.stroke();
    gold(g, 256, 650, 20); specks(g, w, h, 30, 0.2, 0.9, ["#f2cf7d"], 2, 4); dots(g, w, h, 14, 0.2, 0.9);
  }), gloss));
  out.xmas5 = pair(phys(canvasTex((g, w, h) => {
    nude(g, w, h); g.fillStyle = "#7d0b1e"; smile(g, w, h, 0.3, 0.12); g.fill(); smileEdge(g, w, h, 0.3, 0.12);
    g.strokeStyle = "#c7152e"; g.lineWidth = 11; g.lineCap = "round";
    g.beginPath(); g.moveTo(256, 520); g.bezierCurveTo(150, 430, 150, 560, 256, 520); g.bezierCurveTo(362, 430, 362, 560, 256, 520); g.stroke();
    g.beginPath(); g.moveTo(256, 520); g.lineTo(200, 640); g.moveTo(256, 520); g.lineTo(312, 640); g.stroke();
    flake(g, 380, 150, 44); dots(g, w, h, 26, 0.1, 0.9);
  }), gloss));

  // Ombre + Strass (4 Finger)
  const ombre = (g: CanvasRenderingContext2D, w: number, h: number) => vgrad(g, w, h, [[0, "#f0b9b4"], [0.5, "#f6d7d2"], [0.78, "#fbefeb"], [1, "#ffffff"]]);
  const gem = (g: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    const cols = ["#ffffff", "#cfe6ff", "#ffd8ec", "#e6ffd8", "#fff0c8"];
    const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.55, cols[Math.floor(rnd() * cols.length)]); gr.addColorStop(1, "#9a9aa8");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.strokeStyle = "rgba(90,90,110,0.55)"; g.lineWidth = 1.5; g.stroke();
  };
  out.strass1 = pair(phys(canvasTex((g, w, h) => {
    ombre(g, w, h);
    for (let k = 0; k <= 22; k++) { const t = k / 22; gem(g, 22 + t * (w - 44), 330 - 90 * Math.sin(t * Math.PI), 11); }
  }), gloss));
  out.strass2 = pair(phys(canvasTex((g, w, h) => {
    ombre(g, w, h);
    const n = 34; for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; gem(g, 256 + Math.cos(a) * 200, 560 + Math.sin(a) * 330, 11); }
  }), gloss));
  out.strass3 = pair(phys(canvasTex((g, w, h) => {
    ombre(g, w, h); petalFlower(g, 256, 260, 78, 5, 0.1); gold(g, 256, 256, 14);
  }), gloss));
  out.strass4 = pair(phys(canvasTex((g, w, h) => {
    ombre(g, w, h);
    for (let k = 0; k <= 12; k++) { const t = k / 12; gem(g, 20 + t * (w - 40), 330 - 90 * Math.sin(t * Math.PI), 11); }
    gem(g, 256, 520, 14); gem(g, 210, 560, 9); gem(g, 302, 560, 9);
  }), gloss));

  // Blood Stiletto (5 Finger): milchig-weiss + Blutspritzer / Tropfen
  const milkyBase = (g: CanvasRenderingContext2D, w: number, h: number) => vgrad(g, w, h, [[0, "#e8e2ee"], [1, "#f4f0f6"]]);
  const splat = (g: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    const cols = ["#8f1030", "#b3173f", "#d02a52", "#6f0b25"];
    g.fillStyle = cols[Math.floor(rnd() * cols.length)];
    g.beginPath(); g.ellipse(x, y, r, r * (0.7 + rnd() * 0.5), rnd() * 3, 0, 7); g.fill();
    for (let k = 0; k < 6; k++) { const a = rnd() * 6.28, d = r * (1.1 + rnd() * 1.4); g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * (0.1 + rnd() * 0.22), 0, 7); g.fill(); }
  };
  const bloody = (n: number, dense: number) => pair(phys(canvasTex((g, w, h) => {
    milkyBase(g, w, h);
    for (let k = 0; k < n; k++) splat(g, 40 + rnd() * (w - 80), 60 + rnd() * (h - 120), 10 + rnd() * 34 * dense);
    specks(g, w, h, 60, 0, 1, ["#b3173f", "#8f1030"], 1.5, 4);
  }), gloss));
  out.blood1 = bloody(7, 1);
  out.blood2 = bloody(11, 1.2);
  out.blood4 = bloody(5, 0.8);
  out.blood5 = bloody(9, 1);
  out.blood3 = pair(phys(canvasTex((g, w, h) => {
    milkyBase(g, w, h);
    const gr = g.createLinearGradient(0, 0, 0, h * 0.3); gr.addColorStop(0, "#5c0718"); gr.addColorStop(1, "#a3112f");
    g.fillStyle = gr; g.fillRect(0, 0, w, h * 0.3);
    [[70, 0.46, 30], [170, 0.62, 26], [270, 0.4, 34], [370, 0.7, 28], [450, 0.5, 24]].forEach(([x, e, r]) => {
      g.fillStyle = "#8c0e28"; g.fillRect(x - r / 2, h * 0.28, r, h * e - h * 0.28);
      g.beginPath(); g.arc(x, h * e, r / 2, 0, 7); g.fill();
      g.fillStyle = "rgba(255,170,190,0.45)"; g.fillRect(x - r / 5, h * 0.3, r / 6, h * e - h * 0.34);
    });
    specks(g, w, h, 20, 0.3, 0.9, ["#b3173f"], 2, 6);
  }), gloss));

  out.cat0 = makeCatVariants(1)[0];
  return out;
}
