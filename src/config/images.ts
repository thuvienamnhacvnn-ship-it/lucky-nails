// BILDER — alle Pfade zentral. Neue Datei in public/img ablegen (oder per `npm run images` aus
// dem Originalordner erzeugen) und hier den Pfad ändern.
export const img = {
  logo: "/img/logo.webp",
  // Echte Studiofotos (DSC-nhe-chinh → public/img/pg-*.webp, siehe scripts/pg-images.mjs)
  welcome: "/img/pg-studio-wide.webp",
  studio: ["/img/pg-studio-hero.webp", "/img/pg-studio-wide.webp", "/img/pg-regal-portrait.webp", "/img/pg-team-wide.webp"],
  pedicure: "/img/pg-pedi-wide.webp",
  pedicure2: "/img/pg-pedi-portrait.webp",
  manicure: "/img/pg-manicure-wide.webp",
  modellage: "/img/pg-modellage-wide.webp",
  products: "/img/pg-produkte-wide.webp",
  products2: "/img/pg-regal2-portrait.webp",
  orchid: "/img/pg-orchid-portrait.webp",
  hygiene: "/img/pg-hygiene-wide.webp",
  team: "/img/pg-team-wide.webp",
  lounge: "/img/pg-lounge-portrait.webp",
  gutscheinFront: "/img/gutschein-vorne.webp",
  gutscheinBack: "/img/gutschein-hinten.webp",
  og: "/og.jpg",
} as const;
