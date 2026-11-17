import Image from "next/image";
import { lashLooks, lashExtras } from "@/config/prices-wimpern";
import BookingCTA from "./BookingCTA";

// Preisliste als Luxus-Menü (echter Text, keine Bildvorlage): Marmor-Elfenbein, schwarze Rautenbänder mit Goldschrift.
// Daten kommen ausschliesslich aus config/prices.ts (= Flyer).
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
        {ask ? "bitte Nachfrage" : price.split("/").map((pp, k) => {
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

export default function PreislisteMenu() {
  const L = lashLooks;
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
            <i /><b>❦</b><i />
          </span>
        </header>

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
          <Block head="Weitere Leistungen & Design-Aufpreise" rows={lashExtras} />
        </div>

        <footer className="pl-foot">
          <span className="pl-orn" aria-hidden>
            <i /><b>❦</b><i />
          </span>
          <p><strong>Lucky Nails · Boxhagener Str. 19 · 10245 Berlin</strong></p>
          <p>Alle Preise in Euro inkl. Beratung &amp; Aftercare-Tipps · Fremdarbeit = zuvor in einem anderen Studio gesetzt</p>
          <BookingCTA />
        </footer>
      </article>
    </div>
  );
}
