import type { Lineup } from "@/lib/types";
import { PLAYERS } from "./players";

function byIds(ids: string[]) {
  return ids.map((id) => {
    const p = PLAYERS.find((pl) => pl.id === id);
    if (!p) throw new Error(`Unknown player id in lineup: ${id}`);
    return p;
  });
}

// Note: Marko Delić (p-nbu-9) is intentionally left out of the starters —
// see injuries.ts. Nico Fischer starts in his place.
export const LINEUPS: Lineup[] = [
  {
    eventId: "evt-football-featured",
    teamId: "team-football-1",
    formation: "4-3-3",
    starters: byIds([
      "p-nbu-1", "p-nbu-2", "p-nbu-3", "p-nbu-4", "p-nbu-5",
      "p-nbu-6", "p-nbu-8", "p-nbu-10",
      "p-nbu-19", "p-nbu-11", "p-nbu-17",
    ]),
    bench: byIds(["p-nbu-22", "p-nbu-14", "p-nbu-21"]),
  },
  {
    eventId: "evt-football-featured",
    teamId: "team-football-2",
    formation: "4-2-3-1",
    starters: byIds([
      "p-alc-1", "p-alc-2", "p-alc-3", "p-alc-4", "p-alc-5",
      "p-alc-6", "p-alc-8",
      "p-alc-10", "p-alc-7", "p-alc-11",
      "p-alc-9",
    ]),
    bench: byIds(["p-alc-23", "p-alc-15", "p-alc-17", "p-alc-20"]),
  },

  // Note: Dmitri Orlov (p-ark-4) is intentionally left out of the Arctic
  // Kings starters — see injuries.ts. Andre Silva starts in his place.
  {
    eventId: "evt-hockey-3",
    teamId: "team-hockey-2",
    starters: byIds([
      "p-stb-1",
      "p-stb-3", "p-stb-4", "p-stb-5", "p-stb-6",
      "p-stb-7", "p-stb-8", "p-stb-9", "p-stb-10", "p-stb-11", "p-stb-12",
    ]),
    bench: byIds(["p-stb-2", "p-stb-13", "p-stb-14", "p-stb-15"]),
  },
  {
    eventId: "evt-hockey-3",
    teamId: "team-hockey-3",
    starters: byIds([
      "p-ark-1",
      "p-ark-3", "p-ark-5", "p-ark-6", "p-ark-13",
      "p-ark-7", "p-ark-8", "p-ark-9", "p-ark-10", "p-ark-11", "p-ark-12",
    ]),
    bench: byIds(["p-ark-2", "p-ark-14", "p-ark-15"]),
  },
];

export function getLineupsForEvent(eventId: string): Lineup[] {
  return LINEUPS.filter((l) => l.eventId === eventId);
}
