import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// Bausteine des Unterseiten-Neuaufbaus (pgx): Hero, Marquee, Zähler, Schritte, Kachel.
const d = (i: number, step = 80): CSSProperties => ({ "--d": `${i * step}ms` }) as CSSProperties;

export function PgxHero({ src, mobile, mobilePos, alt, pos = "50% 50%", video, alts, eyebrow, title, sub, children }: { src: string; mobile?: string; mobilePos?: string; alt: string; pos?: string; video?: string; alts?: string[]; eyebrow?: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <section className="pgx-hero">
      <div className={`pgx-hero-bg${mobile ? " has-m" : ""}`} data-par="0.16">
        {mobile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pgx-mob" src={mobile} alt={alt} width={1024} height={1536} fetchPriority="high" style={mobilePos ? { objectPosition: mobilePos } : undefined} />
        )}
        <Image src={src} alt={alt} fill priority sizes="100vw" quality={80} style={{ objectPosition: pos }} />
        {!video && alts?.map((a, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={a} className="pgx-alt" src={a} alt="" loading="lazy" style={{ animationDelay: `${3 + i * 6}s`, objectPosition: pos }} />
        ))}
        {video && (
          <video className="pgx-hero-video" src={video} poster={src} autoPlay muted loop playsInline preload="auto" aria-hidden="true" style={{ objectPosition: pos }} />
        )}
      </div>
      <div className="wrap pgx-hero-in">
        <div className="pgx-panel" data-r>
          {eyebrow && <span className="pg-eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          <span className="pgx-line" aria-hidden="true" />
          {sub && <p>{sub}</p>}
          {children}
        </div>
        <span className="pgx-scroll" aria-hidden="true">
          <i />
        </span>
      </div>
    </section>
  );
}

export function PgxMarquee({ items }: { items: string[] }) {
  const group = (hidden: boolean) => (
    <div className="pgx-mq-g" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
  return (
    <div className="pgx-mq" role="presentation">
      <div className="pgx-mq-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

export function PgxStats({ items }: { items: { n: number; l: string }[] }) {
  return (
    <div className="pgx-stats">
      {items.map((s, i) => (
        <div key={s.l} className="pgx-stat" data-r style={d(i)}>
          <b data-count={s.n}>{s.n}</b>
          <span>{s.l}</span>
        </div>
      ))}
    </div>
  );
}

export function PgxSteps({ steps }: { steps: { h: string; p?: string }[] }) {
  return (
    <ol className="pgx-steps4" data-r>
      {steps.map((s, i) => (
        <li key={s.h} className="pgx-step">
          <span className="n">{i + 1}</span>
          <div>
            <b>{s.h}</b>
            {s.p && <p>{s.p}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PgxTile({ href, src, alt, title, sub, pill, cls = "", i = 0, sizes }: { href: string; src: string; alt: string; title: string; sub?: string; pill?: string; cls?: string; i?: number; sizes?: string }) {
  return (
    <Link href={href} className={`pgx-tile pgx-edge ${cls}`} data-r style={d(i)}>
      <Image src={src} alt={alt} fill sizes={sizes ?? "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 640px"} />
      <span className="cap">
        <span>
          <b>{title}</b>
          {sub && <small>{sub}</small>}
        </span>
        {pill && <em>{pill}</em>}
      </span>
    </Link>
  );
}
