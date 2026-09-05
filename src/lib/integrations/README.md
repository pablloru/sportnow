# External integrations (not wired up in V1)

This folder is where real external clients live once V1 moves past mock
data — a Sports API client, a News API client, an Odds API client, each
implementing the same return shapes the repositories in `src/lib/repositories`
already expect.

Nothing in `app/`, `components/`, or `lib/services` should ever import
from here directly. The repository layer is the only caller, e.g.:

```ts
// src/lib/repositories/event.repository.ts (future version)
import { sportsApiClient } from "@/lib/integrations/sports-api";

export const eventRepository = {
  async listBySport(sport: string) {
    return sportsApiClient.getEvents({ sport });
  },
  // ...
};
```

Suggested first clients to add here:

- `sports-api.ts` — events, teams, players, statistics, lineups
- `news-api.ts` — news articles
- `odds-api.ts` — odds movement, used as a raw signal for `lib/intelligence/impact-scoring.ts`

Keep API keys in environment variables (see `.env.example`) — never
hardcode them in this folder.
