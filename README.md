# Lucky Nails – Website (Berlin)

Next.js 16 (webpack) · TypeScript · Tailwind v4 · motion · qrcode. Hero-Karussell = eigenes CSS/JS (kein gsap, kein three.js). Schriften werden beim Build von `next/font` geholt und vom eigenen Server ausgeliefert (kein Google-Aufruf im Browser).

## Installation & Start

```bash
npm install
npm run dev -- -p 3210      # Entwicklung  -> http://localhost:3210  (nicht 127.0.0.1 nutzen, sonst ggf. kein Hydrate – allowedDevOrigins ist aber gesetzt)
npm run build && npm run start -- -p 3210   # Produktion
```
Wichtig: `--webpack` steckt schon in `dev`/`build` (Turbopack läuft auf dieser Windows-Maschine nicht).

## Wo ändere ich was? (alles in `src/config/`)

| Was | Datei |
|---|---|
| Telefon, Adresse, TikTok, WhatsApp, Instagram, E-Mail, Öffnungszeiten, Buchungs- und Check-in-URL | `site.ts` |
| **Promo** (an/aus + Zeitraum, Texte) | `site.ts` → `promo` (`enabled`, `start`, `end`). Nach `end` verschwindet die Karte automatisch (Startseite prüft stündlich). |
| Preise (exakt Flyer) | `prices.ts` |
| 6 Nail Designs (Name, Text, Preis, Bilder) | `nails.ts` |
| Galerie-Bilder + Filter-Kategorie + „Echte Arbeit“/„Illustration“ | `gallery.ts` |
| Dienstleistungs-Karten | `services.ts` |
| Bildpfade (Logo, Studio, Gutschein …) | `images.ts` |

**WhatsApp / Instagram / E-Mail / Öffnungszeiten** sind absichtlich `null` (nicht bestätigt). Sobald eingetragen, erscheinen Icons/Buttons/Footer-Zeiten automatisch.

## Bilder tauschen

Originale (bis 8 MB) werden nie ins Repo kopiert. `scripts/build-images.mjs` komprimiert sie zu WebP nach `public/img/` (sharp):

1. Neues Foto in die Liste `JOBS` eintragen (Quelle, Zieldatei, max. Kantenlänge, Qualität, optional Zuschnitt).
2. `npm run images`
3. In `src/config/*.ts` den Pfad (`/img/<datei>.webp`) setzen.

Die 6 Hero-Nägel (`public/img/nail-1..6.webp`) werden dort aufrecht gedreht und freigestellt. Neue Galerie-Fotos: als `real-11.webp` anlegen und in `gallery.ts` eintragen.

## Seiten

`/` · `/leistungen` · `/nail-designs` + `/nail-designs/[slug]` (6×) · `/galerie` · `/studio` · `/booking` · `/kontakt` · `/gutscheine` · `/impressum` · `/datenschutz` · `sitemap.xml` · `robots.txt` (Domain über `NEXT_PUBLIC_SITE_URL`, Standard https://luckynails.vip).

- Jeder „Termin buchen“-Button öffnet BePro in neuem Tab. Der QR-Code auf `/booking` wird mit `qrcode` aus der Check-in-URL erzeugt.
- Google Maps wird erst nach Klick „Karte laden“ eingebunden. Kein Tracking, keine Fremd-Schriften.
- Impressum/Datenschutz = Rahmen mit gelb markierten `[Bitte ergänzen: …]` – keine erfundenen Rechtstexte. Bitte rechtlich prüfen lassen.

## Entscheidungen bei offenen Punkten (Standardwerte aus der Spec, 01_spec.md Abschnitt 5)

1. Hero-Höhe nach Vorlage (464 px bei 1440), nicht 16:9.
2. Dekor-Raster (Seide, Blüten, Gold-Sterne) fehlt mangels Quelldatei; Bänder/Linien/Plattform sind CSS/SVG.
3. WhatsApp/Instagram ausgeblendet bis bestätigt.
4. „erfahrenes Team“ ersetzt durch „Persönlicher Service“.
5. Nur Fotos ohne klar erkennbare Gesichter (Welcome, Studio). **DSGVO-Einwilligung klären**, bevor Fotos mit Gesichtern genutzt werden.
6. Container 1312 px, Seitenrand 64 px.
7. Fassadenfotos („Nails·Lashes“) werden nicht verwendet.
8. Keine Öffnungszeiten (`hours: null`).
9. Poster mit fremdem Wortmarken-Logo nicht verwendet; Illustrationen sind als „Illustration“ gekennzeichnet.

Offen / bitte bestätigen: Team-Text und Hygiene-Text auf `/studio` sind bewusst allgemein gehalten.

## Quellen / Lizenzen
Layout-Ideen: HyperUI, Flowbite, Daisy UI, Magic UI (MIT), React Bits (MIT + Commons Clause) – nur als Verhaltensreferenz, Code selbst geschrieben. Icons: lucide-react (ISC).

## Hero: Raumbild + 360°-Nagelvideos

- Hintergrund `public/img/hero-space.webp` (16:9); Video/Karussell liegen im selben 16:9-Container (Lage in %, siehe `.nail360` in `globals.css`). Plattform: Mitte x 65 %, Oberfläche y 70–85 %.
- `HeroNailVideo` spielt `public/video/nail-1..6.webm` (VP9 mit Alpha, 520×640, 6 s) nacheinander, je einmal komplett, Crossfade 400 ms. Reihenfolge = `src/config/nails.ts`. Hover/Fokus pausiert, Pfeile/Punkte/Wischen/←→ wählen direkt, Klick auf den Nagel öffnet die Detailseite.
- `prefers-reduced-motion`: statt Video `public/img/nail-N-still.png` (erstes Frame, mit ffmpeg erzeugt), Wechsel nur per Klick.
- Fehlt `nail-1.webm`, läuft das CSS-Karussell (`NailCarousel`) als Fallback.
- Alle Gold-Linien/Rahmen haben einen langsamen Farbverlauf (aus bei reduced-motion), Hover-Effekte siehe `globals.css` Abschnitt „Gold-Linien“.

## Update: 3D-Nagel im Hero, lokale Schriften

- Der Hero zeigt einen 3D-Nagel (`HeroNail3D`, three.js, gleiche Geometrie/Materialien wie `/nail-3d` in `src/lib/nailGeometry.ts` + `nailMaterials.ts`), der über der Gold-Plattform schwebt. Wechsel alle 6 s, Ziehen = freie Drehung (bleibt stehen), danach 12 s Pause, Hover pausiert, Klick öffnet die Detailseite. Ohne WebGL: Standbild `public/img/nail-N-still.png`. Das alte Video (`HeroNailVideo`) und das CSS-Karussell (`NailCarousel`) liegen noch im Code, werden aber nicht mehr verwendet.
- Schriften liegen als woff2 in `src/fonts` (von @fontsource, OFL) und werden mit `next/font/local` geladen – der Build braucht kein Netz mehr.
- Der Nagelumriss wurde aus `_w-agent/gen/nails-curved.png` gemessen (Profil-Tabelle `PROFILE` in `nailGeometry.ts`).

## Update: Hero mit Video-Hintergrund, loses Podest, Nagelwechsel

- Hintergrund: Bildfolge `public/img/salon-pan/f001..f080.webp` (Komponente `HeroPanorama`): folgt der Maus links/rechts wie ein 360°-Foto, Touch = horizontal ziehen; Poster `salon-bg-poster.webp`, `hero-space.webp` als Rückfall. Kein Video mehr.
- Podest: `public/img/podium.png` liegt statisch über dem Video (nicht im Video), samt Bodenschatten. Alles im selben 16:9-Container, Lage in % (siehe Ende von `globals.css`).
- Nagelwechsel: Dissolve-Shader + Goldstaub (`HeroNail3D`, `src/lib/nailShaders.ts`); Startpose schräg diagonal (`src/lib/nailPose.ts`). Cat Eye: Lichtband per Shader (Ward-anisotrop), wandert beim Drehen.
