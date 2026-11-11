import type { MetadataRoute } from "next";
import { nails } from "@/config/nails";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/leistungen", "/nail-designs", "/galerie", "/studio", "/booking", "/kontakt", "/gutscheine", "/impressum", "/datenschutz", ...nails.map((n) => `/nail-designs/${n.slug}`)];
  return pages.map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p.startsWith("/nail-designs/") ? 0.6 : 0.8,
  }));
}
