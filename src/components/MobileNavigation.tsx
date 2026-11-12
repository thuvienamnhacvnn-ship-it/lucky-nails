"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronRight, Gift, House, Images, MapPin, Palette, Phone, Sparkles, Store } from "lucide-react";
import { nav, site } from "@/config/site";

const ICON: Record<string, React.ReactNode> = {
  "/": <House size={22} strokeWidth={1.6} />, "/leistungen": <Sparkles size={22} strokeWidth={1.6} />, "/galerie": <Images size={22} strokeWidth={1.6} />,
  "/booking": <CalendarDays size={22} strokeWidth={1.6} />, "/studio": <Store size={22} strokeWidth={1.6} />, "/kontakt": <MapPin size={22} strokeWidth={1.6} />,
  "/nail-designs": <Palette size={22} strokeWidth={1.6} />, "/gutscheine": <Gift size={22} strokeWidth={1.6} />,
};
const items = [...nav, { href: "/nail-designs", label: "Nail Designs" }, { href: "/gutscheine", label: "Gutscheine" }];
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "./Icons";

export default function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Route gewechselt -> schließen
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a,button");
        if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", key); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="drawer-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose} />
          <motion.div
            ref={panel}
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.17, 0.82, 0.3, 1] }}
          >
            <nav className="drawer-grid" aria-label="Mobile Navigation">
              {items.map((n) => {
                const act = n.href === "/" ? path === "/" : path.startsWith(n.href);
                return (
                  <Link key={n.href} href={n.href} className={act ? "active" : ""} aria-current={act ? "page" : undefined}>
                    <span className="dg-ic">{ICON[n.href]}</span>
                    <span className="dg-tx">{n.label}</span>
                    <ChevronRight size={18} strokeWidth={1.6} className="dg-ch" aria-hidden />
                  </Link>
                );
              })}
            </nav>
            <div className="drawer-foot">
              <a className="btn btn-primary btn-block" href={site.booking} target="_blank" rel="noopener noreferrer">
                <CalendarDays size={20} strokeWidth={1.7} aria-hidden /> Termin online buchen
              </a>
              <div className="soc">
                {site.whatsapp && <a href={site.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /></a>}
                {site.instagram && <a href={site.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>}
                <a href={site.tiktok.url} aria-label="TikTok" target="_blank" rel="noopener noreferrer"><TikTokIcon /></a>
              </div>
              <address>
                {site.address.street}, {site.address.zip} {site.address.city}
                <br />
                <a href={`tel:${site.phone.tel}`}><Phone size={14} aria-hidden /> {site.phone.display}</a>
              </address>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
