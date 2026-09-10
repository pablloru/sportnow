import type { Team } from "@/lib/types";
import { withUniqueSlugs } from "./helpers";
import { REAL_TEAMS } from "@/lib/real-data/generated";

// NOTE on tennis: the platform models a "match" uniformly across sports
// as an Event between two `Team`s. For an individual sport like tennis
// we represent each player as a one-person "team" (shortName = surname),
// which keeps Event/Prediction/Lineup generic instead of forking the
// schema for individual-vs-team sports. See src/lib/types/entities.ts.
const RAW_TEAMS: Omit<Team, "slug">[] = [
  // Football
  { id: "team-football-1", sport: "football", name: "Northbridge United", shortName: "NBU", country: "Valeria", form: ["W", "W", "D", "L", "W"] },
  { id: "team-football-2", sport: "football", name: "Real Alcazar", shortName: "ALC", country: "Meridia", form: ["L", "W", "W", "W", "D"] },
  { id: "team-football-3", sport: "football", name: "Sterling FC", shortName: "STE", country: "Astoria", form: ["W", "D", "D", "W", "L"] },
  { id: "team-football-4", sport: "football", name: "Vantage Athletic", shortName: "VAN", country: "Kestrel", form: ["L", "L", "W", "D", "W"] },
  { id: "team-football-5", sport: "football", name: "Iron Coast SC", shortName: "ICS", country: "Valeria", form: ["D", "W", "W", "L", "W"] },
  { id: "team-football-6", sport: "football", name: "Meridian City", shortName: "MDC", country: "Meridia", form: ["W", "L", "D", "W", "W"] },

  // Hockey
  { id: "team-hockey-1", sport: "hockey", name: "Frost Wolves", shortName: "FRW", country: "Kestrel", form: ["W", "W", "L", "W", "D"] },
  { id: "team-hockey-2", sport: "hockey", name: "Steel Bears", shortName: "STB", country: "Astoria", form: ["L", "D", "W", "W", "W"] },
  { id: "team-hockey-3", sport: "hockey", name: "Arctic Kings", shortName: "ARK", country: "Valeria", form: ["W", "L", "W", "L", "W"] },
  { id: "team-hockey-4", sport: "hockey", name: "Redline HC", shortName: "RED", country: "Meridia", form: ["D", "D", "W", "L", "L"] },
  { id: "team-hockey-5", sport: "hockey", name: "Southern Comets", shortName: "SOC", country: "Astoria", form: ["W", "D", "W", "W", "L"] },
  { id: "team-hockey-6", sport: "hockey", name: "Vulcan Reign", shortName: "VUL", country: "Kestrel", form: ["L", "W", "L", "D", "W"] },

  // Tennis (see NOTE above)
  { id: "team-tennis-1", sport: "tennis", name: "D. Volkov", shortName: "Volkov", country: "Valeria", form: ["W", "W", "W", "L", "W"] },
  { id: "team-tennis-2", sport: "tennis", name: "M. Ferreira", shortName: "Ferreira", country: "Meridia", form: ["W", "L", "W", "W", "W"] },
  { id: "team-tennis-3", sport: "tennis", name: "A. Takahashi", shortName: "Takahashi", country: "Astoria", form: ["L", "W", "W", "L", "W"] },
  { id: "team-tennis-4", sport: "tennis", name: "J. Okafor", shortName: "Okafor", country: "Kestrel", form: ["W", "W", "L", "W", "L"] },
  { id: "team-tennis-5", sport: "tennis", name: "L. Andersson", shortName: "Andersson", country: "Kestrel", form: ["W", "W", "L", "W", "W"] },
  { id: "team-tennis-6", sport: "tennis", name: "R. Costa", shortName: "Costa", country: "Meridia", form: ["L", "W", "W", "W", "L"] },

  // CS2
  { id: "team-cs2-1", sport: "cs2", name: "Nova Sentinel", shortName: "NVS", form: ["W", "W", "L", "W", "W"] },
  { id: "team-cs2-2", sport: "cs2", name: "Obsidian Five", shortName: "OB5", form: ["L", "W", "W", "L", "W"] },
  { id: "team-cs2-3", sport: "cs2", name: "Vertex Gaming", shortName: "VTX", form: ["W", "L", "W", "W", "L"] },
  { id: "team-cs2-4", sport: "cs2", name: "Crimson Wolves", shortName: "CRW", form: ["W", "W", "W", "L", "L"] },
  { id: "team-cs2-5", sport: "cs2", name: "Phantom Six", shortName: "PH6", form: ["W", "L", "W", "L", "W"] },
  { id: "team-cs2-6", sport: "cs2", name: "Iron Sight", shortName: "IST", form: ["L", "L", "W", "W", "W"] },

  // Dota 2
  { id: "team-dota-2-1", sport: "dota-2", name: "Ember Guard", shortName: "EMG", form: ["W", "L", "W", "W", "W"] },
  { id: "team-dota-2-2", sport: "dota-2", name: "Shadow Circuit", shortName: "SHC", form: ["W", "W", "L", "W", "L"] },
  { id: "team-dota-2-3", sport: "dota-2", name: "Titan Forge", shortName: "TTF", form: ["L", "W", "W", "L", "W"] },
  { id: "team-dota-2-4", sport: "dota-2", name: "Null Pointer", shortName: "NPT", form: ["W", "L", "L", "W", "W"] },
  { id: "team-dota-2-5", sport: "dota-2", name: "Void Legion", shortName: "VDL", form: ["W", "W", "L", "L", "W"] },
  { id: "team-dota-2-6", sport: "dota-2", name: "Ashen Pact", shortName: "ASP", form: ["L", "W", "W", "D", "W"] },

  // Mobile Legends
  { id: "team-mlbb-1", sport: "mobile-legends", name: "Solar Flare", shortName: "SLF", form: ["W", "W", "W", "L", "W"] },
  { id: "team-mlbb-2", sport: "mobile-legends", name: "Rapid Fang", shortName: "RPF", form: ["L", "W", "L", "W", "W"] },
  { id: "team-mlbb-3", sport: "mobile-legends", name: "Golden Spire", shortName: "GLS", form: ["W", "L", "W", "W"] },
  { id: "team-mlbb-4", sport: "mobile-legends", name: "Nightfall Squad", shortName: "NFS", form: ["L", "L", "W", "W", "W"] },
  { id: "team-mlbb-5", sport: "mobile-legends", name: "Crimson Tide", shortName: "CRT", form: ["W", "W", "L", "W", "W"] },
  { id: "team-mlbb-6", sport: "mobile-legends", name: "Storm Vanguard", shortName: "STV", form: ["L", "W", "W", "L", "W"] },

  // UFC (see NOTE above — same one-person "team" pattern as tennis)
  { id: "team-ufc-1", sport: "ufc", name: "Dominic Vance", shortName: "Vance", country: "Valeria", form: ["W", "W", "L", "W", "W"] },
  { id: "team-ufc-2", sport: "ufc", name: "Elias Marchetti", shortName: "Marchetti", country: "Meridia", form: ["L", "W", "W", "W", "L"] },
  { id: "team-ufc-3", sport: "ufc", name: "Kenji Osei", shortName: "Osei", country: "Astoria", form: ["W", "L", "W", "W", "W"] },
  { id: "team-ufc-4", sport: "ufc", name: "Viktor Zima", shortName: "Zima", country: "Kestrel", form: ["W", "W", "L", "L", "W"] },
  { id: "team-ufc-5", sport: "ufc", name: "Tyrell Banks", shortName: "Banks", country: "Valeria", form: ["L", "L", "W", "W", "W"] },
  { id: "team-ufc-6", sport: "ufc", name: "Rocco Salvatore", shortName: "Salvatore", country: "Meridia", form: ["W", "W", "W", "L", "W"] },
];

/** Every team name above is unique, so this never has to disambiguate —
 * but deriving slugs this way means a future new team can never
 * silently collide with an existing one either. */
export const TEAMS: Team[] = withUniqueSlugs([
  ...RAW_TEAMS.filter((t) => t.sport !== "football" && t.sport !== "hockey"),
  ...REAL_TEAMS,
]);

// Full, unfiltered mock roster (football/hockey included) — kept only so the
// literal event objects below in events.ts (which still reference the
// original fictional football/hockey team ids while being built, before
// those sports are filtered out of the final EVENTS export) can resolve via
// getTeam() without throwing. Never exported, never shown in any UI list.
const MOCK_TEAMS: Team[] = withUniqueSlugs(RAW_TEAMS);

export function getTeam(id: string): Team {
  const found = TEAMS.find((t) => t.id === id) ?? MOCK_TEAMS.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown team id: ${id}`);
  return found;
}

export function getTeamBySlug(sport: string, slug: string): Team | undefined {
  return TEAMS.find((t) => t.sport === sport && t.slug === slug);
}

export function getTeamsBySport(sport: string): Team[] {
  return TEAMS.filter((t) => t.sport === sport);
}
