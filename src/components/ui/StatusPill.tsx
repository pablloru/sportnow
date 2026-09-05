import { useTranslations } from "next-intl";
import type { EventStatus } from "@/lib/types";
import { Badge } from "./Badge";

const TONE: Record<EventStatus, "neutral" | "positive" | "warning" | "danger"> = {
  scheduled: "neutral",
  finished: "positive",
  postponed: "warning",
  cancelled: "danger",
};

export function StatusPill({ status }: { status: EventStatus }) {
  const t = useTranslations("status");
  return <Badge tone={TONE[status]}>{t(status)}</Badge>;
}
