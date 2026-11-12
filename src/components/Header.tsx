"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Ellipsis, House, Images, Menu, Navigation, Sparkles, X } from "lucide-react";
import { img } from "@/config/images";
import { nav, site } from "@/config/site";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "./Icons";
import MobileNavigation from "./MobileNavigation";

export function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(href + "/");
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`soc ${className}`}>
      {site.whatsapp && (
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <WhatsAppIcon />
        </a>
      )}
      {site.instagram && (
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <InstagramIcon />
        </a>
      )}
      <a href={site.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok @lucky.nails17">
        <TikTokIcon />
      </a>
    </div>
  );
}

export default function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
        <div className="hdr-in">
          <Link href="/" className="logo" aria-label="Lucky Nails – Startseite">
            <Image src={img.logo} alt="Lucky Nails Logo" width={300} height={300} priority sizes="150px" />
          </Link>
          <Link href="/" className="hdr-logo-hit" aria-label="Lucky Nails – Startseite" tabIndex={-1} />
          <nav className="nav" aria-label="Hauptnavigation">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={isActive(path, n.href) ? "active" : ""} aria-current={isActive(path, n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <nav className="apptabs" aria-label="App-Navigation">
            {[
              { href: "/", label: "Home", icon: <House size={22} strokeWidth={1.7} /> },
              { href: "/leistungen", label: "Leistungen", icon: <Sparkles size={22} strokeWidth={1.7} /> },
              { href: "/galerie", label: "Galerie", icon: <Images size={22} strokeWidth={1.7} /> },
              { href: "/booking", label: "Booking", icon: <CalendarDays size={22} strokeWidth={1.7} /> },
            ].map((t) => (
              <Link key={t.href} href={t.href} className={isActive(path, t.href) ? "on" : ""} aria-current={isActive(path, t.href) ? "page" : undefined}>
                {t.icon}<span>{t.label}</span>
              </Link>
            ))}
            <button type="button" className={open ? "on" : ""} aria-expanded={open} aria-label={open ? "Menü schließen" : "Mehr Menü öffnen"} onClick={() => setOpen((v) => !v)}>
              {open ? <X size={22} strokeWidth={1.7} /> : <Ellipsis size={22} strokeWidth={1.7} />}<span>Mehr</span>
            </button>
          </nav>
          <div className="hdr-right">
            <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="hdr-route" aria-label="Route zum Studio planen (Google Maps)">
              <Navigation size={18} strokeWidth={1.6} aria-hidden /> <span>Route</span>
            </a>
            <a href={site.booking} target="_blank" rel="noopener noreferrer" className="hdr-qr" aria-label="QR-Code: Online-Termin buchen">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/qr-booking.svg" alt="QR-Code zur Online-Terminbuchung" width={120} height={120} />
              <span className="hdr-qr-pop">Scannen &amp; Termin buchen</span>
            </a>
            <a href={site.booking} target="_blank" rel="noopener noreferrer" className="hdr-cta">
              <CalendarDays size={20} strokeWidth={1.6} aria-hidden /> Termin buchen
            </a>
            <a href={site.booking} target="_blank" rel="noopener noreferrer" className="hdr-mini">
              Termin
            </a>
            <button className="burger" aria-label={open ? "Menü schließen" : "Menü öffnen"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation open={open} onClose={() => setOpen(false)} />
    </>
  );
}
