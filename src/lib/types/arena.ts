export type FloorState =
  | "SETUP"
  | "MIC_CHECK"
  | "PREP"
  | "MODERATOR_OPENING"
  | "LIVE_IDLE"
  | "STUDENT_SPEAKING"
  | "AI_THINKING"
  | "AI_SPEAKING"
  | "CLOSING_ROUND"
  | "ENDED"
  | "DEGRADED";

export type DiscussionPhase =
  | "prep"
  | "opening"
  | "discussion"
  | "closing"
  | "ended";

export interface UtteranceSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  isUser: boolean;
  startMs: number;
  endMs: number;
  text: string;
  interrupted: boolean;
  wordsSpoken?: number;
}

export interface SessionConfig {
  topic: string;
  panelSize: number; // 3, 4, 5
  durationMinutes: number; // 5, 8, 10
  patienceMs: number; // 600 - 2500 ms (default: 1200ms)
  isTextFallback: boolean;
}

export interface ParticipantScore {
  personaId: string;
  urgeScore: number;
  lastSpokeTimestamp: number;
  turnsSpokenCount: number;
}

export interface FloorContext {
  state: FloorState;
  phase: DiscussionPhase;
  activeSpeakerId: string | null;
  timeRemainingSeconds: number;
  consecutiveAiTurns: number;
  lastFloorFreeTimestamp: number;
  segments: UtteranceSegment[];
}
