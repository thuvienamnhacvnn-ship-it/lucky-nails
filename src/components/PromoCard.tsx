import { promo, site } from "@/config/site";
import { ChevronRight } from "lucide-react";

export default function PromoCard() {
  return (
    <aside className="promo" aria-label="Aktion">
      <svg className="ribbon" style={{ right: -6, bottom: -4, width: 150, height: 120 }} viewBox="0 0 150 120" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="pg" x1="0" x2="1">
            <stop offset="0" stopColor="#c08b45" stopOpacity=".2" />
            <stop offset=".6" stopColor="#f9e3a8" />
            <stop offset="1" stopColor="#c08b45" />
          </linearGradient>
        </defs>
        <path d="M0 112 C 60 112, 110 90, 150 70" stroke="url(#pg)" strokeWidth="2.2" strokeLinecap="round" />
        <g stroke="#d9a66b" strokeWidth="1.1" opacity=".75" transform="translate(98 44)">
          <path d="M20 4 C 28 14 28 30 20 44 C 12 30 12 14 20 4Z" />
          <path d="M20 44 C 8 42 -2 32 -4 20 C 8 20 18 30 20 44Z" />
          <path d="M20 44 C 32 42 42 32 44 20 C 32 20 22 30 20 44Z" />
        </g>
      </svg>
      <p className="k">{promo.kicker}</p>
      <p className="big">{promo.big}</p>
      <p className="l">{promo.line}</p>
      <a href={site.booking} target="_blank" rel="noopener noreferrer" className="go">
        Jetzt buchen <ChevronRight size={14} style={{ display: "inline", verticalAlign: "-2px" }} aria-hidden />
      </a>
    </aside>
  );
}
