"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { priceGroups, priceTabs, type PriceGroup } from "@/config/prices";
import { lashLooks, lashExtras } from "@/config/prices-wimpern";
import BookingCTA from "./BookingCTA";

// Preisliste als Luxus-Menü (echter Text) mit Reitern: Tipp auf einen Bereich zeigt nur dessen Preise.
// Nägel = Flyer (config/prices.ts), Wimpern & Brauen = config/prices-wimpern.ts.
const g = (id: PriceGroup["id"]) => priceGroups.find((x) => x.id === id)!;
const label = (s: string) => s.replace(" / ", ", ");

function Ribbon({ children }: { children: string }) {
  return (
    <h3 className="pl-ribbon">
      <span>{children}</span>
    </h3>
  );
}

function Row({ name, price }: { name: string; price: string }) {
  const m = name.match(/^(.*?)\s*\((.*)\)$/);
  const ask = price.startsWith("auf");
  return (
    <li className="pl-row">
      <span className="pl-name">
        {m ? m[1] : label(name)}
        {m && <small>({m[2]})</small>}
      </span>
      <span className={`pl-price${ask ? " ask" : ""}`}>
        {ask
          ? "bitte Nachfrage"
          : price.split("/").map((pp, k) => {
              const [n, o] = pp.split("|");
              return (
                <span key={k} className="pl-pp">
                  {k > 0 && <em className="pl-sl">/</em>}
                  {o && <s className="pl-old">{o.replace(" €", "€")}</s>}
                  <b className="pl-new">{n.replace(" €", "€")}</b>
                </span>
              );
            })}
      </span>
    </li>
  );
}

function Block({ head, rows }: { head: string; rows: [string, string][] }) {
  return (
    <section className="pl-block" aria-label={head}>
      <Ribbon>{head.toUpperCase()}</Ribbon>
      <ul>
        {rows.map((r) => (
          <Row key={r[0]} name={r[0]} price={r[1]} />
        ))}
      </ul>
    </section>
  );
}

// Zeilen einer Flyer-Gruppe, Spalte c -> [Name, Preis]
const col = (id: PriceGroup["id"], c: number): [string, string][] => g(id).rows.map((r) => [r[0], r[c]]);

function Panel({ id }: { id: string }) {
  const L = lashLooks;
  switch (id) {
    case "nagelmodellage":
      return (
        <div className="pl-grid two">
          <Block head="Neumodellage" rows={col("nagelmodellage", 1)} />
          <Block head="Auffüllen" rows={col("nagelmodellage", 2)} />
        </div>
      );
    case "maniküre":
      return (
        <div className="pl-grid one">
          <Block head="Maniküre" rows={col("maniküre", 1)} />
        </div>
      );
    case "pediküre":
      return (
        <div className="pl-grid one">
          <Block head="Pediküre" rows={col("pediküre", 1)} />
        </div>
      );
    case "addons":
      return (
        <div className="pl-grid one">
          <Block head="Add-ons" rows={col("addons", 1)} />
        </div>
      );
    default:
      return (
        <>
          <div className="pl-grid two">
            <Block head={L[0].title} rows={L[0].rows} />
            <Block head={L[1].title} rows={L[1].rows} />
          </div>
          <div className="pl-grid two">
            <Block head={L[2].title} rows={L[2].rows} />
            <Block head={L[3].title} rows={L[3].rows} />
          </div>
          <div className="pl-grid one">
            <Block head={L[4].title} rows={L[4].rows} />
          </div>
          <div className="pl-grid one">
            <Block head="Weitere Leistungen & Brauen" rows={lashExtras} />
          </div>
        </>
      );
  }
}

export default function PreislisteMenu() {
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = useSearchParams().get("tab");

  // ?tab=... (Leistungs-Kacheln, Schnellnavigation) waehlt den Reiter
  useEffect(() => {
    const idx = priceTabs.findIndex((t) => t.id === tab);
    if (idx >= 0) setI(idx);
  }, [tab]);

  const pick = (k: number) => {
    setI(k);
    try {
      history.replaceState(null, "", `?tab=${priceTabs[k].id}#preise`);
    } catch {}
  };
  const onKey = (e: React.KeyboardEvent) => {
    const n = priceTabs.length;
    let to = i;
    if (e.key === "ArrowRight") to = (i + 1) % n;
    else if (e.key === "ArrowLeft") to = (i - 1 + n) % n;
    else return;
    e.preventDefault();
    pick(to);
    refs.current[to]?.focus();
  };

  const cur = priceTabs[i];
  return (
    <div id="preise" className="pl-wrap">
      <article className="pl-card" aria-label="Preisliste Lucky Nails Berlin">
        <span className="pl-veins" aria-hidden />
        <header className="pl-head">
          <span className="pl-medal">
            <Image src="/img/logo.webp" alt="Lucky Nails" width={190} height={190} priority={false} />
          </span>
          <h2 className="pl-title">Preisliste</h2>
          <p className="pl-addr">LUCKY NAILS · Boxhagener Str. 19 · 10245 Berlin · 0152 09666888</p>
          <span className="pl-orn" aria-hidden>
            <i />
            <b>❦</b>
            <i />
          </span>
        </header>

        <div className="pl-tabs" role="tablist" aria-label="Preisliste Bereiche" onKeyDown={onKey}>
          {priceTabs.map((t, k) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[k] = el;
              }}
              role="tab"
              type="button"
              id={`pl-tab-${t.id}`}
              aria-selected={i === k}
              aria-controls="pl-panel"
              tabIndex={i === k ? 0 : -1}
              className="pl-tab"
              onClick={() => pick(k)}
            >
              {t.tab}
            </button>
          ))}
        </div>

        <div key={cur.id} className="pl-panel" role="tabpanel" id="pl-panel" aria-labelledby={`pl-tab-${cur.id}`}>
          <Panel id={cur.id} />
        </div>

        <footer className="pl-foot">
          <span className="pl-orn" aria-hidden>
            <i />
            <b>❦</b>
            <i />
          </span>
          <p>
            <strong>Lucky Nails · Boxhagener Str. 19 · 10245 Berlin</strong>
          </p>
          <p>Alle Preise in Euro inkl. Beratung &amp; Aftercare-Tipps · Fremdarbeit = zuvor in einem anderen Studio gesetzt</p>
          <BookingCTA />
        </footer>
      </article>
    </div>
  );
}
