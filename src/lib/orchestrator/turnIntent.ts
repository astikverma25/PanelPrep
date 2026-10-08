import { TurnIntent } from "../types/api";
import { PersonaId } from "../types/personas";
import { UtteranceSegment } from "../types/arena";

export function selectTurnIntent(
  personaId: PersonaId,
  segments: UtteranceSegment[],
  consecutiveAiTurns: number
): TurnIntent {
  // If 2 AI turns have already completed, enforce direct invitation to student or open question
  if (consecutiveAiTurns >= 2) {
    return "invite_student";
  }

  const lastSegment = segments[segments.length - 1];
  const lastSpeakerIsUser = lastSegment ? lastSegment.isUser : false;

  // Persona specific tendencies
  switch (personaId) {
    case "arjun":
      return lastSpeakerIsUser ? "challenge" : Math.random() > 0.4 ? "challenge" : "bring_example";
    case "meera":
      return "bring_example";
    case "sana":
      return Math.random() > 0.5 ? "drift" : "bring_example";
    case "rohan":
      return Math.random() > 0.5 ? "summarise" : "agree_and_extend";
    case "kabir":
      return "agree_and_extend";
    case "moderator":
      return "redirect";
    default:
      return "agree_and_extend";
  }
}
