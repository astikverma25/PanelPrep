import { UtteranceSegment } from "../types/arena";
import { FeedbackDimension, EvidenceQuote } from "../types/report";

/**
 * Strict evidence validator per PRD section 8.3:
 * Verifies that every quote supplied by the LLM is an exact or normalized substring
 * of the corresponding transcript segment. Drops hallucinated quotes.
 */
export function validateAndCleanReportEvidence(
  dimensions: FeedbackDimension[],
  segments: UtteranceSegment[]
): FeedbackDimension[] {
  const segmentMap = new Map<string, string>();
  for (const seg of segments) {
    segmentMap.set(seg.id, normalizeText(seg.text));
  }

  return dimensions.map((dim) => {
    const verifiedEvidence: EvidenceQuote[] = [];

    for (const item of dim.evidence || []) {
      const originalSegmentText = segmentMap.get(item.segment_id);
      if (!originalSegmentText) {
        continue; // invalid segment ID, drop
      }

      const normalizedQuote = normalizeText(item.quote);
      if (normalizedQuote.length > 3 && originalSegmentText.includes(normalizedQuote)) {
        verifiedEvidence.push(item);
      }
    }

    return {
      ...dim,
      evidence: verifiedEvidence,
    };
  });
}

function normalizeText(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
