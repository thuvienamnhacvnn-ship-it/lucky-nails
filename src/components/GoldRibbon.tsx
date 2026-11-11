"use client";

import { useEffect, useId, useState } from "react";

// Gold-Band als SVG-Linie mit langsam laufendem Farbverlauf (flach, ohne Glow). Aus bei reduced-motion.
export default function GoldRibbon({ className = "", flip = false, style }: { className?: string; flip?: boolean; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    setAnim(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return (
    <svg className={`ribbon ${className}`} style={style} viewBox="0 0 340 120" fill="none" aria-hidden="true" preserveAspectRatio="none" transform={flip ? "scale(-1,1)" : undefined}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="170" y2="60" spreadMethod="repeat">
          <stop offset="0" stopColor="#b98440" />
          <stop offset=".5" stopColor="#fbe9ae" />
          <stop offset="1" stopColor="#b98440" />
          {anim && <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="170 60" dur="7s" repeatCount="indefinite" />}
        </linearGradient>
      </defs>
      <path d="M0 8 C 90 0, 200 40, 340 112" stroke={`url(#${id})`} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M0 22 C 80 14, 190 52, 320 116" stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}
