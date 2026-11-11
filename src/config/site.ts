// ZENTRALE KONFIG — Kontakt, Links, Promo. Hier ändern, nicht in den Komponenten.
export const site = {
  name: "Lucky Nails",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://luckynails.vip",
  tagline: "Dein Stil. Dein Lieblingslook.",
  services: "Maniküre · Pediküre · Nageldesign",
  address: { street: "Boxhagener Str. 19", zip: "10245", city: "Berlin", district: "Friedrichshain" },
  phone: { display: "0152 09666888", tel: "+4915209666888" },
  web: { display: "luckynails.vip", url: "https://luckynails.vip" },
  tiktok: { handle: "lucky.nails17", url: "https://www.tiktok.com/@lucky.nails17" },
  // [chờ Sếp gửi] — nur eintragen, wenn bestätigt. null = Icon/Button wird NICHT angezeigt.
  whatsapp: "https://wa.me/4915209666888" as string | null, // Hotline des Studios (Chef 10.11.)
  instagram: "https://www.instagram.com/lucky_nails2026" as string | null,
  email: null as string | null,
  // [chờ Sếp gửi] — Öffnungszeiten nur eintragen, wenn bestätigt. Format: [["Mo–Fr", "10:00–20:00"], ...]
  hours: null as [string, string][] | null,
  booking: "https://beprobooking.com/salon/Lucky-Nails-55",
  checkin: "https://beprobooking.com/me/salon/Lucky-Nails-55/checkin",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Boxhagener+Str.+19%2C+10245+Berlin",
};

// PROMO — an/aus + Zeitraum. Nach dem Enddatum verschwindet die Karte automatisch.
export const promo = {
  enabled: true,
  start: "2026-11-01",
  end: "2026-11-30",
  kicker: "Im November:",
  big: "30 % Rabatt",
  line: "auf alle Nageldesigns.",
};

export function isPromoActive(now = new Date()) {
  if (!promo.enabled) return false;
  const s = new Date(`${promo.start}T00:00:00+01:00`);
  const e = new Date(`${promo.end}T23:59:59+01:00`);
  return now >= s && now <= e;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/galerie", label: "Galerie" },
  { href: "/booking", label: "Booking" },
  { href: "/studio", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const footerNav = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen & Preise" },
  { href: "/nail-designs", label: "Nail Designs" },
  { href: "/galerie", label: "Galerie" },
  { href: "/studio", label: "Studio & Team" },
  { href: "/booking", label: "Online Booking" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/gutscheine", label: "Gutscheine" },
] as const;
