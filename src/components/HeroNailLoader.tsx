"use client";

import dynamic from "next/dynamic";

// three.js nur im Browser laden (kein SSR); bis dahin bleibt der Platz leer.
const HeroNail3D = dynamic(() => import("./HeroNail3D"), { ssr: false });

export default function HeroNailLoader() {
  return <HeroNail3D />;
}
