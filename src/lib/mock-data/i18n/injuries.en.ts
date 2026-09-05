import type { Injury } from "@/lib/types";

export const INJURIES_EN: Record<string, Pick<Injury, "description">> = {
  "injury-1": {
    description:
      "Suffered a hamstring injury in a closed training session and will be out for at least one game.",
  },
  "injury-2": {
    description: "Mild knee discomfort — a game-time decision, with a final call expected on match day.",
  },
  "injury-3": {
    description:
      "Picked up a wrist injury in the previous match and will miss this game — Andre Silva steps into the top defensive pairing in his place.",
  },
  "injury-4": {
    description:
      "Playing through mild shoulder discomfort — the coaching staff isn't expecting any limits on his ice time.",
  },
};
