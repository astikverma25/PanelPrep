import { FloorState, UtteranceSegment } from "../types/arena";

export type FloorEvent =
  | { type: "START_SESSION" }
  | { type: "MIC_PERMITTED" }
  | { type: "PREP_COMPLETE" }
  | { type: "MODERATOR_OPENING_END" }
  | { type: "STUDENT_SPEECH_START" }
  | { type: "STUDENT_SPEECH_FINAL"; segment: UtteranceSegment }
  | { type: "AI_BID_WON"; personaId: string }
  | { type: "AI_AUDIO_START" }
  | { type: "AI_AUDIO_END" }
  | { type: "STUDENT_BARGE_IN" }
  | { type: "START_CLOSING_ROUND" }
  | { type: "END_SESSION" }
  | { type: "ERROR_DEGRADED" };

export interface FloorMachineState {
  state: FloorState;
  activeSpeakerId: string | null;
  consecutiveAiTurns: number;
}

export function floorReducer(
  current: FloorMachineState,
  event: FloorEvent
): FloorMachineState {
  switch (event.type) {
    case "START_SESSION":
      return { ...current, state: "MIC_CHECK" };

    case "MIC_PERMITTED":
      return { ...current, state: "PREP" };

    case "PREP_COMPLETE":
      return { ...current, state: "MODERATOR_OPENING", activeSpeakerId: "moderator" };

    case "MODERATOR_OPENING_END":
      return { ...current, state: "LIVE_IDLE", activeSpeakerId: null, consecutiveAiTurns: 0 };

    case "STUDENT_SPEECH_START":
      return {
        ...current,
        state: "STUDENT_SPEAKING",
        activeSpeakerId: "user",
        consecutiveAiTurns: 0,
      };

    case "STUDENT_BARGE_IN":
      // Instant interrupt (<150ms)
      return {
        ...current,
        state: "STUDENT_SPEAKING",
        activeSpeakerId: "user",
        consecutiveAiTurns: 0,
      };

    case "STUDENT_SPEECH_FINAL":
      return { ...current, state: "LIVE_IDLE", activeSpeakerId: null };

    case "AI_BID_WON":
      return {
        ...current,
        state: "AI_THINKING",
        activeSpeakerId: event.personaId,
      };

    case "AI_AUDIO_START":
      return {
        ...current,
        state: "AI_SPEAKING",
      };

    case "AI_AUDIO_END":
      return {
        ...current,
        state: "LIVE_IDLE",
        activeSpeakerId: null,
        consecutiveAiTurns: current.consecutiveAiTurns + 1,
      };

    case "START_CLOSING_ROUND":
      return { ...current, state: "CLOSING_ROUND" };

    case "END_SESSION":
      return { ...current, state: "ENDED", activeSpeakerId: null };

    case "ERROR_DEGRADED":
      return { ...current, state: "DEGRADED" };

    default:
      return current;
  }
}
