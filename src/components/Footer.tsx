import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Navigation, Phone } from "lucide-react";
import { img } from "@/config/images";
import { footerNav, site } from "@/config/site";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "./Icons";

export default function Footer() {
  const addr = `${site.address.street}, ${site.address.zip} ${site.address.city}`;
  const tiles = [
    { href: site.mapsLink, icon: <MapPin size={22} aria-hidden />, k: "Adresse", v: addr, ext: true },
    { href: `tel:${site.phone.tel}`, icon: <Phone size={22} aria-hidden />, k: "Telefon", v: site.phone.display, ext: false },
    ...(site.whatsapp ? [{ href: site.whatsapp, icon: <WhatsAppIcon width={22} height={22} />, k: "WhatsApp", v: "Nachricht senden", ext: true }] : []),
    { href: site.tiktok.url, icon: <TikTokIcon width={22} height={22} />, k: "TikTok", v: `@${site.tiktok.handle}`, ext: true },
    ...(site.instagram ? [{ href: site.instagram, icon: <InstagramIcon width={22} height={22} />, k: "Instagram", v: "@lucky_nails2026", ext: true }] : []),
  ];
  return (
    <footer className="footer fz">
      <div className="fz-line" aria-hidden="true" />
      <div className="wrap">
        <div className="fz-top">
          <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="fz-map" aria-label={`Karte öffnen: ${addr}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/map-studio.webp" alt={`Karte: Lucky Nails, ${addr}`} width={960} height={480} loading="lazy" />
            <span className="fz-map-card">
              <Image src={img.logo} alt="" width={56} height={56} />
              <span><b>{site.name}</b><i>{addr}</i></span>
            </span>
            <span className="fz-map-btn"><Navigation size={18} aria-hidden /> Route planen</span>
            <span className="fz-credit">© OpenStreetMap-Mitwirkende</span>
          </a>

          <div className="fz-side">
            <div className="fz-book">
              <a href={site.booking} target="_blank" rel="noopener noreferrer" className="fz-qr" aria-label="QR-Code scannen: Termin online buchen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/qr-booking.svg" alt="QR-Code zur Online-Terminbuchung" width={150} height={150} loading="lazy" />
              </a>
              <div className="fz-book-txt">
                <span className="fz-eyebrow">Online buchen</span>
                <h3>Dein Termin in wenigen Klicks</h3>
                <p>QR-Code scannen oder direkt online buchen.</p>
                <a href={site.booking} target="_blank" rel="noopener noreferrer" className="fz-cta"><CalendarDays size={18} aria-hidden /> Termin buchen</a>
              </div>
            </div>
            <ul className="fz-tiles">
              {tiles.map((t) => (
                <li key={t.k}>
                  <a href={t.href} {...(t.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <span className="fz-ic">{t.icon}</span>
                    <span className="fz-tx"><b>{t.k}</b><i>{t.v}</i></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fz-bar">
          <Link href="/" className="fz-brand" aria-label="Lucky Nails – Startseite">
            <Image src={img.logo} alt="Lucky Nails Logo" width={72} height={72} />
            <span><b>Lucky Nails</b><i>{site.tagline}</i></span>
          </Link>
          <nav className="fz-nav" aria-label="Fußnavigation">
            {footerNav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          </nav>
          <nav className="fz-legal" aria-label="Rechtliches">
            <span>© {new Date().getFullYear()} Lucky Nails Berlin</span>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
