"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Tag/Nacht-Schalter im Banner. Setzt data-mode am .hero; Wahl wird nur im Browser gemerkt (try/catch).
export default function HeroModeToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("ln-hero-mode") === "night") setNight(true);
    } catch {}
  }, []);

  useEffect(() => {
    const hero = document.querySelector(".hero") as HTMLElement | null;
    if (hero) hero.dataset.mode = night ? "night" : "day";
    try {
      localStorage.setItem("ln-hero-mode", night ? "night" : "day");
    } catch {}
  }, [night]);

  return (
    <button
      type="button"
      className="mode-toggle"
      role="switch"
      aria-checked={night}
      aria-label={night ? "Tagmodus einschalten" : "Nachtmodus einschalten"}
      onClick={() => setNight((v) => !v)}
    >
      <Sun size={16} strokeWidth={1.8} aria-hidden />
      <span className="mt-track"><span className="mt-knob" /></span>
      <Moon size={16} strokeWidth={1.8} aria-hidden />
    </button>
  );
}
