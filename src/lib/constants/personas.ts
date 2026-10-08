import { PersonaProfile } from "../types/personas";

export const PERSONAS: Record<string, PersonaProfile> = {
  moderator: {
    id: "moderator",
    name: "Dr. Nair",
    role: "Moderator",
    avatar: "/avatars/moderator.png",
    color: "#6366F1", // Indigo
    talkativeness: 0.0,
    description: "Neutral, structured, time-aware, redirects drifting conversations.",
    voiceConfig: {
      pitch: 1.0,
      rate: 1.0,
      preferredVoiceNames: ["Google UK English Male", "en-GB", "Daniel"],
    },
    cannedLines: [
      "Let us maintain focus on the core implications of this topic.",
      "Thank you everyone. Let's make sure all perspectives are heard.",
      "We have limited time remaining, let us direct our points toward constructive solutions."
    ],
  },
  arjun: {
    id: "arjun",
    name: "Arjun",
    role: "The Dominator",
    avatar: "/avatars/arjun.png",
    color: "#EF4444", // Red
    talkativeness: 1.8,
    description: "Has strong opinions, assertive, interrupts occasionally, initiates arguments vigorously.",
    voiceConfig: {
      pitch: 0.85,
      rate: 1.15,
      preferredVoiceNames: ["Google UK English Male", "en-US", "Alex"],
    },
    cannedLines: [
      "I strongly disagree with that assumption. The market reality is completely different.",
      "Let's look at the hard truth here instead of sugarcoating the problem.",
      "That sounds ideal in theory, but on the ground execution completely collapses."
    ],
  },
  meera: {
    id: "meera",
    name: "Meera",
    role: "The Analyst",
    avatar: "/avatars/meera.png",
    color: "#3B82F6", // Blue
    talkativeness: 1.2,
    description: "Data-driven, highly structured, breaks complex problems into logical pillars.",
    voiceConfig: {
      pitch: 1.1,
      rate: 0.95,
      preferredVoiceNames: ["Google UK English Female", "en-GB", "Karen", "Samantha"],
    },
    cannedLines: [
      "If we analyze the core metrics, there are two distinct drivers to consider.",
      "Building on that point, empirical data from recent studies points to a significant trend.",
      "We need to evaluate both the short-term capital cost and long-term efficiency gains."
    ],
  },
  kabir: {
    id: "kabir",
    name: "Kabir",
    role: "The Quiet One",
    avatar: "/avatars/kabir.png",
    color: "#10B981", // Emerald
    talkativeness: 0.4,
    description: "Speaks rarely but delivers razor-sharp, impactful insights when invited or after silence.",
    voiceConfig: {
      pitch: 0.9,
      rate: 0.9,
      preferredVoiceNames: ["Google US English", "en-US", "Fred"],
    },
    cannedLines: [
      "There is an overlooked ethical dimension here that we haven't touched upon.",
      "I think we are focusing on symptoms rather than the root cause.",
      "The key nuance is not whether we adopt it, but how responsibly we regulate it."
    ],
  },
  sana: {
    id: "sana",
    name: "Sana",
    role: "The Drifter",
    avatar: "/avatars/sana.png",
    color: "#F59E0B", // Amber
    talkativeness: 1.1,
    description: "Brings lively creative ideas and anecdotes, occasionally drifting off the central thesis.",
    voiceConfig: {
      pitch: 1.25,
      rate: 1.05,
      preferredVoiceNames: ["Google UK English Female", "en-US", "Victoria", "Tessa"],
    },
    cannedLines: [
      "This reminds me of what happened recently in consumer behavior trends during the pandemic.",
      "What if we look at this from a completely grassroots lifestyle angle?",
      "I read an interesting story the other day about how small startups approached this."
    ],
  },
  rohan: {
    id: "rohan",
    name: "Rohan",
    role: "The Diplomat",
    avatar: "/avatars/rohan.png",
    color: "#8B5CF6", // Purple
    talkativeness: 1.0,
    description: "Bridges conflicting views, synthesizes opposing sides, and plays constructive devil's advocate.",
    voiceConfig: {
      pitch: 1.0,
      rate: 1.0,
      preferredVoiceNames: ["Google UK English Male", "en-IN", "Oliver"],
    },
    cannedLines: [
      "I see valid points on both sides: Arjun highlights the execution risks, while Meera brings the strategic upside.",
      "Could we find middle ground by phasing the implementation over time?",
      "Let's synthesize these two arguments to see where our consensus lies."
    ],
  },
};
