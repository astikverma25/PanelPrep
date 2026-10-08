export type PersonaId =
  | "moderator"
  | "arjun"
  | "meera"
  | "kabir"
  | "sana"
  | "rohan";

export interface PersonaProfile {
  id: PersonaId;
  name: string;
  role: string;
  avatar: string;
  color: string;
  talkativeness: number; // 0.0 - 2.5
  description: string;
  voiceConfig: {
    pitch: number;
    rate: number;
    preferredVoiceNames: string[];
  };
  cannedLines: string[];
}
