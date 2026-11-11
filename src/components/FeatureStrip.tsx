import { CalendarCheck, Gem, Heart, MapPin } from "lucide-react";

const items = [
  { icon: CalendarCheck, t: "Online Booking", s: "Einfach & schnell" },
  { icon: Gem, t: "Professionelle Pflege", s: "Hochwertige Produkte" },
  { icon: Heart, t: "Individuelles Design", s: "Nach deinem Stil" },
  { icon: MapPin, t: "Berlin-Friedrichshain", s: "Zentral & gut erreichbar" },
];

export default function FeatureStrip() {
  return (
    <section className="features" aria-label="Vorteile">
      <div className="wrap">
        <ul className="features-grid">
          {items.map(({ icon: I, t, s }) => (
            <li className="feat" key={t}>
              <I aria-hidden />
              <div>
                <b>{t}</b>
                <span>{s}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
