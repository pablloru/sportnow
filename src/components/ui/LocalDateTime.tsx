"use client";

import { useEffect, useState } from "react";
import { formatDate, formatEventDateTime, formatTime } from "@/lib/format";

type Mode = "date" | "time" | "eventDateTime";

const FORMATTERS: Record<Mode, (iso: string, locale: string) => string> = {
  date: formatDate,
  time: formatTime,
  eventDateTime: formatEventDateTime,
};

/**
 * Renders an absolute date/time in the *viewer's* own timezone rather
 * than whatever timezone happened to be active when the static page
 * was generated. The formatters in lib/format.ts already default to
 * the runtime's local timezone whenever none is passed explicitly —
 * the only thing missing was running them in the browser instead of
 * at build time, which is what this client component does.
 *
 * Deliberately starts at `null` (rendered as nothing) on both the
 * server and the first client pass, instead of eagerly formatting the
 * date on mount: computing it immediately would use the *browser's*
 * timezone from the very first render, which already matches what the
 * effect below would later set — so the follow-up `setState` becomes a
 * same-value no-op that React skips, permanently leaving whatever text
 * the build server baked in. Starting from a real "nothing yet" value
 * guarantees the effect's update is a genuine state transition that
 * actually reaches the DOM.
 */
export function LocalDateTime({
  iso,
  locale,
  mode = "eventDateTime",
}: {
  iso: string;
  locale: string;
  mode?: Mode;
}) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setText(FORMATTERS[mode](iso, locale)), 0);
    return () => clearTimeout(id);
  }, [iso, locale, mode]);

  if (text === null) return null;
  return <span>{text}</span>;
}
