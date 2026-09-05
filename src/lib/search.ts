import type { Article, News, SportEvent, Team } from "@/lib/types";

/**
 * Pure, sport-agnostic site search. Same spirit as team-comparison.ts:
 * no data access, no React, just filtering — safe to unit-test and
 * safe to call from a client component with data already fetched by a
 * server component.
 *
 * Matching is deliberately simple for a V1 demo: lowercase substring
 * matching, every word in the query must appear somewhere in the
 * item's combined searchable text (order-independent), so "vertex
 * crimson" finds the Vertex Gaming vs Crimson Wolves match. No
 * fuzzy/typo tolerance, no ranking beyond "matched or not" — good
 * enough for a mock dataset of this size, and the seam to swap in a
 * real search index later is this file only.
 */

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function matches(haystacks: (string | undefined)[], query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return false;
  const text = normalize(haystacks.filter((h): h is string => Boolean(h)).join(" "));
  return terms.every((term) => text.includes(term));
}

export function searchTeams(teams: Team[], query: string): Team[] {
  return teams.filter((team) => matches([team.name, team.shortName, team.country], query));
}

export function searchEvents(events: SportEvent[], query: string): SportEvent[] {
  return events.filter((event) =>
    matches(
      [
        event.home.team.name,
        event.home.team.shortName,
        event.away.team.name,
        event.away.team.shortName,
        event.competition.name,
      ],
      query
    )
  );
}

export function searchArticles(articles: Article[], query: string): Article[] {
  return articles.filter((article) => matches([article.title, article.excerpt, article.category], query));
}

export function searchNews(news: News[], query: string): News[] {
  return news.filter((item) => matches([item.title, item.excerpt, ...item.tags], query));
}
