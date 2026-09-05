import { Link } from "@/i18n/navigation";

/** Small "‹ back to X" affordance for detail pages nested one level
 * below a listing (team/player pages back to their sport). */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-white"
    >
      <span aria-hidden>←</span>
      {label}
    </Link>
  );
}
