import type { Player } from "@/lib/types";
import { withUniqueSlugs } from "./helpers";
import { getTeam } from "./teams";

/**
 * V1 ships full rosters for two events: the "featured" football match
 * and the "popular" hockey match (see events.ts) — those are the two
 * event pages built out to full depth (lineups + injuries +
 * intelligence). Every other event still works because Lineup/Player
 * are optional on the Event type; the UI simply omits the lineup
 * section when absent. Only these ~60 players get a player detail
 * page — every other team on the platform simply has no roster to
 * link out to yet, same "optional, gracefully omitted" pattern.
 */
const RAW_PLAYERS: Omit<Player, "slug">[] = [
  // Northbridge United
  { id: "p-nbu-1", teamId: "team-football-1", name: "Tomas Hartley", position: "GK", number: 1 },
  { id: "p-nbu-2", teamId: "team-football-1", name: "Erik Solberg", position: "DF", number: 2 },
  { id: "p-nbu-3", teamId: "team-football-1", name: "Casey Whitfield", position: "DF", number: 3 },
  { id: "p-nbu-4", teamId: "team-football-1", name: "Bruno Alves", position: "DF", number: 4 },
  { id: "p-nbu-5", teamId: "team-football-1", name: "Yannick Dubois", position: "DF", number: 5 },
  { id: "p-nbu-6", teamId: "team-football-1", name: "Felix Reyes", position: "MF", number: 6 },
  { id: "p-nbu-8", teamId: "team-football-1", name: "Diego Ramirez", position: "MF", number: 8 },
  { id: "p-nbu-9", teamId: "team-football-1", name: "Marko Delić", position: "FW", number: 9, isKeyPlayer: true },
  { id: "p-nbu-10", teamId: "team-football-1", name: "Sami Ojala", position: "MF", number: 10 },
  { id: "p-nbu-11", teamId: "team-football-1", name: "Théo Marchand", position: "FW", number: 11 },
  { id: "p-nbu-17", teamId: "team-football-1", name: "Kwame Asante", position: "FW", number: 17 },
  { id: "p-nbu-19", teamId: "team-football-1", name: "Nico Fischer", position: "FW", number: 19 },
  { id: "p-nbu-14", teamId: "team-football-1", name: "Luca Moretti", position: "MF", number: 14 },
  { id: "p-nbu-21", teamId: "team-football-1", name: "Owen Blackwood", position: "DF", number: 21 },
  { id: "p-nbu-22", teamId: "team-football-1", name: "Igor Petrov", position: "GK", number: 22 },

  // Real Alcazar
  { id: "p-alc-1", teamId: "team-football-2", name: "Iker Fuentes", position: "GK", number: 1 },
  { id: "p-alc-2", teamId: "team-football-2", name: "Rui Cardoso", position: "DF", number: 2 },
  { id: "p-alc-3", teamId: "team-football-2", name: "Adrian Kowalski", position: "DF", number: 3 },
  { id: "p-alc-4", teamId: "team-football-2", name: "Bastien Leroux", position: "DF", number: 4 },
  { id: "p-alc-5", teamId: "team-football-2", name: "Marcus Vance", position: "DF", number: 5 },
  { id: "p-alc-6", teamId: "team-football-2", name: "Tobias Lindgren", position: "MF", number: 6 },
  { id: "p-alc-7", teamId: "team-football-2", name: "Andres Villalobos", position: "FW", number: 7, isKeyPlayer: true },
  { id: "p-alc-8", teamId: "team-football-2", name: "Emre Yildiz", position: "MF", number: 8 },
  { id: "p-alc-9", teamId: "team-football-2", name: "Julian Kaas", position: "FW", number: 9 },
  { id: "p-alc-10", teamId: "team-football-2", name: "Nikolai Sokolov", position: "MF", number: 10 },
  { id: "p-alc-11", teamId: "team-football-2", name: "Rafael Nunes", position: "FW", number: 11 },
  { id: "p-alc-15", teamId: "team-football-2", name: "Marco Bianchi", position: "MF", number: 15 },
  { id: "p-alc-17", teamId: "team-football-2", name: "Samir Haddad", position: "DF", number: 17 },
  { id: "p-alc-20", teamId: "team-football-2", name: "Leon Brandt", position: "MF", number: 20 },
  { id: "p-alc-23", teamId: "team-football-2", name: "Peter Halvorsen", position: "GK", number: 23 },

  // Steel Bears (hockey)
  { id: "p-stb-1", teamId: "team-hockey-2", name: "Aleksander Novak", position: "G", number: 30 },
  { id: "p-stb-2", teamId: "team-hockey-2", name: "Milo Ferreira", position: "G", number: 1 },
  { id: "p-stb-3", teamId: "team-hockey-2", name: "Jonas Eklund", position: "D", number: 4 },
  { id: "p-stb-4", teamId: "team-hockey-2", name: "Tobias Reyes", position: "D", number: 6 },
  { id: "p-stb-5", teamId: "team-hockey-2", name: "Karel Novotny", position: "D", number: 2 },
  { id: "p-stb-6", teamId: "team-hockey-2", name: "Simon Aleksic", position: "D", number: 55 },
  { id: "p-stb-7", teamId: "team-hockey-2", name: "Viktor Lindqvist", position: "F", number: 9, isKeyPlayer: true },
  { id: "p-stb-8", teamId: "team-hockey-2", name: "Dario Kolar", position: "F", number: 17 },
  { id: "p-stb-9", teamId: "team-hockey-2", name: "Erik Malinowski", position: "F", number: 21 },
  { id: "p-stb-10", teamId: "team-hockey-2", name: "Noah Beaulieu", position: "F", number: 14 },
  { id: "p-stb-11", teamId: "team-hockey-2", name: "Petr Vaclavik", position: "F", number: 71 },
  { id: "p-stb-12", teamId: "team-hockey-2", name: "Adam Ostrowski", position: "F", number: 88 },
  { id: "p-stb-13", teamId: "team-hockey-2", name: "Lucas Ferreira", position: "F", number: 19 },
  { id: "p-stb-14", teamId: "team-hockey-2", name: "Filip Horvat", position: "D", number: 23 },
  { id: "p-stb-15", teamId: "team-hockey-2", name: "Mateo Silva", position: "F", number: 10 },

  // Arctic Kings (hockey)
  { id: "p-ark-1", teamId: "team-hockey-3", name: "Bjorn Halvorsen", position: "G", number: 35 },
  { id: "p-ark-2", teamId: "team-hockey-3", name: "Yannis Petrou", position: "G", number: 1 },
  { id: "p-ark-3", teamId: "team-hockey-3", name: "Connor Bailey", position: "D", number: 5 },
  { id: "p-ark-4", teamId: "team-hockey-3", name: "Dmitri Orlov", position: "D", number: 44, isKeyPlayer: true },
  { id: "p-ark-5", teamId: "team-hockey-3", name: "Sven Larsen", position: "D", number: 7 },
  { id: "p-ark-6", teamId: "team-hockey-3", name: "Owen Fitzgerald", position: "D", number: 3 },
  { id: "p-ark-7", teamId: "team-hockey-3", name: "Kaito Nakamura", position: "F", number: 91 },
  { id: "p-ark-8", teamId: "team-hockey-3", name: "Lars Bergstrom", position: "F", number: 16 },
  { id: "p-ark-9", teamId: "team-hockey-3", name: "Milan Kovac", position: "F", number: 29 },
  { id: "p-ark-10", teamId: "team-hockey-3", name: "Ruben De Groot", position: "F", number: 12 },
  { id: "p-ark-11", teamId: "team-hockey-3", name: "Tomasz Wojcik", position: "F", number: 77 },
  { id: "p-ark-12", teamId: "team-hockey-3", name: "Elias Moreau", position: "F", number: 8 },
  { id: "p-ark-13", teamId: "team-hockey-3", name: "Andre Silva", position: "D", number: 22 },
  { id: "p-ark-14", teamId: "team-hockey-3", name: "Piotr Zielinski", position: "F", number: 11 },
  { id: "p-ark-15", teamId: "team-hockey-3", name: "Hugo Fernandes", position: "F", number: 18 },
];

export const PLAYERS: Player[] = withUniqueSlugs(RAW_PLAYERS);

export function getPlayer(id: string): Player | undefined {
  return PLAYERS.find((p) => p.id === id);
}

export function getPlayersByTeam(teamId: string): Player[] {
  return PLAYERS.filter((p) => p.teamId === teamId);
}

export function getPlayerBySlug(sport: string, slug: string): Player | undefined {
  return PLAYERS.find((p) => p.slug === slug && getTeam(p.teamId).sport === sport);
}
