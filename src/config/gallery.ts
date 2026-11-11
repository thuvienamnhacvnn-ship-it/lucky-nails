// GALERIE — kind "real" = echte Arbeit (Foto), "studio" = echtes Studiofoto. Keine KI-Illustrationen.
export const galleryFilters = ["Alle", "Natur", "French", "Babyboomer", "Chrome", "Cat Eye", "Full Cover Farbe", "Studio"] as const;
export type GalleryFilter = (typeof galleryFilters)[number];

export type GalleryItem = {
  src: string;
  alt: string;
  cat: Exclude<GalleryFilter, "Alle">;
  kind: "real" | "illustration" | "studio";
  w: number;
  h: number;
};

const real = (n: number, alt: string, cat: GalleryItem["cat"], w: number, h: number): GalleryItem => ({
  src: `/img/real-${String(n).padStart(2, "0")}.webp`,
  alt,
  cat,
  kind: "real",
  w,
  h,
});

const pgx = (file: string, alt: string, w: number, h: number): GalleryItem => ({ src: `/img/pgx-${file}.webp`, alt, cat: "Studio", kind: "studio", w, h });
const studio = (file: string, alt: string, w: number, h: number): GalleryItem => ({ src: `/img/pg-${file}.webp`, alt, cat: "Studio", kind: "studio", w, h });

export const galleryItems: GalleryItem[] = [
  real(1, "French-Nägel mit Leoparden-Muster", "French", 828, 1472),
  real(2, "Bordeaux-Nägel mit weißen Schneeflocken", "Full Cover Farbe", 1254, 1600),
  real(3, "Nude-French in Braun mit Blumen-Akzent", "French", 1392, 1600),
  real(4, "French-Nägel mit Leoparden-Spitzen und rosa Akzent", "French", 1314, 1600),
  real(5, "Rote Nägel mit Herz- und Geweih-Design", "Full Cover Farbe", 1402, 1600),
  real(6, "French mit Zebra-Muster", "French", 1422, 1600),
  real(7, "Rote Nägel mit Punkten", "Full Cover Farbe", 828, 970),
  real(8, "Nude-Nägel mit Winter-Design in Hellblau", "Natur", 1416, 1600),
  real(9, "Weiße French-Nägel mit Gold-Akzent", "French", 828, 957),
  real(10, "Nude-Nägel mit feinen schwarzen Linien", "Natur", 1200, 1600),
  studio("studio-wide", "Blick durch das Studio mit Arbeitsplätzen und Nagellack-Wand", 1800, 1200),
  studio("lamps-portrait", "Studio mit Kupfer-Pendelleuchten und Kristallleuchter", 1000, 1500),
  studio("marble-portrait", "Empfangstresen vor der Marmorwand im Studio", 1000, 1500),
  studio("pedi-wide", "Zwei Pediküre-Stühle im Studio", 1500, 1000),
  studio("regal-portrait", "Geschwungene Regalwand mit Gel-Lacken", 1000, 1500),
  studio("work-portrait", "Maniküre am Arbeitsplatz mit Ringleuchte", 1000, 1500),
  studio("orchid-portrait", "Weiße Orchidee vor der Lack-Wand im Studio", 1000, 1500),
  studio("scissors-wide", "Nagelhautpflege bei der Maniküre", 1500, 1000),
  studio("produkte-wide", "Regalwand mit Gel-Lacken im Studio", 1500, 1000),
  pgx("fassade-wide", "Das Lucky Nails Studio an der Boxhagener Straße in Berlin-Friedrichshain", 1600, 1067),
  pgx("detail-hand", "Nagelpflege im Studio: Hände bei der Behandlung", 1500, 1000),
  pgx("detail-schale", "Maniküre mit Schale und Pflegeprodukten", 1500, 1000),
];

// Bento-Reihenfolge /studio (Hoch-/Querformat passend zu den Feldern)
const pick = (src: string) => galleryItems.find((g) => g.src.endsWith(src))!;
export const studioBento: GalleryItem[] = [
  "pg-lamps-portrait", "pg-pedi-wide", "pg-scissors-wide", "pg-studio-wide", "pg-produkte-wide", "pg-regal-portrait", "pgx-detail-hand", "pgx-detail-schale",
].map((n) => pick(`/${n}.webp`));

// Studio-Eindrücke (Mosaik auf /studio)
export const studioItems = galleryItems.filter((g) => g.kind === "studio");

export const realItems = galleryItems.filter((g) => g.kind === "real");
