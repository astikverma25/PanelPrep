import { PersonaProfile } from "../types/personas";
import { UtteranceSegment } from "../types/arena";

export interface BiddingInput {
  personas: PersonaProfile[];
  segments: UtteranceSegment[];
  currentTimestamp: number;
  lastFloorSpeakerId: string | null;
}

export interface BidResult {
  selectedPersona: PersonaProfile | null;
  scores: Record<string, number>;
  reason: string;
}

/**
 * Calculates AI speaker urge score according to PRD section 6.2:
 * urge = talkativeness
 *      + 2.0 if directly addressed by name in the last utterance
 *      + 0.3 * seconds_since_last_spoke (capped at 3.0)
 *      - 1.5 if spoke in the last turn
 *      - 0.8 if spoke twice in the last 4 turns
 *      + random jitter (0 to 0.4)
 */
export function calculateBids(input: BiddingInput): BidResult {
  const { personas, segments, currentTimestamp, lastFloorSpeakerId } = input;
  const scores: Record<string, number> = {};

  if (personas.length === 0) {
    return { selectedPersona: null, scores: {}, reason: "No personas available" };
  }

  const lastSegment = segments.length > 0 ? segments[segments.length - 1] : null;
  const last4Segments = segments.slice(-4);

  let highestScore = -Infinity;
  let winner: PersonaProfile | null = null;

  for (const persona of personas) {
    // Moderators have special programmatic rules, they don't participate in standard bidding
    if (persona.id === "moderator") {
      scores[persona.id] = -100;
      continue;
    }

    let score = persona.talkativeness;

    // 1. Direct Name Address Check (+2.0)
    if (lastSegment && lastSegment.text.toLowerCase().includes(persona.name.toLowerCase())) {
      score += 2.0;
    }

    // 2. Time Since Last Spoke (+0.3 * sec, capped at +3.0)
    const lastSpokeSegment = [...segments].reverse().find((s) => s.speakerId === persona.id);
    const secondsSinceLastSpoke = lastSpokeSegment
      ? Math.max(0, (currentTimestamp - lastSpokeSegment.endMs) / 1000)
      : 15; // default 15s if hasn't spoken yet
    score += Math.min(3.0, 0.3 * secondsSinceLastSpoke);

    // 3. Penalty if spoke in the last turn (-1.5)
    if (lastFloorSpeakerId === persona.id) {
      score -= 1.5;
    }

    // 4. Penalty if spoke twice in the last 4 turns (-0.8)
    const recentTurnsCount = last4Segments.filter((s) => s.speakerId === persona.id).length;
    if (recentTurnsCount >= 2) {
      score -= 0.8;
    }

    // 5. Random Jitter (0 to 0.4) for natural variety
    score += Math.random() * 0.4;

    scores[persona.id] = Number(score.toFixed(2));

    if (score > highestScore) {
      highestScore = score;
      winner = persona;
    }
  }

  // Minimum threshold check (e.g. threshold = 0.5)
  const THRESHOLD = 0.5;
  if (highestScore < THRESHOLD) {
    return {
      selectedPersona: null,
      scores,
      reason: `Highest score ${highestScore.toFixed(2)} was below threshold ${THRESHOLD}`,
    };
  }

  return {
    selectedPersona: winner,
    scores,
    reason: `Selected ${winner?.name} with highest score ${highestScore.toFixed(2)}`,
  };
}
