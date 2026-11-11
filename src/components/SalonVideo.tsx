"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// Kurzer Rundgang durchs Studio: autoplay, stumm, Schleife, playsInline, Poster.
// Bei prefers-reduced-motion startet das Video NICHT von selbst; Pause/Play ist immer bedienbar.
export default function SalonVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="pg-video">
      <video ref={ref} muted loop playsInline preload="metadata" poster={poster} aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src={src} type="video/mp4" />
      </video>
      <button type="button" className="pg-video-btn" onClick={toggle} aria-label={playing ? "Video pausieren" : "Video abspielen"}>
        {playing ? <Pause size={20} aria-hidden /> : <Play size={20} aria-hidden />}
      </button>
    </div>
  );
}
