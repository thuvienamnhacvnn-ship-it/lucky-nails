import PageHero from "@/components/PageHero";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata = { ...pageMeta("Impressum", "Impressum von Lucky Nails, Berlin.", "/impressum"), robots: { index: false, follow: true } };

const T = ({ children }: { children: React.ReactNode }) => <span className="todo">[Bitte ergänzen: {children}]</span>;

// RAHMEN — keine erfundenen Rechtstexte. Alle Angaben, die nur die Inhaberin / der Inhaber kennt, sind markiert.
export default function Page() {
  return (
    <>
      <PageHero tone="ivory" title="Impressum" sub="Angaben gemäß § 5 DDG" />
      <section className="on-ivory" style={{ paddingBottom: 96 }}>
        <div className="wrap">
          <div className="legal">
            <h2>Anbieter</h2>
            <p>
              <T>vollständiger Name der Inhaberin / des Inhabers bzw. Firmenname mit Rechtsform</T>
              <br />
              {site.name}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>
            <h2>Vertreten durch</h2>
            <p><T>vertretungsberechtigte Person</T></p>
            <h2>Kontakt</h2>
            <p>
              Telefon: {site.phone.display}
              <br />
              Web: {site.web.display}
              <br />
              E-Mail: {site.email ?? <T>E-Mail-Adresse</T>}
            </p>
            <h2>Umsatzsteuer-ID</h2>
            <p><T>USt-IdNr. gemäß § 27a UStG, falls vorhanden</T></p>
            <h2>Zuständige Aufsichtsbehörde / Handwerkskammer</h2>
            <p><T>falls zutreffend</T></p>
            <h2>Verantwortlich für den Inhalt</h2>
            <p><T>Name und Anschrift gemäß § 18 Abs. 2 MStV</T></p>
          </div>
        </div>
      </section>
    </>
  );
}
