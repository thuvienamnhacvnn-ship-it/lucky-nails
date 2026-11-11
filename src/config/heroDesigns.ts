// Designs der 3D-Galerie im Hero (nur Anzeige; Preise/Detailseiten bleiben in config/nails.ts).
// kind = Material-Schlüssel in lib/nailMaterials.makeHeroMaterials(); cats = Filter im linken Menü.
export type HeroCat = "alle" | "french" | "glitzer" | "verlauf" | "marmor" | "blumen" | "minimal" | "saison";
export type HeroDesign = { id: string; name: string; kind: string; cats: HeroCat[]; slug?: string; cat?: boolean; bright?: boolean };

export const HERO_CATS: { id: HeroCat; label: string }[] = [
  { id: "alle", label: "Alle Designs" },
  { id: "french", label: "French" },
  { id: "glitzer", label: "Glitzer" },
  { id: "verlauf", label: "Verlauf (Ombre)" },
  { id: "marmor", label: "Marmor" },
  { id: "blumen", label: "Blumen" },
  { id: "minimal", label: "Minimal" },
  { id: "saison", label: "Saison & Events" },
];

export const heroDesigns: HeroDesign[] = [
  { id: "chrome", name: "Chrome Rosé", kind: "chrome", cats: ["glitzer", "minimal"], slug: "chrome", bright: true },
  { id: "french", name: "French", kind: "french", cats: ["french"], slug: "french" },
  { id: "ombre-glitzer", name: "Rosé Glitzer Ombré", kind: "ombreGlitter", cats: ["verlauf", "glitzer"] },
  { id: "marmor", name: "Marmor Weiß-Gold", kind: "marble", cats: ["marmor"] },
  { id: "blume", name: "Blüte Rosa", kind: "flower", cats: ["blumen"] },
  { id: "gold-glitzer", name: "Gold Glitzer", kind: "goldGlitter", cats: ["glitzer", "saison"] },
  { id: "bordeaux", name: "Full Cover Bordeaux", kind: "full", cats: ["minimal", "saison"], slug: "full-cover-farbe" },
  { id: "nude-goldlinie", name: "Nude mit Goldlinie", kind: "goldLine", cats: ["minimal"] },
  { id: "perlmutt", name: "Perlmutt Lila", kind: "pearl", cats: ["glitzer", "saison"] },
  { id: "natur", name: "Natur", kind: "natur", cats: ["minimal"], slug: "natur" },
  { id: "babyboomer", name: "Babyboomer", kind: "baby", cats: ["verlauf"], slug: "babyboomer" },
  { id: "french-gold", name: "French Gold", kind: "frenchGold", cats: ["french", "saison"] },
  { id: "marmor-rose", name: "Marmor Rosé", kind: "marbleRose", cats: ["marmor", "verlauf"] },
  { id: "bordeaux-gold", name: "Bordeaux Goldfolie", kind: "foil", cats: ["saison", "glitzer"] },
  { id: "blume-weiss", name: "Blüte Weiß", kind: "flowerWhite", cats: ["blumen", "minimal"] },
  { id: "silber-glitzer", name: "Silber Glitzer", kind: "silverGlitter", cats: ["glitzer", "saison"] },
  { id: "champagner", name: "Chrome Champagner", kind: "champagne", cats: ["glitzer", "minimal"], bright: true },
  { id: "schnee", name: "Winter Schnee", kind: "snow", cats: ["saison"] },
  { id: "cat-rubin", name: "Cat Eye Rubin", kind: "cat0", cats: ["glitzer"], slug: "cat-eye", cat: true },
];
