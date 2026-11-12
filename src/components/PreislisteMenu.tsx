import Image from "next/image";
import { priceGroups, type PriceGroup } from "@/config/prices";
import BookingCTA from "./BookingCTA";

// Preisliste als Luxus-Menü (echter Text, keine Bildvorlage): Marmor-Elfenbein, schwarze Rautenbänder mit Goldschrift.
// Daten kommen ausschliesslich aus config/prices.ts (= Flyer).
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
      <span className={`pl-price${ask ? " ask" : ""}`}>{ask ? "bitte Nachfrage" : price.replace(" €", "€")}</span>
    </li>
  );
}

function Block({ id, col, head }: { id: PriceGroup["id"]; col: number; head?: string }) {
  const grp = g(id);
  return (
    <section className="pl-block" aria-label={head ?? grp.title}>
      <Ribbon>{(head ?? grp.title).toUpperCase()}</Ribbon>
      <ul>
        {grp.rows.map((r) => (
          <Row key={r[0]} name={r[0]} price={r[col]} />
        ))}
      </ul>
    </section>
  );
}

export default function PreislisteMenu() {
  return (
    <div id="preise" className="pl-wrap">
      <article className="pl-card" aria-label="Preisliste Lucky Nails Berlin">
        <span className="pl-veins" aria-hidden />
        <header className="pl-head">
          <span className="pl-medal">
            <Image src="/img/logo.webp" alt="Lucky Nails" width={190} height={190} priority={false} />
          </span>
          <h2 className="pl-title">Preisliste</h2>
          <span className="pl-orn" aria-hidden>
            <i /><b>❦</b><i />
          </span>
        </header>

        <div className="pl-grid two">
          <Block id="nagelmodellage" col={1} head="Neumodellage" />
          <Block id="nagelmodellage" col={2} head="Auffüllen" />
        </div>
        <div className="pl-grid two">
          <Block id="maniküre" col={1} />
          <Block id="pediküre" col={1} />
        </div>
        <div className="pl-grid one">
          <Block id="addons" col={1} head="Add-ons" />
        </div>

        <footer className="pl-foot">
          <span className="pl-orn" aria-hidden>
            <i /><b>❦</b><i />
          </span>
          <p>Alle Preise in Euro · Termin bequem online buchen</p>
          <BookingCTA />
        </footer>
      </article>
    </div>
  );
}
