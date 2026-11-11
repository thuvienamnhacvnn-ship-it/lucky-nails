import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <>
      <PageHero title="Seite nicht gefunden" sub="Diese Seite gibt es leider nicht (mehr)." />
      <section className="on-dark" style={{ padding: "0 0 120px", textAlign: "center" }}>
        <Link href="/" className="btn btn-primary">Zur Startseite</Link>
      </section>
    </>
  );
}
