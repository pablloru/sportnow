"use client";

import { useTranslations } from "next-intl";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

/** The one client-interactive island on an otherwise server-rendered
 * team page. Favorited team ids are read back on the dedicated
 * favorites page (see /favorites). */
export function FavoriteTeamButton({ teamId, teamName }: { teamId: string; teamName: string }) {
  const t = useTranslations("teamPage");
  const tCommon = useTranslations("common");
  return (
    <FavoriteButton
      kind="team"
      id={teamId}
      label={teamName}
      addLabel={t("followTeam", { name: teamName })}
      removeLabel={t("unfollowTeam", { name: teamName })}
      addText={tCommon("addToFavorites")}
      activeText={tCommon("inFavorites")}
    />
  );
}
