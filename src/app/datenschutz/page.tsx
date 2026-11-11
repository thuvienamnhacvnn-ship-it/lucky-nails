import PageHero from "@/components/PageHero";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata = { ...pageMeta("Datenschutzerklärung", "Datenschutzerklärung von Lucky Nails, Berlin.", "/datenschutz"), robots: { index: false, follow: true } };

const T = ({ children }: { children: React.ReactNode }) => <span className="todo">[Bitte ergänzen: {children}]</span>;

// RAHMEN — Texte zur Rechtslage bitte von einer fachkundigen Stelle (Anwalt / Datenschutz-Generator) einsetzen lassen.
export default function Page() {
  return (
    <>
      <PageHero tone="ivory" title="Datenschutzerklärung" sub="Informationen zur Verarbeitung personenbezogener Daten" />
      <section className="on-ivory" style={{ paddingBottom: 96 }}>
        <div className="wrap">
          <div className="legal">
            <h2>1. Verantwortliche Stelle</h2>
            <p>
              <T>Name / Firma der verantwortlichen Stelle</T>, {site.address.street}, {site.address.zip} {site.address.city}. Telefon {site.phone.display}.
            </p>
            <h2>2. Hosting und Server-Logfiles</h2>
            <p><T>Hosting-Anbieter, Art und Dauer der Speicherung von Logfiles, Rechtsgrundlage</T></p>
            <h2>3. Technische Hinweise zu dieser Website</h2>
            <ul>
              <li>Diese Website setzt derzeit keine Tracking- oder Analyse-Dienste ein.</li>
              <li>Schriften werden vom eigenen Server ausgeliefert, es werden keine Schriften von Drittanbietern nachgeladen.</li>
              <li>Die Karte auf der Kontaktseite (Google Maps) wird erst nach einem Klick auf „Karte laden“ eingebunden. Erst dann werden Daten an Google übertragen.</li>
            </ul>
            <h2>4. Online-Terminbuchung (BePro)</h2>
            <p>
              Die Terminbuchung erfolgt über einen externen Dienst (BePro Booking). Beim Klick auf „Termin buchen“ verlässt du diese Website. <T>Angaben zum Anbieter, zur Datenverarbeitung und Rechtsgrundlage</T>
            </p>
            <h2>5. Verlinkte Dienste (TikTok)</h2>
            <p><T>Hinweis zu externen Links / Social-Media-Profilen</T></p>
            <h2>6. Kontaktaufnahme</h2>
            <p><T>Verarbeitung bei Kontakt per Telefon / E-Mail</T></p>
            <h2>7. Deine Rechte</h2>
            <p><T>Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Beschwerderecht bei der Aufsichtsbehörde (Berliner Beauftragte für Datenschutz und Informationsfreiheit)</T></p>
          </div>
        </div>
      </section>
    </>
  );
}
