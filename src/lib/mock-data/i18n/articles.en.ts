import type { ArticleStatBlock } from "@/lib/types";

export const ARTICLES_EN: Record<
  string,
  {
    title: string;
    category: string;
    excerpt: string;
    intro: string;
    body: string[];
    stats?: ArticleStatBlock[];
  }
> = {
  "article-1": {
    title: "Northbridge United — Real Alcazar: Tactical Preview Ahead of a Decisive Match",
    category: "Analysis",
    excerpt:
      "Northbridge United host Real Alcazar in a match that could decide the league leader. We break down the key factors: current form, injury setbacks, and the head-to-head record.",
    intro:
      "Northbridge United host Real Alcazar in one of the most eagerly anticipated fixtures of the round. Both sides arrive in good form, but an unexpected injury blow for the hosts could shape how the match unfolds.",
    body: [
      "Northbridge United have picked up 10 points from their last 5 league matches and sit comfortably in the top half of the table. The club also boasts one of the best home records in the league, winning 4 of their last 5 on their own turf.",
      "The eve of the match brought bad news, though: star striker Marko Delić suffered a hamstring injury in training and will miss the game. Delić has scored 40% of the team's goals this season, making his absence the biggest question mark heading into kickoff.",
      "Real Alcazar, meanwhile, arrive in the best form of their season — three wins and a draw in their last four matches across all competitions. Their defense has looked noticeably more solid of late, backed up by the numbers on chances conceded.",
      "The head-to-head record between the sides has been tightly contested in recent seasons: of the last five meetings, the hosts have won twice, the visitors once, with two draws. Four of those five matches saw a goal scored in each half — a trend worth keeping in mind when weighing the likely scoreline.",
      "Taking everything into account — a slight edge in form and home advantage for the hosts, offset by a significant attacking absence — this one looks evenly poised. The full AI Match Analysis, with a complete breakdown of outcome probabilities, is available on the event page.",
    ],
    stats: [
      { label: "Northbridge United form (last 5)", value: "W-W-D-L-W" },
      { label: "Real Alcazar form (last 5)", value: "L-W-W-W-D" },
      { label: "Head-to-head (last 5)", value: "2-2-1" },
      { label: "Marko Delić's share of season goals", value: "40% of the team's total goals" },
    ],
  },
  "article-2": {
    title: "Steel Bears — Arctic Kings: Why Orlov's Injury Could Decide the Game",
    category: "Analysis",
    excerpt:
      "Steel Bears host Arctic Kings in a match where the numbers say the teams are evenly matched — but the visitors' loss of a key defenseman could tip the balance.",
    intro:
      "Steel Bears and Arctic Kings head into their meeting with strikingly similar scoring numbers, and their last four encounters haven't produced a clear favorite. But news on the eve of the game — the absence of the visitors' top defenseman — could change the picture.",
    body: [
      "Steel Bears and Arctic Kings are averaging 3.4 and 3.1 goals per game this season, respectively, while allowing 2.6 and 2.9 — a negligible gap that puts the two teams on roughly equal footing offensively.",
      "The big story ahead of the game is a wrist injury to Arctic Kings defenseman Dmitri Orlov, the team's leader in average ice time on the blue line this season. His spot on the top pairing goes to Andre Silva, who is set for a significant jump in minutes.",
      "For the hosts, forward Viktor Lindqvist is listed as a game-time decision — he's playing through mild shoulder discomfort, though the coaching staff doesn't expect it to limit his ice time.",
      "The teams' last four meetings have been razor-thin: three of the four were decided by a single goal. With the visitors' blue line weakened, the game could tilt toward Steel Bears, but the numbers point to a tight contest likely to be decided in the final minutes.",
      "The full AI Match Analysis, with a complete breakdown of outcome probabilities and every contributing factor, is available on the event page.",
    ],
    stats: [
      { label: "Steel Bears form (last 5)", value: "L-D-W-W-W" },
      { label: "Arctic Kings form (last 5)", value: "W-L-W-L-W" },
      { label: "Head-to-head (last 4)", value: "2-2, 3 of 4 decided by one goal" },
      { label: "Dmitri Orlov's status", value: "Out (wrist injury)" },
    ],
  },
  "article-3": {
    title: "Volkov vs. Takahashi: Center-Court Preview",
    category: "Analysis",
    excerpt:
      "D. Volkov and A. Takahashi meet on the center court at the Grand Circuit Masters — Volkov leads the head-to-head series, but his opponent arrives on a hot streak.",
    intro:
      "D. Volkov's match against A. Takahashi is shaping up as one of the most anticipated at this stage of the Grand Circuit Masters. Volkov goes in as the favorite based on the head-to-head record, but Takahashi's recent form suggests this prediction should be treated with caution.",
    body: [
      "Volkov has won 4 of his last 5 matches on this surface and continues to ride one of the best runs of his season. A reliable serve remains his biggest weapon in the clutch games.",
      "Takahashi, meanwhile, has split results over his last five matches, but the wins came against top-20 opponents — a sign of just how high his ceiling is right now.",
      "Volkov leads the head-to-head series 3-1, including a straight-sets win in their most recent meeting. That statistical edge is one of the factors the demo prediction model weighs on the event page.",
    ],
    stats: [
      { label: "Head-to-head", value: "Volkov leads 3-1" },
      { label: "Volkov form (last 5)", value: "W-W-W-L-W" },
      { label: "Takahashi form (last 5)", value: "L-W-W-L-W" },
    ],
  },
  "article-4": {
    title: "Nova Sentinel vs. Vertex Gaming: Map Breakdown Ahead of the Apex Championship Series",
    category: "Analysis",
    excerpt:
      "Nova Sentinel arrive on a four-map win streak, but Vertex Gaming's map pool makes this matchup less predictable than it looks on paper.",
    intro:
      "Nova Sentinel take on Vertex Gaming in one of the pivotal group-stage matches of the Apex Championship Series. Both teams have made roster changes in recent weeks, adding an extra layer of uncertainty to the map-pool breakdown.",
    body: [
      "Nova Sentinel have won 4 of their last 5 maps in a row and go into this match as the favorite on current form. The team also made a roster change a week before the tournament started, though the coaching staff says it hasn't affected the team's consistency.",
      "Vertex Gaming have traditionally been stronger on maps with tighter, more closed-off positions — a key factor to weigh when projecting the likely map pool for this series.",
      "Given current form and the map statistics, the demo model gives Nova Sentinel a slight edge, though with a meaningful degree of uncertainty tied to the map pool.",
    ],
    stats: [
      { label: "Nova Sentinel's win streak", value: "4 maps in a row" },
      { label: "Vertex Gaming's strength", value: "Maps with tighter, closed-off positions" },
    ],
  },
  "article-5": {
    title: "Ember Guard vs. Titan Forge: What Will Decide This Global Rift Invitational Clash",
    category: "Analysis",
    excerpt:
      "Ember Guard swept their last series 2-0 and go into the match against Titan Forge as the favorite — but their opponent is dangerous in the early game.",
    intro:
      "Ember Guard face Titan Forge in a match that could shape the standings at the Global Rift Invitational. Both teams favor an aggressive early draft, promising a fast-paced game.",
    body: [
      "Ember Guard swept their last series 2-0 and have leaned into an aggressive early draft in recent showcase matches — a strategy that has already delivered two straight convincing wins.",
      "Titan Forge have shown a strong early game in recent tournaments, which could make this match a quick one if either side gets off to a fast start.",
      "The demo model rates the two teams as close to even, with a slight lean toward Ember Guard on the strength of current form.",
    ],
    stats: [
      { label: "Ember Guard's last series", value: "Won 2-0" },
      { label: "Titan Forge's strength", value: "Early game" },
    ],
  },
  "article-6": {
    title: "Solar Flare vs. Golden Spire: Breaking Down the Bracket Royale Series Semifinal",
    category: "Analysis",
    excerpt:
      "Solar Flare arrive at the semifinal riding a comeback win and 4 wins in their last 5 matches — Golden Spire will need an answer for their late-game strength.",
    intro:
      "Solar Flare face Golden Spire in a match that will shape the picture ahead of the Bracket Royale Series final. The higher seed comes in with confidence after a recent comeback win.",
    body: [
      "Solar Flare have won 4 of their last 5 tournament matches, including a comeback win in the previous round, where they clawed back after dropping the first map.",
      "Golden Spire have been the more consistent team across the season, but the head-to-head record from their last two meetings favors Solar Flare.",
      "The demo model gives a clear edge to Solar Flare based on current form and head-to-head history, while noting this is only one possible way the match could play out.",
    ],
    stats: [
      { label: "Solar Flare form (last 5)", value: "W-W-W-L-W" },
      { label: "Head-to-head (last 2)", value: "Solar Flare — 2 wins" },
    ],
  },
  "article-7": {
    title: "Continental Premier League Form Guide: Previewing the New Round",
    category: "Review",
    excerpt:
      "Ahead of the new Continental Premier League round, we break down the form of six clubs — from Real Alcazar's confident run to Vantage Athletic's inconsistent results.",
    intro:
      "The Continental Premier League heads into a new round with several teams locked in a tight title race. Here's a look at each club's form and what to watch for in their upcoming matches.",
    body: [
      "Real Alcazar arrive in the best form of their season — three wins and a draw in their last four matches across all competitions, with a defense that has visibly tightened up.",
      "Northbridge United continue to set a strong pace at home, but the loss of their key striker ahead of their next match adds uncertainty to their attacking setup.",
      "Sterling FC are unbeaten in three straight matches and head into their meeting with Meridian City on one of the season's best defensive runs.",
      "Vantage Athletic and Iron Coast SC have both been more inconsistent, trading wins and losses without settling into any real rhythm.",
      "Meridian City have announced their entire first-choice squad is available for selection ahead of their next match — a rare stretch of the season free of injury concerns.",
    ],
    stats: [
      { label: "Best run of the round", value: "Real Alcazar — 3W-1D in 4 matches" },
      { label: "Longest unbeaten streak", value: "Sterling FC — 3 matches" },
    ],
  },
  "article-8": {
    title: "Vance vs. Osei: Previewing the UFC Fight Night Main Event",
    category: "Analysis",
    excerpt:
      "Dominic Vance and Kenji Osei arrive in almost identical form — 4 wins in their last 5 fights apiece. We break down what could tip the balance.",
    intro:
      "The main event of the next UFC Fight Night pits Dominic Vance against Kenji Osei — both fighters arrive on a run of confident results, and their recent form is nearly impossible to separate.",
    body: [
      "Vance has won 4 of his last 5 fights, exactly matching Osei's record. Based on recent form alone, the two are close to even, with no clear favorite on that measure.",
      "The difference shows up in how their fights have ended: Vance more often gets the finish, while Osei has more often gone the distance in his recent bouts. The demo model treats this as a small but real edge for Vance.",
      "Both fighters made weight without issue at the official weigh-in — the scale won't be a source of uncertainty this time, as it sometimes is heading into a fight like this.",
      "With form running close to even and a modest edge to Vance in finishing rate, the demo model gives him a moderate edge while flagging this as one of the closest fights on the card. The full AI Match Analysis is available on the event page.",
    ],
    stats: [
      { label: "Vance form (last 5)", value: "W-W-L-W-W" },
      { label: "Osei form (last 5)", value: "W-L-W-W-W" },
      { label: "Weigh-in status", value: "Both made weight" },
    ],
  },
};
