import { useTranslations } from "next-intl";
import { clsx } from "clsx";

const COLOR_BY_RESULT: Record<"W" | "D" | "L", string> = {
  W: "bg-emerald-400/90 text-emerald-950",
  D: "bg-slate-400/80 text-slate-950",
  L: "bg-rose-400/90 text-rose-950",
};

/**
 * A team's own recent results — NOT a head-to-head record against
 * whichever opponent happens to be shown alongside it — read oldest
 * (left) to most recent (right). Three reinforcing cues make that
 * reading direction obvious without labeling each match "1st, 2nd...":
 * a tiny "Older -> Newer" caption under the row (the one thing that
 * actually answers "which way do I read this", spelled out instead of
 * left to convention/guesswork), the last badge getting a thin ring so
 * that end is visible at a glance too, and a native tooltip on the
 * strip/each badge for anyone who hovers. Letters follow the active
 * locale via the "comparison" namespace's short labels (В/Н/П in
 * Russian, W/D/L in English, same ones used for the win-draw-loss
 * tally elsewhere on these pages).
 */
export function FormStrip({ form }: { form?: ("W" | "D" | "L")[] }) {
  const t = useTranslations("comparison");
  if (!form || form.length === 0) return null;

  const shortLabel: Record<"W" | "D" | "L", string> = {
    W: t("winsShort"),
    D: t("drawsShort"),
    L: t("lossesShort"),
  };
  const fullLabel: Record<"W" | "D" | "L", string> = {
    W: t("win"),
    D: t("draw"),
    L: t("loss"),
  };

  return (
    <div className="inline-flex flex-col gap-1" title={t("formHint")}>
      <div className="flex gap-1">
        {form.map((result, i) => (
          <span
            key={i}
            title={fullLabel[result]}
            className={clsx(
              "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
              COLOR_BY_RESULT[result],
              i === form.length - 1 && "ring-2 ring-white/70 ring-offset-1 ring-offset-[var(--surface)]"
            )}
          >
            {shortLabel[result]}
          </span>
        ))}
      </div>
      <span className="text-center text-[9px] font-medium uppercase tracking-wider text-[var(--muted)] opacity-70">
        {t("formOrderCaption")}
      </span>
    </div>
  );
}
