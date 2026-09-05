import { clsx } from "clsx";

const COLORS: Record<"W" | "D" | "L", string> = {
  W: "bg-emerald-400/90 text-emerald-950",
  D: "bg-slate-400/80 text-slate-950",
  L: "bg-rose-400/90 text-rose-950",
};

export function FormStrip({ form }: { form?: ("W" | "D" | "L")[] }) {
  if (!form || form.length === 0) return null;
  return (
    <div className="flex gap-1">
      {form.map((result, i) => (
        <span
          key={i}
          className={clsx(
            "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
            COLORS[result]
          )}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
