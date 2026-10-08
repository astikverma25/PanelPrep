/**
 * Heuristic Echo Filter:
 * Detects whether the speech input transcribed by STT is actually the laptop speakers
 * echoing the AI's currently playing voice utterance.
 */
export function isEchoOfCurrentAiSpeech(
  recognizedText: string,
  currentAiPlayingSentence: string | null
): boolean {
  if (!currentAiPlayingSentence || !recognizedText) return false;

  const cleanRecognized = recognizedText.toLowerCase().replace(/[^\w\s]/g, "").trim();
  const cleanAi = currentAiPlayingSentence.toLowerCase().replace(/[^\w\s]/g, "").trim();

  if (cleanRecognized.length < 5) return false;

  // Check if recognized words are heavily overlapping with AI words currently playing
  const recognizedWords = cleanRecognized.split(/\s+/);
  const aiWords = new Set(cleanAi.split(/\s+/));

  let overlapCount = 0;
  for (const word of recognizedWords) {
    if (aiWords.has(word)) overlapCount++;
  }

  const overlapRatio = overlapCount / recognizedWords.length;
  // If more than 75% of recognized words are identical to the AI speech currently playing, flag as echo
  return overlapRatio > 0.75;
}
