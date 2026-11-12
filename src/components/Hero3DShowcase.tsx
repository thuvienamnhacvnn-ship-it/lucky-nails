import Link from "next/link";
import { ChevronRight, MapPin, Phone } from "lucide-react";
import BookingCTA from "./BookingCTA";
import HeroNailLoader from "./HeroNailLoader";
import HeroModeToggle from "./HeroModeToggle";
import { site } from "@/config/site";

// Hero nach Vorlage: Raumbild Tag/Nacht (zwei statische Bilder, Schalter im Banner), 3D-Nagel schwebt im Raum, Kategorien links, Design Galerie unten (Layout nach Entwurf 4).
export default function Hero3DShowcase() {
  return (
    <section className="hero" data-mode="day" aria-label="Lucky Nails Berlin">
      <h1 className="sr-only">Lucky Nails Berlin – Maniküre · Pediküre · Nageldesign</h1>
      <div className="hero-art">
        <div className="bg-wrap">
          {/* eslint-disable @next/next/no-img-element */}
          <img className="bg bg-day" src="/img/salon-day.webp" alt="" width={2560} height={1440} fetchPriority="high" />
          <img className="bg bg-alt bg-alt-1" src="/img/salon-day-2.webp" alt="" width={2560} height={1440} loading="lazy" />
          <img className="bg bg-alt bg-alt-2" src="/img/salon-day-3.webp" alt="" width={2560} height={1440} loading="lazy" />
          <img className="bgm bgm-day" src="/img/m/home-day.webp?v=3" alt="" width={1024} height={1536} fetchPriority="high" />
          <img className="bgm bgm-night" src="/img/m/home-night.webp?v=3" alt="" width={1024} height={1536} loading="lazy" />
          <img className="bg bg-night" src="/img/salon-night.webp" alt="" width={1920} height={1081} />
          {/* Weihnachts-Saison: gedimmter Raum, Baum + Lichterketten (LEDs funkeln im Video). Zum Abschalten diese 4 Zeilen entfernen. */}
          <img className="bg bg-xmas" src="/img/salon-xmas.webp?v=1" alt="" width={1920} height={1080} />
          <video className="bg bg-xmas-vid" src="/video/xmas-desktop.mp4" poster="/img/salon-xmas.webp?v=1" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
          <img className="bgm bgm-xmas" src="/img/m/home-xmas.webp?v=1" alt="" width={1024} height={1536} />
          <video className="bgm bgm-xmas-vid" src="/video/xmas-mobile.mp4" poster="/img/m/home-xmas.webp?v=1" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
          {/* eslint-enable @next/next/no-img-element */}
          <HeroNailLoader />
          <div className="hero-info">
            <span className="hi-line" aria-hidden="true" />
            <a href={`tel:${site.phone.tel}`} className="hi-item">
              <span className="hi-ico"><Phone size={20} strokeWidth={1.6} aria-hidden /></span>
              Hotline: {site.phone.display}
            </a>
            <span className="hi-sep" aria-hidden="true" />
            <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="hi-item">
              <span className="hi-ico"><MapPin size={20} strokeWidth={1.6} aria-hidden /></span>
              {site.address.street} · {site.address.zip} {site.address.city}
            </a>
            <span className="hi-line" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="hero-ui" />
      <HeroModeToggle />
      <div className="hero-cta-m">
        <BookingCTA variant="primary" label="Termin online buchen" />
        <Link href="/nail-designs" className="btn btn-outline">
          Designs entdecken <ChevronRight size={18} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
