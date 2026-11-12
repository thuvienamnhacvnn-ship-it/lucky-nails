import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingCTA from "@/components/BookingCTA";
import { nailStill } from "@/components/NailDesignGrid";
import PgxFx from "@/components/PgxFx";
import RealGrid from "@/components/RealGrid";
import SectionHead from "@/components/SectionHead";
import { galleryItems } from "@/config/gallery";
import { getNail, nails } from "@/config/nails";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return nails.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNail(slug);
  if (!n) return {};
  return pageMeta(`${n.name} Nails – ${n.en}`, `${n.long} ${n.price.neu.startsWith("auf") ? "Preis auf Anfrage" : `Neumodellage ab ${n.price.neu}`}. Jetzt Termin bei Lucky Nails Berlin buchen.`, `/nail-designs/${n.slug}`, nailStill(n.nail));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getNail(slug);
  if (!n) notFound();
  const related = galleryItems.filter((g) => g.cat === n.gallery && g.kind === "real");
  const others = nails.filter((o) => o.slug !== n.slug);
  const at = nails.findIndex((o) => o.slug === n.slug);
  const prev = nails[(at - 1 + nails.length) % nails.length];
  const next = nails[(at + 1) % nails.length];

  return (
    <>
      <PgxFx />
      <section className="on-dark" style={{ padding: "56px 0 80px" }}>
        <div className="wrap">
          <nav className="pg-crumbs" aria-label="Brotkrumen">
            <Link href="/">Start</Link> <span aria-hidden>›</span> <Link href="/nail-designs">Nail Designs</Link> <span aria-hidden>›</span> <span aria-current="page">{n.name}</span>
          </nav>
          <div className="nd-detail">
            <div className="pic pgx-stage">
              <Image src={nailStill(n.nail)} alt={`${n.name} Nageldesign als 3D-Rendering`} fill priority sizes="(max-width: 1023px) 100vw, 600px" />
            </div>
            <div>
              <h1>{n.name}</h1>
              <p className="en">{n.en} · {n.tag}</p>
              <p className="d">{n.long}</p>
              <div className="price-chips" aria-label="Preise (Nagelmodellage)">
                <div className="chip"><small>Neumodellage</small><b>{n.price.neu}</b></div>
                <div className="chip"><small>Auffüllen</small><b>{n.price.auffuellen}</b></div>
              </div>
              <BookingCTA variant="primary" label="Termin buchen" />
              <p className="note" style={{ marginTop: 16 }}>Preise für Nagelmodellage mit diesem Stil. Individuelle Designs auf Anfrage.</p>
            </div>
          </div>
          <div className="pg-pager">
            <Link href={`/nail-designs/${prev.slug}`} aria-label={`Vorheriges Design: ${prev.name}`}>
              <small>‹ Vorheriges</small>
              <b>{prev.name}</b>
            </Link>
            <Link href={`/nail-designs/${next.slug}`} className="nx" aria-label={`Nächstes Design: ${next.name}`}>
              <small>Nächstes ›</small>
              <b>{next.name}</b>
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section on-ivory" aria-labelledby="rel-h">
          <div className="wrap">
            <SectionHead id="rel-h" eyebrow="Aus unserem Studio" title={`Echte Arbeiten: ${n.name}`} />
            <RealGrid items={related} />
          </div>
        </section>
      )}

      <section className="section on-dark" aria-labelledby="more-h">
        <div className="wrap">
          <SectionHead id="more-h" eyebrow="Entdecken" title="Weitere Designs" />
          <div className="nd-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))" }}>
            {others.map((o) => (
              <Link key={o.slug} href={`/nail-designs/${o.slug}`} className="nd-card">
                <div className="nd-img pgx-stage">
                  <Image src={nailStill(o.nail)} alt={`${o.name} Nageldesign`} fill sizes="(max-width: 767px) 50vw, 200px" />
                </div>
                <h3>{o.name}</h3>
                <small>{o.tag}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
