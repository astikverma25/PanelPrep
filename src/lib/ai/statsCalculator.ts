import { UtteranceSegment } from "../types/arena";
import { DeterministicStats } from "../types/report";

const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "basically",
  "you know",
  "matlab",
  "toh",
  "actually",
  "sort of",
  "kind of",
];

export function calculateDeterministicStats(
  segments: UtteranceSegment[],
  totalDurationSeconds: number
): DeterministicStats {
  const talkShareMs: Record<string, number> = {};
  let totalSpeakingMs = 0;
  let userSpeakingMs = 0;
  let userTurnsCount = 0;
  let userTotalWords = 0;
  let timeToFirstContributionSeconds = totalDurationSeconds;
  let studentInterruptionsCount = 0;
  let aiInterruptionsCount = 0;
  let fillerWordsCount = 0;
  let questionsAskedCount = 0;
  let referencesToOthersCount = 0;

  let longestSilenceSeconds = 0;
  let lastUserSpokeEndMs = 0;

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const durationMs = Math.max(0, s.endMs - s.startMs);
    talkShareMs[s.speakerId] = (talkShareMs[s.speakerId] || 0) + durationMs;
    totalSpeakingMs += durationMs;

    const words = s.text.trim().split(/\s+/).filter(Boolean);

    if (s.isUser) {
      userTurnsCount++;
      userSpeakingMs += durationMs;
      userTotalWords += words.length;

      if (timeToFirstContributionSeconds === totalDurationSeconds) {
        timeToFirstContributionSeconds = Math.round(s.startMs / 1000);
      }

      if (lastUserSpokeEndMs > 0) {
        const gap = Math.round((s.startMs - lastUserSpokeEndMs) / 1000);
        if (gap > longestSilenceSeconds) longestSilenceSeconds = gap;
      }
      lastUserSpokeEndMs = s.endMs;

      // Filler words check
      const lower = s.text.toLowerCase();
      for (const filler of FILLER_WORDS) {
        const matches = lower.match(new RegExp(`\\b${filler}\\b`, "g"));
        if (matches) fillerWordsCount += matches.length;
      }

      // Questions check
      if (s.text.includes("?")) questionsAskedCount++;

      // References to others
      if (
        /arjun|meera|kabir|sana|rohan|dr\.?\s*nair|sir|ma'am|as .* said|agree with|disagree with/i.test(
          s.text
        )
      ) {
        referencesToOthersCount++;
      }
    }

    if (s.interrupted) {
      if (s.isUser) {
        aiInterruptionsCount++;
      } else {
        studentInterruptionsCount++;
      }
    }
  }

  const talkSharePercent: Record<string, number> = {};
  for (const [id, ms] of Object.entries(talkShareMs)) {
    talkSharePercent[id] =
      totalSpeakingMs > 0 ? Math.round((ms / totalSpeakingMs) * 100) : 0;
  }

  const userSpeakingMinutes = Math.max(0.1, userSpeakingMs / 60000);
  const studentWpm = Math.round(userTotalWords / userSpeakingMinutes);
  const studentAvgWordsPerTurn =
    userTurnsCount > 0 ? Math.round(userTotalWords / userTurnsCount) : 0;
  const fillerWordsPerMinute = Number(
    (fillerWordsCount / userSpeakingMinutes).toFixed(1)
  );

  return {
    talkSharePercent,
    studentTurnsCount: userTurnsCount,
    studentAvgWordsPerTurn,
    studentWpm,
    timeToFirstContributionSeconds,
    longestSilenceSeconds,
    studentInterruptionsCount,
    aiInterruptionsCount,
    fillerWordsPerMinute,
    fillerWordsCount,
    questionsAskedCount,
    referencesToOthersCount,
  };
}
