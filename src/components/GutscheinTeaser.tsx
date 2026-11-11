import GutscheinFlip from "./GutscheinFlip";
import Link from "next/link";
import { Phone } from "lucide-react";
import { img } from "@/config/images";
import { site } from "@/config/site";

export default function GutscheinTeaser() {
  return (
    <GutscheinFlip front={img.gutscheinFront} back={img.gutscheinBack}>
      <div className="gsf-copy">
        <h2>Geschenkgutschein</h2>
        <p>Schenke Zeit für schöne Nägel. Unser Lucky-Nails-Gutschein ist im Studio erhältlich – frag einfach nach, wir beraten dich gern.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn btn-wine" href={site.whatsapp ?? `tel:${site.phone.tel}`} {...(site.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <Phone size={20} aria-hidden /> Gutschein anfragen
          </a>
          <Link href="/gutscheine" className="btn btn-ghost-ivory" style={{ height: 52 }}>
            Mehr erfahren
          </Link>
        </div>
      </div>
    </GutscheinFlip>
  );
}
