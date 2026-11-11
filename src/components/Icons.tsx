import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function TikTokIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M19.6 6.7a5.2 5.2 0 0 1-3.2-1.1 5.2 5.2 0 0 1-1.9-3.1h-3.2v12.4a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.2a5.8 5.8 0 1 0 4.9 5.7V9.2a8.3 8.3 0 0 0 5.1 1.7V6.7z" />
    </svg>
  );
}

export function WhatsAppIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M3.5 20.5l1.3-4.2A8.6 8.6 0 1 1 8 19.4l-4.5 1.1z" />
      <path d="M9 8.5c-.3 1.6.8 3.6 2.4 5s3.4 2.2 4.6 1.8c.5-.2.8-.8.8-1.2l-1.8-.9-.9.7c-.9-.3-2.7-1.9-3.1-2.9l.6-.9-.9-1.8c-.4 0-.9.2-1.1.6" />
    </svg>
  );
}

export function InstagramIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LotusIcon(p: P) {
  return (
    <svg viewBox="0 0 40 26" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M20 3c3 4 3 11 0 17-3-6-3-13 0-17z" />
      <path d="M20 20c-5-1-9-5-10-10 5 0 9 3 10 10z" />
      <path d="M20 20c5-1 9-5 10-10-5 0-9 3-10 10z" />
      <path d="M20 21c-6 1-12-1-15-6 6-1 12 1 15 6z" opacity=".7" />
      <path d="M20 21c6 1 12-1 15-6-6-1-12 1-15 6z" opacity=".7" />
    </svg>
  );
}
