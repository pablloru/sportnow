import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SPORT_SLUGS } from "@/lib/constants";
import { EVENTS, ARTICLES, TEAMS, PLAYERS, getTeam } from "@/lib/mock-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    });

    for (const sport of SPORT_SLUGS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${sport}`,
        lastModified: now,
        changeFrequency: "hourly",
        priority: 0.8,
      });
    }

    for (const event of EVENTS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${event.sport}/match/${event.slug}`,
        lastModified: now,
        changeFrequency: "hourly",
        priority: 0.6,
      });
    }

    for (const article of ARTICLES) {
      entries.push({
        url: `${SITE_URL}/${locale}/article/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "daily",
        priority: 0.5,
      });
    }

    for (const team of TEAMS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${team.sport}/team/${team.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    for (const player of PLAYERS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${getTeam(player.teamId).sport}/player/${player.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.3,
      });
    }
  }

  return entries;
}
