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
 * (left) to most recent (right); the last badge gets a thin ring so
 * "which end is the latest match" is visible at a glance, not just on
 * hover. Letters follow the active locale via the "comparison"
 * namespace's short labels (В/Н/П in Russian, W/D/L in English, same
 * ones already used for the win-draw-loss tally elsewhere on these
 * pages), and both the strip and each badge carry a native tooltip
 * spelling out the scope/order and the full word for that result.
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
    <div className="flex gap-1" title={t("formHint")}>
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
  );
}
