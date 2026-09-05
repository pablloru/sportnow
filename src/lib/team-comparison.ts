import type { SportEvent } from "@/lib/types";

/**
 * Pure, presentation-adjacent helpers for the "team comparison" block on
 * an event page. Not a repository (no data source to abstract) and not
 * really Intelligence (no interpretation, just counting) — a small
 * shared util in the same spirit as lib/format.ts, safe to import
 * directly from components.
 */

export interface FormTally {
  wins: number;
  draws: number;
  losses: number;
}

export function tallyForm(form?: ("W" | "D" | "L")[]): FormTally {
  const tally: FormTally = { wins: 0, draws: 0, losses: 0 };
  for (const result of form ?? []) {
    if (result === "W") tally.wins += 1;
    else if (result === "D") tally.draws += 1;
    else tally.losses += 1;
  }
  return tally;
}

export interface HeadToHeadSummary {
  /** Most recent meetings first, already limited by the caller. */
  meetings: SportEvent[];
  /** Wins/draws counted from the perspective of `teamId`. */
  wins: number;
  draws: number;
  losses: number;
}

export function summarizeHeadToHead(meetings: SportEvent[], teamId: string): HeadToHeadSummary {
  let wins = 0;
  let draws = 0;
  let losses = 0;

  for (const event of meetings) {
    const isHome = event.home.team.id === teamId;
    const own = isHome ? event.home.score : event.away.score;
    const opponent = isHome ? event.away.score : event.home.score;
    if (own === undefined || opponent === undefined) continue;
    if (own === opponent) draws += 1;
    else if (own > opponent) wins += 1;
    else losses += 1;
  }

  return { meetings, wins, draws, losses };
}
