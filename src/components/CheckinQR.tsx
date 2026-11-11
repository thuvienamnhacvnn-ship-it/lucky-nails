import QRCode from "qrcode";
import { site } from "@/config/site";

// QR wird beim Build/Request aus der Check-in-URL erzeugt (echter, scanbarer Code).
export default async function CheckinQR() {
  const svg = await QRCode.toString(site.checkin, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1c0d0c", light: "#ffffff" } });
  return (
    <section className="checkin" aria-labelledby="checkin-h">
      <div className="qr" role="img" aria-label="QR-Code zum Check-in bei Lucky Nails" dangerouslySetInnerHTML={{ __html: svg }} />
      <div>
        <h2 id="checkin-h">Check-in im Studio</h2>
        <p>Schon einen Termin? Scanne den QR-Code oder öffne den Link, um dich bei deinem Besuch bequem einzuchecken.</p>
        <div className="urlbox">
          <span>
            Check-in: <a href={site.checkin} target="_blank" rel="noopener noreferrer">{site.checkin}</a>
          </span>
          <span>
            Online-Termin: <a href={site.booking} target="_blank" rel="noopener noreferrer">{site.booking}</a>
          </span>
        </div>
      </div>
    </section>
  );
}
