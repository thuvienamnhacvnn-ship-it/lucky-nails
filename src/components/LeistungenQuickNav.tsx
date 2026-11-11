"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { priceGroups } from "@/config/prices";
import { site } from "@/config/site";

// Schnellnavigation: springt zur Preisliste und wählt den passenden Tab (?tab=…).
export default function LeistungenQuickNav() {
  const tab = useSearchParams().get("tab") ?? priceGroups[0].id;
  return (
    <nav className="pg-quick" aria-label="Schnellnavigation Leistungen">
      <div className="wrap pg-quick-in">
        {priceGroups.map((g) => (
          <Link key={g.id} href={`/leistungen?tab=${g.id}#preise`} className="pg-chip" aria-current={tab === g.id ? "true" : undefined}>
            {g.tab}
          </Link>
        ))}
        <a href={site.booking} target="_blank" rel="noopener noreferrer" className="pg-chip cta">
          Termin buchen
        </a>
      </div>
    </nav>
  );
}
