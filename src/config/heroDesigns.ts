// Designs der 3D-Galerie im Hero: genau die 6 Designs aus dem Menü des Salons (Preise/Detailseiten in config/nails.ts).
// kind = Material-Schlüssel in lib/nailMaterials.makeHeroMaterials(); cats = Filter im linken Menü.
export type HeroCat = "alle" | "french" | "glitzer" | "verlauf" | "minimal";
export type HeroDesign = { id: string; name: string; kind: string; cats: HeroCat[]; slug?: string; cat?: boolean; bright?: boolean };

export const HERO_CATS: { id: HeroCat; label: string }[] = [
  { id: "alle", label: "Alle Designs" },
  { id: "minimal", label: "Natur & Farbe" },
  { id: "french", label: "French" },
  { id: "verlauf", label: "Verlauf (Ombre)" },
  { id: "glitzer", label: "Effekte" },
];

export const heroDesigns: HeroDesign[] = [
  { id: "natur", name: "Natur", kind: "natur", cats: ["minimal"], slug: "natur" },
  { id: "bordeaux", name: "Full Cover Farbe", kind: "full", cats: ["minimal"], slug: "full-cover-farbe" },
  { id: "french", name: "French", kind: "french", cats: ["french"], slug: "french" },
  { id: "babyboomer", name: "Babyboomer", kind: "baby", cats: ["verlauf"], slug: "babyboomer" },
  { id: "cat-rubin", name: "Cat Eye", kind: "cat0", cats: ["glitzer"], slug: "cat-eye", cat: true },
  { id: "chrome", name: "Chrome", kind: "chrome", cats: ["glitzer"], slug: "chrome", bright: true },
];
