import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-[rgba(var(--ink-rgb),0.1)] bg-[var(--surface)]",
        hoverable && "transition-colors hover:border-[rgba(var(--ink-rgb),0.2)] hover:bg-[var(--surface-2)]",
        className
      )}
    >
      {children}
    </div>
  );
}
