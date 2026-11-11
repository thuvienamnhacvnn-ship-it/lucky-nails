import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { img } from "@/config/images";
import GoldRibbon from "./GoldRibbon";
import PromoCard from "./PromoCard";

export default function WelcomeSection({ showPromo }: { showPromo: boolean }) {
  return (
    <section className="welcome" aria-labelledby="welcome-h">
      <GoldRibbon style={{ left: 0, top: -14, width: 330, height: 40, opacity: 0.9 }} />
      <div className="wrap">
        <div className={`welcome-grid ${showPromo ? "" : "no-promo"}`}>
          <div className="welcome-copy">
            <h2 id="welcome-h">
              Willkommen bei <strong>Lucky Nails</strong>
            </h2>
            <p>
              Dein modernes Nagelstudio in Berlin-Friedrichshain. Wir bieten professionelle Maniküre, Pediküre und kreatives Nageldesign – mit Liebe zum Detail und viel Zeit für dich.
            </p>
            <Link href="/studio" className="btn btn-ghost-ivory">
              Mehr über uns <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="welcome-photo">
            <Image src={img.welcome} alt="Der Arbeitsplatz im Lucky Nails Studio mit Wand voller Nagellacke" fill sizes="(max-width: 1023px) 100vw, 541px" />
          </div>
          {showPromo && <PromoCard />}
        </div>
      </div>
    </section>
  );
}
