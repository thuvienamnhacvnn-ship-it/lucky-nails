import { CalendarDays, ChevronRight } from "lucide-react";
import { site } from "@/config/site";

// Jeder Buchungs-Button der Seite führt zu BePro (neuer Tab).
export default function BookingCTA({
  variant = "primary",
  label = "Termin online buchen",
  className = "",
  chevron = true,
}: {
  variant?: "primary" | "outline" | "ivory";
  label?: string;
  className?: string;
  chevron?: boolean;
}) {
  const cls = variant === "primary" ? "btn btn-primary" : variant === "outline" ? "btn btn-outline" : "btn btn-ghost-ivory";
  return (
    <a href={site.booking} target="_blank" rel="noopener noreferrer" className={`${cls} ${className}`}>
      <CalendarDays size={21} strokeWidth={1.7} aria-hidden /> {label}
      {chevron && <ChevronRight size={18} strokeWidth={2} aria-hidden />}
    </a>
  );
}
