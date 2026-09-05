import type { ReactNode } from "react";

export function SectionHeading({
  title,
  action,
  subtitle,
}: {
  title: string;
  action?: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="h-3.5 w-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-white sm:text-2xl">
            {title}
          </h2>
        </div>
        {subtitle && <p className="text-sm text-[var(--muted)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
