import { UtteranceSegment } from "./arena";

export interface EvidenceQuote {
  segment_id: string;
  quote: string;
  note: string;
}

export interface FeedbackDimension {
  name:
    | "starting_the_discussion"
    | "quality_of_ideas"
    | "building_on_others"
    | "listening"
    | "handling_interruptions"
    | "ending_strongly";
  displayName: string;
  score: number; // 1 to 5
  summary: string;
  strengths: string[];
  improvements: string[];
  evidence: EvidenceQuote[];
}

export interface MissedOpening {
  after_segment_id: string;
  context_snippet: string;
  suggestion: string;
}

export interface DeterministicStats {
  talkSharePercent: Record<string, number>; // speakerId -> percentage
  studentTurnsCount: number;
  studentAvgWordsPerTurn: number;
  studentWpm: number;
  timeToFirstContributionSeconds: number;
  longestSilenceSeconds: number;
  studentInterruptionsCount: number;
  aiInterruptionsCount: number;
  fillerWordsPerMinute: number;
  fillerWordsCount: number;
  questionsAskedCount: number;
  referencesToOthersCount: number;
}

export interface GDReport {
  sessionId: string;
  createdAt: string;
  topic: string;
  durationSeconds: number;
  stats: DeterministicStats;
  dimensions: FeedbackDimension[];
  missed_openings: MissedOpening[];
  top_3_actions: string[];
  transcript: UtteranceSegment[];
}
