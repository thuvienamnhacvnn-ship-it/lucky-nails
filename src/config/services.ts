import { img } from "./images";

export const serviceCards = [
  { id: "nagelmodellage", tab: "nagelmodellage", title: "Nagelmodellage", desc: "Kreative Designs nach deinem Stil", img: img.modellage },
  { id: "maniküre", tab: "maniküre", title: "Maniküre", desc: "Gepflegte Hände und schöne Nägel", img: img.manicure },
  { id: "pediküre", tab: "pediküre", title: "Pediküre", desc: "Wohlfühlpflege für gesunde Füße", img: img.pedicure },
  { id: "addons", tab: "addons", title: "Nail Art", desc: "Steinchen & individuelle Akzente", img: "/img/real-05.webp" },
] as const;
