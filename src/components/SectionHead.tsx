// Abschnitts-Kopf der Unterseiten: kleine Überschrift (Gold), Serifen-Titel, Zier-Linie (zeichnet sich beim Scrollen), Untertitel.
export default function SectionHead({ id, eyebrow, title, sub }: { id?: string; eyebrow?: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="pg-head" data-r>
      {eyebrow && <span className="pg-eyebrow">{eyebrow}</span>}
      <h2 id={id}>{title}</h2>
      <span className="pg-orn" aria-hidden="true"><i /></span>
      {sub && <p>{sub}</p>}
    </div>
  );
}
