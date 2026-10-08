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

  // If the candidate just spoke or interrupted, personas must directly engage with them
  if (lastSpeakerIsUser) {
    switch (personaId) {
      case "arjun":
        return "challenge"; // Directly challenge/counter the candidate
      case "meera":
        return "challenge"; // Challenge with analytical scrutiny or metrics
      case "kabir":
        return "agree_and_extend"; // Constructively validate and bridge
      case "sana":
        return "bring_example"; // Bring a creative real-world case supporting/extending the candidate
      case "rohan":
        return "agree_and_extend"; // Summarize and validate
      default:
        return "agree_and_extend";
    }
  }

  // Persona specific tendencies during AI-to-AI exchanges
  switch (personaId) {
    case "arjun":
      return Math.random() > 0.4 ? "challenge" : "bring_example";
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
