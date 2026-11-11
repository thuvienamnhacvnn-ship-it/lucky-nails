import type { Metadata } from "next";
import { site } from "@/config/site";
import { img } from "@/config/images";

export function pageMeta(title: string, description: string, path: string, image: string = img.og): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name} Berlin`,
      description,
      url: path,
      siteName: site.name,
      locale: "de_DE",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "Lucky Nails Berlin" }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [image] },
  };
}

// Nur bestätigte Daten. Keine Öffnungszeiten, keine Geodaten, solange nichts bestätigt ist.
export function localBusinessJsonLd() {
  const sameAs = [site.tiktok.url, site.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: site.name,
    url: site.url,
    image: `${site.url}${img.og}`,
    telephone: site.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressCountry: "DE",
    },
    sameAs,
    ...(site.hours
      ? {
          openingHours: site.hours.map(([d, t]) => `${d} ${t}`),
        }
      : {}),
  };
}
