// PREISE — exakt aus dem Flyer. Nichts ergänzen, was nicht auf dem Flyer steht.
export type PriceGroup = {
  id: "nagelmodellage" | "maniküre" | "pediküre" | "addons";
  tab: string;
  title: string;
  heads: string[];
  rows: string[][];
};

export const priceGroups: PriceGroup[] = [
  {
    id: "nagelmodellage",
    tab: "Nagelmodellage",
    title: "Nagelmodellage",
    heads: ["Behandlung", "Neumodellage", "Auffüllen"],
    rows: [
      ["Natur", "30 €", "25 €"],
      ["Mit Full Cover Farbe", "33 €", "27 €"],
      ["Mit French / Babyboomer", "35 €", "33 €"],
      ["Mit Cat Eye / Chrome", "37 €", "35 €"],
      ["Design", "auf Anfrage", "auf Anfrage"],
    ],
  },
  {
    id: "maniküre",
    tab: "Maniküre",
    title: "Maniküre",
    heads: ["Behandlung", "Preis"],
    rows: [
      ["Basic Maniküre (ohne Farbe)", "17 €"],
      ["Mit Nagellack", "23 €"],
      ["Mit Shellac", "27 €"],
    ],
  },
  {
    id: "pediküre",
    tab: "Pediküre",
    title: "Pediküre",
    heads: ["Behandlung", "Preis"],
    rows: [
      ["Basic Pediküre (ohne Farbe)", "27 €"],
      ["Mit Nagellack", "33 €"],
      ["Mit Shellac", "35 €"],
      ["Mit Gel", "40 €"],
    ],
  },
  {
    id: "addons",
    tab: "Add-ons",
    title: "Add-ons",
    heads: ["Leistung", "Preis"],
    rows: [
      ["Steinchen (pro Stück)", "0,50 €"],
      ["Ablösen ohne weitere Behandlung", "15 €"],
    ],
  },
];
