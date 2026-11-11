"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { priceGroups } from "@/config/prices";
import BookingCTA from "./BookingCTA";

export default function PriceTable({ initial }: { initial?: string }) {
  const start = Math.max(0, priceGroups.findIndex((g) => g.id === initial));
  const [i, setI] = useState(start);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // ?tab=… aus der URL (Leistungs-Karten, Schnellnavigation) – reagiert auch bei Klick auf derselben Seite
  const tab = useSearchParams().get("tab");
  useEffect(() => {
    const idx = priceGroups.findIndex((g) => g.id === tab);
    if (idx >= 0) setI(idx);
  }, [tab]);

  const onKey = (e: React.KeyboardEvent) => {
    const n = priceGroups.length;
    let to = i;
    if (e.key === "ArrowRight") to = (i + 1) % n;
    else if (e.key === "ArrowLeft") to = (i - 1 + n) % n;
    else return;
    e.preventDefault();
    setI(to);
    refs.current[to]?.focus();
  };

  const g = priceGroups[i];
  const three = g.heads.length === 3;

  return (
    <div id="preise">
      <div className="tabs" role="tablist" aria-label="Preisliste" onKeyDown={onKey}>
        {priceGroups.map((p, k) => (
          <button
            key={p.id}
            ref={(el) => { refs.current[k] = el; }}
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={i === k}
            aria-controls={`panel-${p.id}`}
            tabIndex={i === k ? 0 : -1}
            className="pill pg-pill"
            onClick={() => setI(k)}
          >
            {p.tab}
          </button>
        ))}
      </div>
      <div className="price-card pg-card" role="tabpanel" id={`panel-${g.id}`} aria-labelledby={`tab-${g.id}`}>
        <h3>{g.title}</h3>
        <table className={`ptable ${three ? "three" : ""}`}>
          <thead>
            <tr>
              {g.heads.map((h) => (
                <th key={h} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, k) => (
                  <td key={k}>
                    {c}
                    {three && k === 0 && (
                      <span className="m2">
                        Neu {r[1]} · Auffüllen {r[2]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="price-foot">
          <span>Alle Preise in Euro. Für besondere Designs beraten wir dich gern persönlich.</span>
          <BookingCTA variant="primary" label="Termin buchen" className="" />
        </div>
      </div>
    </div>
  );
}
