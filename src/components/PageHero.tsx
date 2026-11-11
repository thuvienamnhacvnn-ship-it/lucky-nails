import GoldRibbon from "./GoldRibbon";

export default function PageHero({ title, sub, tone = "dark", eyebrow, children }: { title: string; sub?: string; tone?: "dark" | "ivory"; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <section className={`page-hero pg-hero ${tone}`}>
      <GoldRibbon className="hidden md:block" style={{ left: 0, top: -4, width: 280, height: 110, opacity: 0.85 }} />
      <div className="wrap">
        {eyebrow && <span className="pg-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <span className="pg-orn" aria-hidden="true"><i /></span>
        {sub && <p>{sub}</p>}
        {children}
      </div>
    </section>
  );
}
