// 6 NAIL DESIGNS — Reihenfolge = Reihenfolge im Hero-Karussell.
export type Nail = {
  slug: string;
  name: string;
  en: string;
  tag: string;
  desc: string;
  long: string;
  nail: string; // freigestellter Nagel (Hero)
  photo: string; // Illustration (Kachel/Detailseite)
  price: { neu: string; auffuellen: string };
  gallery: string; // Filter-Kategorie in der Galerie
};

export const nails: Nail[] = [
  { slug: "natur", name: "Natur", en: "Natural Nails", tag: "Clean & Timeless", desc: "Zarte Nude-Töne für einen eleganten Alltagslook.", long: "Natürlich, gepflegt und zeitlos: Nude- und Rosétöne mit sanftem Glanz, die zu jedem Outfit und jedem Anlass passen.", nail: "/img/nail-1.webp", photo: "/img/design-1.webp", price: { neu: "30 €", auffuellen: "25 €" }, gallery: "Natur" },
  { slug: "full-cover-farbe", name: "Full Cover Farbe", en: "Full Cover Color", tag: "Bold & Elegant", desc: "Intensive Farbe mit makellosem Hochglanz-Finish.", long: "Deckende Farbe über den ganzen Nagel – von Bordeaux bis Rosé – mit gleichmäßigem Hochglanz-Finish.", nail: "/img/nail-2.webp", photo: "/img/design-2.webp", price: { neu: "33 €", auffuellen: "27 €" }, gallery: "Full Cover Farbe" },
  { slug: "french", name: "French", en: "French Nails", tag: "The Classic", desc: "Zeitlose Eleganz mit perfekt definierten Spitzen.", long: "Der Klassiker: natürlicher Nagelgrund mit sauber gezogener weißer Spitze – auf Wunsch auch mit kleinem Akzent.", nail: "/img/nail-3.webp", photo: "/img/design-3.webp", price: { neu: "35 €", auffuellen: "33 €" }, gallery: "French" },
  { slug: "babyboomer", name: "Babyboomer", en: "Babyboomer Style", tag: "Soft & Romantic", desc: "Sanfter Verlauf von Rosé bis zu cremigem Weiß.", long: "Ein weicher Verlauf von Rosé zu cremigem Weiß – romantisch, dezent und besonders harmonisch.", nail: "/img/nail-4.webp", photo: "/img/design-4.webp", price: { neu: "35 €", auffuellen: "33 €" }, gallery: "Babyboomer" },
  { slug: "cat-eye", name: "Cat Eye", en: "Cat Eye Effect", tag: "Magnetic Glow", desc: "Faszinierende Lichtreflexe mit schimmernder Tiefe.", long: "Ein magnetischer Effekt, der wie eine Katzenaugen-Linie im Licht schimmert und dem Nagel Tiefe gibt.", nail: "/img/nail-5.webp", photo: "/img/design-5.webp", price: { neu: "37 €", auffuellen: "35 €" }, gallery: "Cat Eye" },
  { slug: "chrome", name: "Chrome", en: "Chrome Effect", tag: "Modern Statement", desc: "Spiegelnder Metallic-Look für einen besonderen Auftritt.", long: "Spiegelnder Metallic-Look in Rosé-Gold – ein moderner Statement-Nagel für besondere Auftritte.", nail: "/img/nail-6.webp", photo: "/img/design-6.webp", price: { neu: "37 €", auffuellen: "35 €" }, gallery: "Chrome" },
  { slug: "weihnachten", name: "Weihnachten", en: "Christmas Nails", tag: "Festive & Hand-Painted", desc: "Rot-grüne French-Spitzen, Schneeflocken und 3D-Poinsettia.", long: "Festlich bis in die Fingerspitzen: sheer Nude mit tiefroter oder grüner French-Spitze, Goldfolie, handgemalte Schneeflocken und eine plastische 3D-Poinsettia aus Gel mit Goldperlen.", nail: "/img/nail-7.webp", photo: "/img/design-1.webp", price: { neu: "auf Anfrage", auffuellen: "auf Anfrage" }, gallery: "Nail Art" },
  { slug: "ombre-strass", name: "Ombré Strass", en: "Ombré Rhinestone", tag: "Glam & Sparkle", desc: "Rosé-Ombré mit funkelnden AB-Strasssteinen und 3D-Blüte.", long: "Zarter Verlauf von Rosé zu cremigem Weiß, eingerahmt von funkelnden AB-Strasssteinen und – auf Wunsch – mit plastischer 3D-Gelblüte.", nail: "/img/nail-8.webp", photo: "/img/design-4.webp", price: { neu: "auf Anfrage", auffuellen: "auf Anfrage" }, gallery: "Nail Art" },
  { slug: "blood-stiletto", name: "Blood Stiletto", en: "Blood Stiletto", tag: "Dark & Dramatic", desc: "Spitze Stiletto-Form mit Blutstropfen und Spritzern.", long: "Statement für Mutige: milchig-lavendelfarbener Grund, tiefrote Spitze mit realistisch laufenden Blutstropfen und feinen Spritzern auf spitzer Stiletto-Form.", nail: "/img/nail-9.webp", photo: "/img/design-5.webp", price: { neu: "auf Anfrage", auffuellen: "auf Anfrage" }, gallery: "Nail Art" },
];

export const getNail = (slug: string) => nails.find((n) => n.slug === slug);
