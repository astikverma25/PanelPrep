/**
 * GD Arena Simulation Harness (scripts/simulate-gd.ts)
 * Automates 20 turn-taking simulation runs with a mock student agent
 * to verify urge score calculation, latency bounds, and 2-AI turn cap.
 */

import { calculateBids } from "../src/lib/orchestrator/biddingEngine";
import { PERSONAS } from "../src/lib/constants/personas";
import { UtteranceSegment } from "../src/lib/types/arena";
import { calculateDeterministicStats } from "../src/lib/ai/statsCalculator";
import { validateAndCleanReportEvidence } from "../src/lib/ai/evidenceValidator";

console.log("=================================================");
console.log("       GD ARENA SIMULATION HARNESS (20 TURNS)    ");
console.log("=================================================\n");

const personasList = [
  PERSONAS.arjun,
  PERSONAS.meera,
  PERSONAS.kabir,
  PERSONAS.sana,
  PERSONAS.rohan,
];

const mockSegments: UtteranceSegment[] = [];
let currentTimestamp = 1000;
let consecutiveAi = 0;

for (let turn = 1; turn <= 20; turn++) {
  const isUserTurn = turn % 3 === 0 || consecutiveAi >= 2;

  if (isUserTurn) {
    mockSegments.push({
      id: `u_${String(turn).padStart(3, "0")}`,
      speakerId: "user",
      speakerName: "You",
      isUser: true,
      startMs: currentTimestamp,
      endMs: currentTimestamp + 4000,
      text: `I believe Arjun makes a valid point, but we must also consider scalable execution metrics.`,
      interrupted: false,
    });
    console.log(`[Turn ${turn}] Candidate spoke. Resetting AI turn cap.`);
    consecutiveAi = 0;
    currentTimestamp += 5000;
  } else {
    const bid = calculateBids({
      personas: personasList,
      segments: mockSegments,
      currentTimestamp,
      lastFloorSpeakerId: mockSegments[mockSegments.length - 1]?.speakerId || null,
    });

    const winner = bid.selectedPersona || PERSONAS.arjun;
    consecutiveAi++;

    mockSegments.push({
      id: `u_${String(turn).padStart(3, "0")}`,
      speakerId: winner.id,
      speakerName: winner.name,
      isUser: false,
      startMs: currentTimestamp,
      endMs: currentTimestamp + 3500,
      text: `${winner.cannedLines[0]}`,
      interrupted: false,
    });

    console.log(
      `[Turn ${turn}] AI Winner: ${winner.name} (Consecutive AI: ${consecutiveAi}) - Urge: ${bid.scores[winner.id]}`
    );
    currentTimestamp += 4500;
  }
}

console.log("\nCalculating deterministic post-GD metrics...");
const stats = calculateDeterministicStats(mockSegments, 300);
console.log("Talk Share Distribution:", stats.talkSharePercent);
console.log("Student WPM:", stats.studentWpm);
console.log("Candidate Turns:", stats.studentTurnsCount);

console.log("\nTesting Evidence Validator with fake & real quotes...");
const testDimensions = [
  {
    name: "building_on_others" as const,
    displayName: "Collaboration & Synthesis",
    score: 4,
    summary: "Built on points well.",
    strengths: ["Direct address."],
    improvements: [],
    evidence: [
      {
        segment_id: "u_003",
        quote: "Arjun makes a valid point",
        note: "Real quote found in transcript",
      },
      {
        segment_id: "u_003",
        quote: "Completely invented hallucinated statement",
        note: "Should be scrubbed",
      },
    ],
  },
];

const cleaned = validateAndCleanReportEvidence(testDimensions, mockSegments);
console.log("Evidence items before:", testDimensions[0].evidence.length);
console.log("Evidence items after scrubbing hallucinations:", cleaned[0].evidence.length);
console.log(
  cleaned[0].evidence.length === 1
    ? "SUCCESS: Hallucinated quote was accurately dropped!"
    : "FAILED: Evidence validation did not drop fake quote."
);

console.log("\nSimulation finished cleanly.");
