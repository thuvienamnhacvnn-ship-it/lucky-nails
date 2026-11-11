import { serviceCards } from "@/config/services";
import { priceGroups } from "@/config/prices";
import { PgxTile } from "./Pgx";

// "ab XX €" nur aus src/config/prices (Flyer).
function fromPrice(id: string) {
  const g = priceGroups.find((p) => p.id === id);
  if (!g) return undefined;
  const nums = g.rows
    .map((r) => r[1])
    .filter((v) => /\d/.test(v))
    .map((v) => ({ v, n: parseFloat(v.replace(",", ".")) }));
  if (!nums.length) return undefined;
  return `ab ${nums.sort((a, b) => a.n - b.n)[0].v}`;
}

// Bento-Layout: eine große Kachel links, rechts breite + zwei kleine Kacheln.
const layout = ["s-big", "s-wide", "s-sm", "s-sm"];

export function ServiceCard({ s, i = 0 }: { s: (typeof serviceCards)[number]; i?: number }) {
  return <PgxTile i={i} cls={layout[i] ?? "s-sm"} href={`/leistungen?tab=${s.tab}#preise`} src={s.img} alt={`${s.title} im Lucky Nails Studio`} title={s.title} sub={s.desc} pill={fromPrice(s.id)} />;
}

export default function ServiceGrid() {
  return (
    <div className="pgx-bento pgx-svc">
      {serviceCards.map((s, i) => (
        <ServiceCard key={s.id} s={s} i={i} />
      ))}
    </div>
  );
}
