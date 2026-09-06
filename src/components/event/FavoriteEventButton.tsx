"use client";

import { useTranslations } from "next-intl";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

/** Same labeled-pill pattern as FavoriteTeamButton, for a single match
 * instead of a team — lets a visitor track one upcoming event without
 * having to follow either team playing in it. Rendered compact (text
 * hidden below sm) so it fits the match header's tighter status row;
 * the aria-label/tooltip still carry the full match name at every
 * width. Favorited event ids are read back on the dedicated favorites
 * page (see /favorites). */
export function FavoriteEventButton({ eventId, matchLabel }: { eventId: string; matchLabel: string }) {
  const t = useTranslations("eventPage");
  const tCommon = useTranslations("common");
  return (
    <FavoriteButton
      kind="event"
      id={eventId}
      label={matchLabel}
      addLabel={t("followEvent", { match: matchLabel })}
      removeLabel={t("unfollowEvent", { match: matchLabel })}
      addText={tCommon("addToFavorites")}
      activeText={tCommon("inFavorites")}
      size="compact"
    />
  );
}
