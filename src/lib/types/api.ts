import { PersonaId } from "./personas";
import { DiscussionPhase, UtteranceSegment } from "./arena";

export type TurnIntent =
  | "agree_and_extend"
  | "challenge"
  | "ask_question"
  | "bring_example"
  | "redirect"
  | "summarise"
  | "drift"
  | "invite_student"
  | "opening"
  | "time_check"
  | "closing";

export interface TurnApiRequest {
  topic: string;
  phase: DiscussionPhase;
  persona_id: PersonaId;
  intent: TurnIntent;
  time_remaining_s: number;
  turns: Array<{ speaker: string; text: string }>;
  own_recent: string[];
}

export interface ReportApiRequest {
  topic: string;
  duration_s: number;
  segments: UtteranceSegment[];
}

export interface ModerateApiRequest {
  topic: string;
}

export interface ModerateApiResponse {
  allowed: boolean;
  reason?: string;
}
