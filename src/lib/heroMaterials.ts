import * as THREE from "three";
import { applyShaders } from "./nailShaders";
import { canvasTex, baseMat, makeCatVariants, makeMaterials } from "./nailMaterials";

let BUMP = false; // true waehrend des Relief-(Bump-)Durchlaufs: erhabene Teile weiss, Grund schwarz
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
    vgrad(g, w, h, [[0, "#e6dce1"], [0.5, "#efe8ec"], [1, "#f7f3f5"]]);
  }), gloss));

  const smile = (g: CanvasRenderingContext2D, w: number, h: number, y: number, dip: number) => {
    g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h * y);
    g.quadraticCurveTo(w / 2, h * (y - dip), 0, h * y); g.closePath();
  };
  const smileEdge = (g: CanvasRenderingContext2D, w: number, h: number, y: number, dip: number) => {
    if (!BUMP) {
      g.save(); g.strokeStyle = "#e2b24e"; g.lineWidth = 7; g.lineCap = "round";
      g.beginPath(); g.moveTo(0, h * y); g.quadraticCurveTo(w / 2, h * (y - dip), w, h * y); g.stroke();
      g.restore();
    }
    for (let k = 0; k < 40; k++) {
      const t = rnd(), x = t * w, yy = h * ((1 - t) * (1 - t) * y + 2 * t * (1 - t) * (y - dip) + t * t * y) + (rnd() - 0.5) * 26;
      g.fillStyle = rnd() > 0.5 ? "#f6d98a" : "#c08a2c"; const sz = 4 + rnd() * 9; g.beginPath(); g.moveTo(x, yy - sz); g.lineTo(x + sz * 0.8, yy + sz * 0.2); g.lineTo(x + sz * 0.1, yy + sz * 0.9); g.lineTo(x - sz * 0.7, yy + sz * 0.1); g.closePath(); g.fill();
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
    gr.addColorStop(0, "#fff3b8"); gr.addColorStop(1, "#c8922e"); g.fillStyle = BUMP ? "#fff" : gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
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

  // Erhabene Gel-Malerei (Schneeflocken, Punkte, Goldfolie, Schleife, Tanne, Blut): zweiter Durchlauf -> Bump-Map = echtes Relief
  const bumpTex = (draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 1024;
    const g = c.getContext("2d")!; g.fillStyle = "#000"; g.fillRect(0, 0, 512, 1024);
    const px = new Proxy(g, {
      set(t, k, v) { if (k === "fillStyle" || k === "strokeStyle") v = typeof v === "string" ? "#fff" : "#000"; (t as any)[k] = v; return true; },
      get(t, k) { const x = (t as any)[k]; return typeof x === "function" ? x.bind(t) : x; },
    });
    BUMP = true;
    try { draw(px as CanvasRenderingContext2D, 512, 1024); } finally { BUMP = false; }
    const c2 = document.createElement("canvas"); c2.width = 512; c2.height = 1024;
    const g2 = c2.getContext("2d")!; g2.filter = "blur(1.6px)"; g2.drawImage(c, 0, 0);
    const t = new THREE.CanvasTexture(c2); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; return t;
  };
  const artMat = (draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, bs = 4) => {
    const s0 = seed;
    const map = canvasTex(draw);
    const s1 = seed;
    seed = s0;
    const bump = bumpTex(draw);
    seed = s1;
    return pair(phys(map, { ...gloss, bumpMap: bump, bumpScale: bs }));
  };

  // Weihnachten (7 Naegel nach Foto): sheer Nude + tiefe French-Spitzen rot/gruen, Goldfolie, Schneeflocken, Punkte
  const sheer = (g: CanvasRenderingContext2D, w: number, h: number) => vgrad(g, w, h, [[0, "#dc9f90"], [0.5, "#e8b8aa"], [1, "#edc2b5"]]);
  const tip = (g: CanvasRenderingContext2D, w: number, h: number, c0: string, c1: string, y: number, dip: number) => {
    const gr = g.createLinearGradient(0, 0, 0, h * y); gr.addColorStop(0, c0); gr.addColorStop(1, c1);
    if (!BUMP) { g.fillStyle = gr; smile(g, w, h, y, dip); g.fill(); } smileEdge(g, w, h, y, dip);
  };
  const RED: [string, string] = ["#8a1022", "#5d0816"], GREEN: [string, string] = ["#1f5238", "#133424"];
  const leaf = (g: CanvasRenderingContext2D, n: number, y0: number, y1: number, w: number, h: number) => {
    for (let k = 0; k < n; k++) {
      const x = 60 + rnd() * (w - 120), y = (y0 + rnd() * (y1 - y0)) * h, sz = 8 + rnd() * 16;
      const gr = g.createLinearGradient(x, y, x + sz, y + sz); gr.addColorStop(0, "#fbe7a0"); gr.addColorStop(1, "#b8841f");
      g.fillStyle = BUMP ? "#fff" : gr; g.beginPath(); g.moveTo(x, y - sz * 0.6); g.lineTo(x + sz, y - sz * 0.1); g.lineTo(x + sz * 0.5, y + sz * 0.8); g.lineTo(x - sz * 0.4, y + sz * 0.4); g.closePath(); g.fill();
    }
  };
  const star = (g: CanvasRenderingContext2D, cx: number, cy: number, R: number) => {
    g.fillStyle = "#f1c95e"; g.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? R * 0.42 : R; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    g.closePath(); g.fill();
  };
  out.xmas1 = artMat((g, w, h) => {
    sheer(g, w, h); tip(g, w, h, ...RED, 0.34, 0.16); flake(g, 170, 170, 78); dots(g, w, h, 12, 0.08, 0.3); dots(g, w, h, 10, 0.4, 0.9);
  });
  out.xmas2 = artMat((g, w, h) => {
    sheer(g, w, h); tip(g, w, h, ...GREEN, 0.34, 0.16); leaf(g, 6, 0.06, 0.3, w, h); dots(g, w, h, 8, 0.38, 0.9);
  });
  out.xmas3 = artMat((g, w, h) => {
    sheer(g, w, h); dots(g, w, h, 26, 0.02, 0.36); dots(g, w, h, 14, 0.7, 0.95);
  });
  out.xmas4 = artMat((g, w, h) => {
    sheer(g, w, h); tip(g, w, h, ...RED, 0.32, 0.14); flake(g, 330, 150, 58);
    g.strokeStyle = "#d3182f"; g.lineWidth = 9; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(236, 560); g.bezierCurveTo(130, 480, 120, 640, 236, 560); g.bezierCurveTo(330, 480, 345, 650, 236, 560); g.stroke();
    g.beginPath(); g.moveTo(236, 560); g.quadraticCurveTo(210, 650, 170, 700); g.moveTo(236, 560); g.quadraticCurveTo(270, 650, 320, 690); g.stroke();
    gold(g, 236, 560, 13); dots(g, w, h, 18, 0.1, 0.95);
  });
  out.xmas5 = artMat((g, w, h) => {
    sheer(g, w, h); tip(g, w, h, ...GREEN, 0.3, 0.14); flake(g, 130, 150, 66); leaf(g, 9, 0.2, 0.62, w, h); dots(g, w, h, 22, 0.35, 0.95);
  });
  out.xmas6 = artMat((g, w, h) => {
    sheer(g, w, h); tip(g, w, h, ...RED, 0.18, 0.07);
    // Tannenbaum: uebereinander gesetzte Zweige (Spitze zur Nagelspitze), Gold-Girlande, Stern am Nagelbett
    g.lineJoin = "round";
    for (let k = 0; k < 5; k++) {
      const y0 = 290 + k * 78, hw = 46 + k * 22;
      g.fillStyle = k % 2 ? "#1c5a3b" : "#246b46"; g.strokeStyle = "#12402a"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(256, y0 - 44); g.lineTo(256 + hw, y0 + 52);
      for (let j = 1; j <= 6; j++) g.lineTo(256 + hw - (hw * 2 * j) / 6, y0 + 52 - (j % 2 ? 14 : 0));
      g.closePath(); g.fill(); g.stroke();
    }
    g.fillStyle = "#6b4a2b"; g.fillRect(246, 690, 20, 36);
    g.strokeStyle = "#f0c560"; g.lineWidth = 5;
    g.beginPath(); g.moveTo(222, 360); g.lineTo(300, 392); g.lineTo(212, 430); g.lineTo(310, 470); g.lineTo(200, 520); g.lineTo(318, 562); g.stroke();
    star(g, 262, 760, 30); gold(g, 150, 520, 9); gold(g, 372, 440, 9); gold(g, 160, 780, 8); gold(g, 360, 700, 8);
    dots(g, w, h, 16, 0.2, 0.95);
  });
  out.xmas7 = artMat((g, w, h) => {
    sheer(g, w, h); tip(g, w, h, ...GREEN, 0.3, 0.14); flake(g, 330, 520, 40); leaf(g, 4, 0.06, 0.28, w, h); dots(g, w, h, 28, 0.35, 0.97);
  });

  // Ombre + Strass (5 Naegel nach Foto): rosa Nagelbett -> cremeweisse Spitze; Steine/Blueten sind echtes 3D
  const ombreTex = () => pair(phys(canvasTex((g, w, h) => vgrad(g, w, h, [[0, "#d98a84"], [0.42, "#e6aca4"], [0.62, "#f1d3c8"], [0.78, "#efe8d4"], [1, "#ece4cc"]])), gloss));
  out.strass1 = ombreTex(); out.strass2 = ombreTex(); out.strass3 = ombreTex(); out.strass4 = ombreTex(); out.strass5 = ombreTex();

  // Blood Stiletto (5 Naegel nach Foto): milchig-lavendel, Blutspritzer und Tropfen
  const milkyBase = (g: CanvasRenderingContext2D, w: number, h: number) => vgrad(g, w, h, [[0, "#d9d5e3"], [0.6, "#e3e0ec"], [1, "#eceaf2"]]);
  const splat = (g: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    const cols = ["#7f0c25", "#a3123a", "#c01f48", "#5e081c"];
    g.fillStyle = cols[Math.floor(rnd() * cols.length)];
    g.beginPath(); g.ellipse(x, y, r, r * (0.7 + rnd() * 0.5), rnd() * 3, 0, 7); g.fill();
    for (let k = 0; k < 9; k++) { const a = rnd() * 6.28, d = r * (1.1 + rnd() * 1.6); g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * (0.08 + rnd() * 0.22), 0, 7); g.fill(); }
    g.fillStyle = "rgba(255,200,215,0.55)"; g.beginPath(); g.ellipse(x - r * 0.3, y - r * 0.3, r * 0.22, r * 0.12, -0.6, 0, 7); g.fill();
  };
  const bloody = (n: number, dense: number, tipSpray: number) => artMat((g, w, h) => {
    milkyBase(g, w, h);
    for (let k = 0; k < n; k++) splat(g, 50 + rnd() * (w - 100), 40 + rnd() * (h * (tipSpray ? 0.8 : 0.9)), 10 + rnd() * 36 * dense);
    specks(g, w, h, 90, 0, 1, ["#a3123a", "#7f0c25"], 1.5, 4.5);
  });
  out.blood1 = bloody(8, 1, 1);
  out.blood4 = bloody(13, 1.3, 0);
  out.blood5 = bloody(5, 0.8, 1);
  const drip = (heavy: number) => artMat((g, w, h) => {
    milkyBase(g, w, h);
    const gr = g.createLinearGradient(0, 0, 0, h * 0.42); gr.addColorStop(0, "#5a0719"); gr.addColorStop(1, "#a01230");
    if (!BUMP) { g.fillStyle = gr; g.fillRect(0, 0, w, h * 0.42); }
    const xs = heavy ? [100, 256, 412] : [150, 362];
    xs.forEach((x, i) => {
      const len = h * (0.56 + rnd() * (heavy ? 0.22 : 0.14)), r = 78 + rnd() * 18;
      if (BUMP) return; // grosse Farbflaeche + Tropfen liegen buendig (ein Guss), nur Spritzer sind erhaben
      g.fillStyle = "#8e0f2b"; g.beginPath(); g.moveTo(x - r * 1.5, h * 0.38); g.quadraticCurveTo(x - r * 0.5, h * 0.44, x - r * 0.45, h * 0.52); g.lineTo(x - r * 0.45, len); g.arc(x, len, r * 0.45, Math.PI, 0, true);
      g.lineTo(x + r * 0.45, h * 0.52); g.quadraticCurveTo(x + r * 0.5, h * 0.44, x + r * 1.5, h * 0.38); g.closePath(); g.fill();
      g.beginPath(); g.arc(x, len + r * 0.55, r * 0.58, 0, 7); g.fill();
      g.fillStyle = "rgba(255,190,205,0.55)"; g.fillRect(x - r * 0.28, h * 0.44, r * 0.18, len - h * 0.46);
      if (i % 2 === 0) { g.fillStyle = "#8e0f2b"; g.beginPath(); g.arc(x + 30, len + 70, 9, 0, 7); g.fill(); }
    });
    for (let k = 0; k < 7; k++) splat(g, 40 + rnd() * (w - 80), h * (0.55 + rnd() * 0.4), 6 + rnd() * 12);
  });
  out.blood2 = drip(0);
  out.blood3 = drip(1);

  out.cat0 = makeCatVariants(1)[0];
  return out;
}
