import { DiscussionPhase } from "../types/arena";

export interface PhaseTransitionDecision {
  nextPhase: DiscussionPhase | null;
  moderatorTrigger: "opening" | "time_check" | "closing" | null;
}

export function evaluatePhaseProgression(
  currentPhase: DiscussionPhase,
  elapsedSeconds: number,
  totalDurationSeconds: number
): PhaseTransitionDecision {
  const PREP_DURATION = 20; // 20s prep time
  const remainingSeconds = totalDurationSeconds - elapsedSeconds;

  if (currentPhase === "prep" && elapsedSeconds >= PREP_DURATION) {
    return { nextPhase: "opening", moderatorTrigger: "opening" };
  }

  // 50% Time Check Interjection
  const halfDuration = totalDurationSeconds / 2;
  if (
    currentPhase === "discussion" &&
    Math.abs(elapsedSeconds - halfDuration) < 2
  ) {
    return { nextPhase: null, moderatorTrigger: "time_check" };
  }

  // 1 Minute Closing Round
  if (currentPhase === "discussion" && remainingSeconds <= 60) {
    return { nextPhase: "closing", moderatorTrigger: "closing" };
  }

  // Time ended
  if (remainingSeconds <= 0 && currentPhase !== "ended") {
    return { nextPhase: "ended", moderatorTrigger: null };
  }

  return { nextPhase: null, moderatorTrigger: null };
}
