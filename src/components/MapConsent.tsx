"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { site } from "@/config/site";

// Datenschutz: Google Maps wird erst nach Klick geladen.
export default function MapConsent() {
  const [on, setOn] = useState(false);
  const q = encodeURIComponent(`${site.address.street}, ${site.address.zip} ${site.address.city}`);
  return (
    <div className="mapbox">
      {on ? (
        <iframe title="Karte: Lucky Nails, Boxhagener Str. 19, Berlin" src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <>
          <div className="grid" aria-hidden="true" />
          <div className="card">
            <MapPin size={30} color="#a34b44" aria-hidden />
            <b>{site.name}</b>
            <p>
              {site.address.street}, {site.address.zip} {site.address.city}
              <br />
              Beim Laden der Karte werden Daten an Google übertragen.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              <button className="btn btn-wine" style={{ height: 44, fontSize: 15 }} onClick={() => setOn(true)}>
                Karte laden
              </button>
              <a className="btn btn-ghost-ivory" href={site.mapsLink} target="_blank" rel="noopener noreferrer">
                Route in Google Maps
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
