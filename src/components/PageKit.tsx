import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Gemeinsame Bausteine der Unterseiten (Demo-Vorlage): Kremkarte, Vorteils-Trio, Chip-Zeile.
export function PgCard({
  src,
  alt,
  title,
  text,
  pill,
  href,
  ratio = "wide",
  i = 0,
}: {
  src?: string;
  alt?: string;
  title: string;
  text?: string;
  pill?: string;
  href?: string;
  ratio?: "wide" | "square";
  i?: number;
}) {
  const body = (
    <>
      {src && (
        <div className={`pgk-pic ${ratio}`}>
          <Image src={src} alt={alt ?? ""} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 380px" />
        </div>
      )}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {(pill || href) && (
        <div className="pgk-foot">
          {pill && <span className="pgk-pill">{pill}</span>}
          {href && (
            <span className="pgk-go" aria-hidden>
              <ArrowRight size={18} />
            </span>
          )}
        </div>
      )}
    </>
  );
  return href ? (
    <Link href={href} className="pgk-card link pgx-tilt pgx-edge" data-r style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
      <i className="snowcap" aria-hidden />{body}
    </Link>
  ) : (
    <div className="pgk-card pgx-tilt pgx-edge" data-r style={{ "--d": `${i * 90}ms` } as React.CSSProperties}><i className="snowcap" aria-hidden />{body}</div>
  );
}

export function PgTrio({ items }: { items: { Icon: React.ComponentType<{ "aria-hidden"?: boolean }>; h: string; p: string }[] }) {
  return (
    <div className="pgk-trio">
      {items.map(({ Icon, h, p }) => (
        <div key={h} className="pgk-card feat pgx-tilt pgx-edge" data-r>
          <i className="snowcap" aria-hidden />
          <Icon aria-hidden />
          <h3>{h}</h3>
          <p>{p}</p>
        </div>
      ))}
    </div>
  );
}

export function PgChips({ children }: { children: React.ReactNode }) {
  return <div className="pgk-chips">{children}</div>;
}
