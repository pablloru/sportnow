import type { EventStatistic } from "@/lib/types";

export const EVENT_STATISTICS_EN: Record<string, Partial<EventStatistic>> = {
  "stat-1": { label: "Wins in the last 5 matches" },
  "stat-2": { label: "Average scoring (goals/match)" },
  "stat-3": { label: "Goals conceded home/away (average)" },
  "stat-4": { label: "Head-to-head (last 5)", homeValue: "2 wins", awayValue: "1 win" },

  "stat-5": { label: "Possession" },
  "stat-6": { label: "Shots on target" },

  "stat-7": { label: "Wins in the last 5 matches" },
  "stat-8": { label: "Average goals scored per game" },
  "stat-9": { label: "Average goals conceded per game" },
  "stat-10": { label: "Head-to-head (last 4)", homeValue: "2 wins", awayValue: "2 wins" },
};
