import { create } from "zustand";
import {
  FloorState,
  DiscussionPhase,
  UtteranceSegment,
  SessionConfig,
} from "../lib/types/arena";
import { GDReport } from "../lib/types/report";
import { PersonaProfile } from "../lib/types/personas";
import { PERSONAS } from "../lib/constants/personas";
import { CURATED_TOPICS } from "../lib/constants/topics";

interface SessionStoreState {
  // Session Configuration
  config: SessionConfig;
  activePersonas: PersonaProfile[];

  // Live Floor State
  floorState: FloorState;
  phase: DiscussionPhase;
  activeSpeakerId: string | null;
  timeRemainingSeconds: number;
  totalDurationSeconds: number;
  consecutiveAiTurns: number;

  // Live Captions & Speech Buffers
  currentInterimTranscript: string;
  activeAiSentence: string | null;
  segments: UtteranceSegment[];

  // Post-Session Report Data
  report: GDReport | null;

  // Actions
  setConfig: (config: Partial<SessionConfig>) => void;
  setFloorState: (state: FloorState) => void;
  setPhase: (phase: DiscussionPhase) => void;
  setActiveSpeakerId: (id: string | null) => void;
  setTimeRemaining: (sec: number) => void;
  setConsecutiveAiTurns: (turns: number) => void;
  setInterimTranscript: (text: string) => void;
  setActiveAiSentence: (sentence: string | null) => void;
  addSegment: (segment: UtteranceSegment) => void;
  setReport: (report: GDReport) => void;
  resetSession: () => void;
}

const DEFAULT_CONFIG: SessionConfig = {
  topic: CURATED_TOPICS[0].title,
  panelSize: 3,
  durationMinutes: 5,
  patienceMs: 1200,
  isTextFallback: false,
};

export const useSessionStore = create<SessionStoreState>((set) => ({
  config: DEFAULT_CONFIG,
  activePersonas: [PERSONAS.moderator, PERSONAS.arjun, PERSONAS.meera, PERSONAS.kabir],

  floorState: "SETUP",
  phase: "prep",
  activeSpeakerId: null,
  timeRemainingSeconds: 300,
  totalDurationSeconds: 300,
  consecutiveAiTurns: 0,

  currentInterimTranscript: "",
  activeAiSentence: null,
  segments: [],
  report: null,

  setConfig: (newConfig) =>
    set((state) => {
      const merged = { ...state.config, ...newConfig };
      const panelSize = merged.panelSize || 3;
      const personaList = [PERSONAS.moderator, PERSONAS.arjun, PERSONAS.meera, PERSONAS.kabir];
      if (panelSize >= 4) personaList.push(PERSONAS.sana);
      if (panelSize >= 5) personaList.push(PERSONAS.rohan);

      const durationSec = (merged.durationMinutes || 5) * 60;

      return {
        config: merged,
        activePersonas: personaList,
        totalDurationSeconds: durationSec,
        timeRemainingSeconds: durationSec,
      };
    }),

  setFloorState: (floorState) => set({ floorState }),
  setPhase: (phase) => set({ phase }),
  setActiveSpeakerId: (activeSpeakerId) => set({ activeSpeakerId }),
  setTimeRemaining: (timeRemainingSeconds) => set({ timeRemainingSeconds }),
  setConsecutiveAiTurns: (consecutiveAiTurns) => set({ consecutiveAiTurns }),
  setInterimTranscript: (currentInterimTranscript) => set({ currentInterimTranscript }),
  setActiveAiSentence: (activeAiSentence) => set({ activeAiSentence }),
  addSegment: (segment) =>
    set((state) => ({ segments: [...state.segments, segment] })),
  setReport: (report) => set({ report }),

  resetSession: () =>
    set((state) => ({
      floorState: "SETUP",
      phase: "prep",
      activeSpeakerId: null,
      timeRemainingSeconds: state.totalDurationSeconds,
      consecutiveAiTurns: 0,
      currentInterimTranscript: "",
      activeAiSentence: null,
      segments: [],
      report: null,
    })),
}));
