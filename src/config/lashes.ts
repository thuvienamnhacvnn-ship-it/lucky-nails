// 6 WIMPERN-LOOKS fuer die Kacheln (Preise kommen aus prices-wimpern.ts, nichts doppelt gepflegt).
import { lashLooks, lashExtras } from "./prices-wimpern";

export type Lash = { slug: string; name: string; en: string; tag: string; desc: string; photo: string; from: string };

const neu = (i: number) => `Neu-Set ab ${lashLooks[i].rows[0][1].replace(" €", "€")}`;
const liftFrom = (() => {
  const n = lashExtras.filter(([k]) => /lifting/i.test(k)).map(([, v]) => parseFloat(v));
  return `Lifting ab ${Math.min(...n)}€`;
})();

export const lashes: Lash[] = [
  { slug: "mascara-look", name: "Mascara Look", en: "Mascara Look", tag: "Natural Volume", desc: "Natürliches Volumen wie frisch getuscht – leicht und alltagstauglich.", photo: "/img/lash-1.webp", from: neu(0) },
  { slug: "hybrid-look", name: "Hybrid Look", en: "Hybrid Look", tag: "2–3D Volume", desc: "Weiches, dichtes Finish mit feinen Spikes für einen offenen Blick.", photo: "/img/lash-2.webp", from: neu(1) },
  { slug: "wetlook", name: "Wetlook", en: "Wetlook", tag: "4–5D Volume", desc: "Glänzendes Volumen mit definierten Spitzen – der Trend-Look.", photo: "/img/lash-3.webp", from: neu(2) },
  { slug: "mega-look", name: "Mega Look", en: "Mega Look", tag: "6D and more", desc: "Intensiver, voller Blick für alle, die es besonders dicht mögen.", photo: "/img/lash-4.webp", from: neu(3) },
  { slug: "design-look", name: "Design Look", en: "Design Look", tag: "Anime / Douyin", desc: "Kreative Designs wie Anime, Douyin oder Manhwa – individuell geplant.", photo: "/img/lash-5.webp", from: neu(4) },
  { slug: "lifting", name: "Lifting", en: "Lash Lift & Brow", tag: "Lash Lift and Brow", desc: "Geliftete Wimpern und Augenbrauen – natürlich geschwungen, ohne Verlängerung.", photo: "/img/lash-6.webp", from: liftFrom },
];
