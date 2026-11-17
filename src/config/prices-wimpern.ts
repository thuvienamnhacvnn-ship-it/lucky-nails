// Wimpern & Augenbrauen — Preise = Mitbewerber-Preisliste, ab 50 € −5 €, unter 50 € −3 € (Stand 17.11.2026).
const d = (p: number) => (p >= 50 ? p - 5 : p - 3);
// Format: "neu|alt" -> Anzeige: alter Preis durchgestrichen, neuer Preis hervorgehoben
const e = (p: number) => `${d(p)} €|${p} €`;

type Look = { title: string; sub: string; rows: [string, string][] };
const look = (title: string, sub: string, neu: number, a2: number, a3: number, a4: number, fremd?: number): Look => ({
  title,
  sub,
  rows: [
    ["Neu-Set", e(neu)],
    ["Auffüllung bis 2 Wochen", e(a2)],
    ["Auffüllung bis 3 Wochen", e(a3)],
    ["Auffüllung bis 4 Wochen", e(a4)],
    ...(fremd ? ([["Fremdarbeit", e(fremd)]] as [string, string][]) : []),
  ],
});

export const lashLooks: Look[] = [
  look("Mascara Look", "Natürliches Volumen", 79, 35, 45, 55, 69),
  look("Hybrid Look · 2–3D", "Weiches, dichtes Finish", 89, 40, 50, 60, 75),
  look("Wetlook · 4–5D", "Glänzendes Volumen", 99, 45, 55, 65, 80),
  look("Mega Look · ab 6D", "Intensiver Blick", 109, 59, 69, 79, 99),
  look("Design Look", "Anime, Douyin, Manhwa …", 120, 60, 70, 80),
];

export const lashExtras: [string, string][] = [
  ["Design (Kim K, Wispy, UV, Farbe)", e(10)],
  ["Wimpernverlängerung entfernen", e(15)],
  ["Handmassage", e(15)],
  ["Korean Lifting inkl. Farbe", e(75)],
  ["Wimpernlifting mit Farbe", e(60)],
  ["Wimpernlifting ohne Farbe", e(50)],
  ["Augenbrauenlifting mit Farbe", e(50)],
  ["Augenbrauenlifting ohne Farbe", e(40)],
  ["Augenbrauen zupfen & färben", e(23)],
  ["Augenbrauen & Wimpern färben", e(26)],
  ["Augenbrauen zupfen", e(15)],
  ["Augenbrauen färben", e(15)],
  ["Wimpern färben", e(18)],
  ["Wimpern unten", e(15)],
];
