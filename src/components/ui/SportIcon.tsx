import type { SportSlug } from "@/lib/types";

/**
 * Small hand-drawn icon per sport, keyed by slug. `constants.ts` documents
 * an `icon` field as "a Lucide icon name (or similar)" but nothing ever
 * rendered it — these are purpose-drawn instead of a generic icon-font
 * lookup, so each one reads as its sport (a ball, a puck, a crosshair)
 * rather than an abstract shape. Same stroke language as the rest of the
 * UI (2px, round caps/joins, currentColor) so it drops into a badge, a
 * nav pill or a card corner and picks up whatever color/size wraps it.
 *
 * dota-2 and ufc are drawn as original marks evocative of the sport/game
 * (a shield-and-core emblem, the eight-sided fight cage) rather than a
 * redraw of Valve's or the UFC's actual registered logo — those are
 * trademarked brand artwork, not something to reproduce here, but the
 * shapes below still read at a glance as "that game" / "that sport."
 */
export function SportIcon({ sport, className }: { sport: SportSlug; className?: string }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  switch (sport) {
    case "football":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.2 15.6 10 14.3 14.2H9.7L8.4 10Z" />
          <path d="M12 7.2V4.3M15.6 10l3-1.6M14.3 14.2l1.9 2.8M9.7 14.2 7.8 17M8.4 10l-3-1.6" />
        </svg>
      );
    case "hockey":
      return (
        <svg {...props}>
          {/* stick: long shaft bending sharply into a short flat blade */}
          <path d="M18.5 3 9.5 15 4 15.8" />
          {/* puck, seen edge-on, sitting apart from the blade — filled so
           * it reads as a solid disc rather than another outlined ring */}
          <ellipse cx="15.5" cy="19.6" rx="3.6" ry="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tennis":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          {/* felt seam: two arcs from pole to pole, bowing to opposite
           * sides — stays well inside the circle so nothing clips */}
          <path d="M12 3C6.5 6 6.5 18 12 21" />
          <path d="M12 3c5.5 3 5.5 15 0 18" />
        </svg>
      );
    case "cs2":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "dota-2":
      return (
        <svg {...props}>
          {/* shield-shaped emblem with a faceted core — an original mark
           * for the MOBA slot, not a copy of Valve's logo */}
          <path d="M12 3 18.5 5.8V11.5C18.5 16 15.6 19 12 20.5 8.4 19 5.5 16 5.5 11.5V5.8Z" />
          <path d="M12 8.3 14.6 12 12 15.7 9.4 12Z" />
        </svg>
      );
    case "mobile-legends":
      return (
        <svg {...props}>
          <rect x="7" y="3" width="10" height="18" rx="2.2" />
          <path d="M10.5 18h3" />
        </svg>
      );
    case "ufc":
      return (
        <svg {...props}>
          {/* the eight-sided fight cage — the shape people associate
           * with the sport, rather than the UFC org's own wordmark */}
          <path d="M8.2 3H15.8L21 8.2V15.8L15.8 21H8.2L3 15.8V8.2Z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
