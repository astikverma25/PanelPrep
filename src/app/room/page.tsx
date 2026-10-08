"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/hooks/useSessionStore";
import { STTService } from "@/lib/speech/sttService";
import { TTSService } from "@/lib/speech/ttsService";
import { calculateBids } from "@/lib/orchestrator/biddingEngine";
import { selectTurnIntent } from "@/lib/orchestrator/turnIntent";
import { evaluatePhaseProgression } from "@/lib/orchestrator/timerManager";
import { buildModeratorPrompt } from "@/lib/ai/prompts";
import { PERSONAS } from "@/lib/constants/personas";
import { isEchoOfCurrentAiSpeech } from "@/lib/speech/echoFilter";
import { saveReportToHistory } from "@/lib/storage/indexedDb";
import { calculateDeterministicStats } from "@/lib/ai/statsCalculator";
import { GDReport } from "@/lib/types/report";

import { ArenaStage } from "@/components/room/ArenaStage";
import { GroupChatStream } from "@/components/room/GroupChatStream";
import { RoomControls } from "@/components/room/RoomControls";
import { DebugOverlay } from "@/components/room/DebugOverlay";
import { NudgeToast } from "@/components/room/NudgeToast";
import { Clock, ShieldAlert, Sparkles, Volume2 } from "lucide-react";

export default function RoomPage() {
  const router = useRouter();
  const {
    config,
    activePersonas,
    floorState,
    phase,
    activeSpeakerId,
    timeRemainingSeconds,
    totalDurationSeconds,
    consecutiveAiTurns,
    currentInterimTranscript,
    activeAiSentence,
    segments,
    setFloorState,
    setPhase,
    setActiveSpeakerId,
    setTimeRemaining,
    setConsecutiveAiTurns,
    setInterimTranscript,
    setActiveAiSentence,
    addSegment,
    setReport,
  } = useSessionStore();

  const [isMuted, setIsMuted] = useState(false);
  const [biddingScores, setBiddingScores] = useState<Record<string, number>>({});
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
  const [prepCountdown, setPrepCountdown] = useState<number>(20);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Audio & speech services refs
  const sttRef = useRef<STTService | null>(null);
  const ttsRef = useRef<TTSService | null>(null);
  const userSpeechSilenceTimer = useRef<NodeJS.Timeout | null>(null);
  const activeAbortController = useRef<AbortController | null>(null);
  const segmentIdCounter = useRef<number>(1);
  const sessionStartMs = useRef<number>(Date.now());
  const userUtteranceStartMs = useRef<number>(0);
  const lastFinalizedUserRef = useRef<{ text: string; time: number }>({
    text: "",
    time: 0,
  });

  // 1. Initialize Speech Engines & Floor
  useEffect(() => {
    ttsRef.current = new TTSService();
    sessionStartMs.current = Date.now();

    if (!config.isTextFallback) {
      sttRef.current = new STTService({
        onSpeechStart: () => {
          handleUserSpeechDetected();
        },
        onSpeechEnd: () => {},
        onInterimResult: (text) => {
          if (isEchoOfCurrentAiSpeech(text, activeAiSentence)) return;
          setInterimTranscript(text);
          resetUserSilenceTimer(text);
        },
        onFinalResult: (text) => {
          if (isEchoOfCurrentAiSpeech(text, activeAiSentence)) return;
          finalizeUserSpeechTurn(text);
        },
        onError: (err) => {
          console.warn("STT Error:", err);
        },
      });

      sttRef.current.start();
    }

    setFloorState("PREP");
    setPhase("prep");

    return () => {
      if (sttRef.current) sttRef.current.stop();
      if (ttsRef.current) ttsRef.current.cancel();
      if (userSpeechSilenceTimer.current) {
        clearTimeout(userSpeechSilenceTimer.current);
        userSpeechSilenceTimer.current = null;
      }
    };
  }, []);

  // 2. Prep Countdown & Moderator Opening Flow
  useEffect(() => {
    if (phase === "prep") {
      const interval = setInterval(() => {
        setPrepCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            startModeratorOpening();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // 3. Discussion Timer & Moderator Interjections
  useEffect(() => {
    if (phase !== "discussion" && phase !== "closing") return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemainingSeconds - 1);

      const elapsed = totalDurationSeconds - (timeRemainingSeconds - 1);
      const decision = evaluatePhaseProgression(
        phase,
        elapsed,
        totalDurationSeconds
      );

      if (decision.nextPhase) {
        setPhase(decision.nextPhase);
      }

      if (decision.moderatorTrigger === "time_check") {
        triggerModeratorInterjection("time_check");
      } else if (decision.moderatorTrigger === "closing") {
        triggerModeratorInterjection("closing");
      }

      if (decision.nextPhase === "ended" || timeRemainingSeconds <= 1) {
        clearInterval(interval);
        handleEndDiscussion();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, timeRemainingSeconds]);

  // 4. Dead-Air & Floor Bidding Monitor
  useEffect(() => {
    if (floorState !== "LIVE_IDLE" || phase !== "discussion") return;

    const biddingTimeout = setTimeout(() => {
      runBiddingAndTriggerAiSpeaker();
    }, 1800); // 1.8s pause triggers AI bidding

    return () => clearTimeout(biddingTimeout);
  }, [floorState, phase, segments]);

  // Instant Barge-In (<150ms)
  const handleUserSpeechDetected = () => {
    if (floorState === "AI_SPEAKING" || floorState === "AI_THINKING") {
      // Abort active LLM call & cancel audio instantly
      if (activeAbortController.current) {
        activeAbortController.current.abort();
      }
      if (ttsRef.current) {
        ttsRef.current.cancel();
      }

      // Mark previous AI segment as interrupted
      if (segments.length > 0) {
        const last = segments[segments.length - 1];
        if (!last.isUser) {
          last.interrupted = true;
        }
      }
    }

    setFloorState("STUDENT_SPEAKING");
    setActiveSpeakerId("user");
    userUtteranceStartMs.current = Date.now();
  };

  const resetUserSilenceTimer = (text: string) => {
    if (userSpeechSilenceTimer.current) {
      clearTimeout(userSpeechSilenceTimer.current);
    }
    userSpeechSilenceTimer.current = setTimeout(() => {
      finalizeUserSpeechTurn(text);
    }, config.patienceMs);
  };

  const finalizeUserSpeechTurn = (text: string) => {
    // 1. Cancel silence timers immediately to prevent double-calls
    if (userSpeechSilenceTimer.current) {
      clearTimeout(userSpeechSilenceTimer.current);
      userSpeechSilenceTimer.current = null;
    }

    const cleanText = text ? text.trim() : "";
    if (!cleanText) return;

    // 2. Deduplicate: Ignore if exact same utterance was submitted within 3.5s
    const now = Date.now();
    const last = lastFinalizedUserRef.current;
    if (
      last.text &&
      (last.text.toLowerCase() === cleanText.toLowerCase() ||
        last.text.toLowerCase().includes(cleanText.toLowerCase())) &&
      now - last.time < 3500
    ) {
      setInterimTranscript("");
      return;
    }

    lastFinalizedUserRef.current = {
      text: cleanText,
      time: now,
    };

    const relativeStart = Math.max(
      0,
      (userUtteranceStartMs.current || (now - 2000)) - sessionStartMs.current
    );
    const relativeEnd = Math.max(relativeStart + 1000, now - sessionStartMs.current);

    const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
    const newSegment = {
      id: segId,
      speakerId: "user",
      speakerName: "You",
      isUser: true,
      startMs: relativeStart,
      endMs: relativeEnd,
      text: cleanText,
      interrupted: false,
    };

    addSegment(newSegment);
    setInterimTranscript("");
    setFloorState("LIVE_IDLE");
    setActiveSpeakerId(null);
    setConsecutiveAiTurns(0);
  };

  const startModeratorOpening = async () => {
    setFloorState("MODERATOR_OPENING");
    setPhase("opening");
    setActiveSpeakerId("moderator");

    const openingText = `Welcome everyone to today's group discussion on "${config.topic}". Please present clear, structured arguments, listen actively to your peers, and build on each other's points. The floor is now open for the first speaker.`;

    setActiveAiSentence(openingText);

    if (ttsRef.current) {
      await ttsRef.current.speak(
        openingText,
        PERSONAS.moderator,
        () => setFloorState("AI_SPEAKING"),
        () => {
          const now = Date.now();
          const relativeEnd = Math.max(3000, now - sessionStartMs.current);
          const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
          addSegment({
            id: segId,
            speakerId: "moderator",
            speakerName: "Dr. Nair",
            isUser: false,
            startMs: Math.max(0, relativeEnd - 4000),
            endMs: relativeEnd,
            text: openingText,
            interrupted: false,
          });
          setFloorState("LIVE_IDLE");
          setPhase("discussion");
          setActiveSpeakerId(null);
          setActiveAiSentence(null);
        }
      );
    }
  };

  const triggerModeratorInterjection = async (trigger: "time_check" | "closing") => {
    setActiveSpeakerId("moderator");
    setFloorState("AI_SPEAKING");

    const text =
      trigger === "time_check"
        ? "We are halfway through the allotted time. Let's make sure everyone contributes constructive recommendations."
        : "We have one minute remaining. I invite each participant to share a final concluding insight.";

    setActiveAiSentence(text);

    if (ttsRef.current) {
      await ttsRef.current.speak(
        text,
        PERSONAS.moderator,
        () => {},
        () => {
          const now = Date.now();
          const relativeEnd = Math.max(3000, now - sessionStartMs.current);
          const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
          addSegment({
            id: segId,
            speakerId: "moderator",
            speakerName: "Dr. Nair",
            isUser: false,
            startMs: Math.max(0, relativeEnd - 3000),
            endMs: relativeEnd,
            text,
            interrupted: false,
          });
          setFloorState("LIVE_IDLE");
          setActiveSpeakerId(null);
          setActiveAiSentence(null);
        }
      );
    }
  };

  const runBiddingAndTriggerAiSpeaker = async () => {
    const aiPersonas = activePersonas.filter((p) => p.id !== "moderator");
    const bidResult = calculateBids({
      personas: aiPersonas,
      segments,
      currentTimestamp: Date.now(),
      lastFloorSpeakerId: activeSpeakerId,
    });

    setBiddingScores(bidResult.scores);

    if (!bidResult.selectedPersona) return;

    const persona = bidResult.selectedPersona;
    const intent = selectTurnIntent(persona.id, segments, consecutiveAiTurns);

    setFloorState("AI_THINKING");
    setActiveSpeakerId(persona.id);

    try {
      const controller = new AbortController();
      activeAbortController.current = controller;

      const res = await fetch("/api/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: config.topic,
          phase,
          persona_id: persona.id,
          intent,
          time_remaining_s: timeRemainingSeconds,
          turns: segments.slice(-10).map((s) => ({
            speaker: s.speakerName,
            text: s.text,
          })),
          own_recent: segments
            .filter((s) => s.speakerId === persona.id)
            .map((s) => s.text),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error("Turn fetch failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullSpeech = "";

      setFloorState("AI_SPEAKING");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.sentence) {
                fullSpeech += " " + data.sentence;
                setActiveAiSentence(data.sentence);

                if (ttsRef.current) {
                  await ttsRef.current.speak(data.sentence, persona);
                }
              }
            } catch {}
          }
        }
      }

      if (fullSpeech.trim()) {
        const now = Date.now();
        const relativeEnd = Math.max(3000, now - sessionStartMs.current);
        const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
        addSegment({
          id: segId,
          speakerId: persona.id,
          speakerName: persona.name,
          isUser: false,
          startMs: Math.max(0, relativeEnd - 3500),
          endMs: relativeEnd,
          text: fullSpeech.trim(),
          interrupted: false,
        });
      }

      setFloorState("LIVE_IDLE");
      setActiveSpeakerId(null);
      setActiveAiSentence(null);
      setConsecutiveAiTurns(consecutiveAiTurns + 1);
    } catch (err) {
      console.warn("AI Turn error or interrupted:", err);
      setFloorState("LIVE_IDLE");
      setActiveSpeakerId(null);
      setActiveAiSentence(null);
    }
  };

  const handleEndDiscussion = async () => {
    setIsGeneratingReport(true);
    setFloorState("ENDED");
    if (sttRef.current) sttRef.current.stop();
    if (ttsRef.current) ttsRef.current.cancel();

    const durationSec = Math.max(10, totalDurationSeconds - timeRemainingSeconds || 300);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: config.topic,
          duration_s: durationSec,
          segments,
        }),
      });

      if (!res.ok) throw new Error("Report API non-200");
      const reportData: GDReport = await res.json();
      setReport(reportData);
      await saveReportToHistory(reportData);
      router.push("/report");
    } catch (err) {
      console.warn("Report generation fallback triggered:", err);
      // Deterministic Client-Side Fallback Report & Guaranteed Autosave
      const stats = calculateDeterministicStats(segments, durationSec);
      const fallbackReport: GDReport = {
        sessionId: `gd_${Date.now()}`,
        createdAt: new Date().toISOString(),
        topic: config.topic,
        durationSeconds: durationSec,
        stats,
        dimensions: [
          {
            name: "starting_the_discussion",
            displayName: "Starting the Discussion & Framing",
            score: stats.studentTurnsCount > 0 ? 3 : 1,
            summary: "Active participation in the discussion.",
            strengths: ["Clear participation."],
            improvements: ["Initiate definitions earlier in the round."],
            evidence: [],
          },
          {
            name: "quality_of_ideas",
            displayName: "Depth & Quality of Ideas",
            score: stats.studentTurnsCount > 0 ? 3 : 1,
            summary: "Articulated logical reasoning on core topic points.",
            strengths: ["Logical structure."],
            improvements: ["Cite relevant industry metrics."],
            evidence: [],
          },
          {
            name: "building_on_others",
            displayName: "Collaboration & Synthesis",
            score: stats.referencesToOthersCount > 0 ? 4 : 3,
            summary: "Engaged collaboratively with other participants.",
            strengths: ["Collaborative tone."],
            improvements: ["Synthesize conflicting viewpoints explicitly."],
            evidence: [],
          },
          {
            name: "listening",
            displayName: "Active Listening & Relevance",
            score: 4,
            summary: "Attentive engagement throughout conversational turns.",
            strengths: ["Relevant timing."],
            improvements: ["Directly address counter-arguments raised."],
            evidence: [],
          },
          {
            name: "handling_interruptions",
            displayName: "Composure & Turn Management",
            score: stats.studentInterruptionsCount > 2 ? 3 : 4,
            summary: "Handled floor transitions smoothly.",
            strengths: ["Maintained composure."],
            improvements: ["Hold or yield floor deliberately when barged into."],
            evidence: [],
          },
          {
            name: "ending_strongly",
            displayName: "Concluding & Summarizing",
            score: 3,
            summary: "Provided clear closing remarks.",
            strengths: ["Concise delivery."],
            improvements: ["Summarize unanimous conclusions explicitly."],
            evidence: [],
          },
        ],
        missed_openings: [],
        top_3_actions: [
          "Take initiative to define the discussion framework in the first 30 seconds.",
          "Acknowledge other participants by name when building or countering points.",
          "Synthesize conflicting viewpoints during the final closing round.",
        ],
        transcript: segments,
      };

      setReport(fallbackReport);
      await saveReportToHistory(fallbackReport);
      router.push("/report");
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      if (sttRef.current) sttRef.current.start();
      setIsMuted(false);
    } else {
      if (sttRef.current) sttRef.current.stop();
      setIsMuted(true);
    }
  };

  const formatTimer = (sec: number) => {
    const mm = Math.floor(Math.max(0, sec) / 60);
    const ss = String(Math.max(0, sec) % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const activeSpeakerName =
    activeSpeakerId === "user"
      ? "You"
      : PERSONAS[activeSpeakerId || ""]?.name || null;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col justify-between space-y-6">
      {/* Top Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="uppercase tracking-wider">{phase}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
            {config.topic}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Prep Phase Banner */}
      {phase === "prep" && (
        <div className="bg-indigo-50/70 border border-indigo-200 p-6 rounded-3xl text-center space-y-2 animate-pulse">
          <Sparkles className="w-6 h-6 text-indigo-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-950">
            Preparation Time: {prepCountdown}s
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Take a moment to structure your core arguments. Dr. Nair will open the room shortly.
          </p>
        </div>
      )}

      {/* Stage Grid of Participants */}
      <ArenaStage
        personas={activePersonas}
        activeSpeakerId={activeSpeakerId}
        floorState={floorState}
      />

      {/* Real-Time WhatsApp-Style Auto-Scrolling Panel Chat Feed */}
      <GroupChatStream
        segments={segments}
        activeSpeakerId={activeSpeakerId}
        activeSpeakerName={activeSpeakerName}
        activeAiSentence={activeAiSentence}
        currentInterimTranscript={currentInterimTranscript}
        floorState={floorState}
        topic={config.topic}
      />

      {/* Bottom Room Controls */}
      <RoomControls
        isMuted={isMuted}
        isTextMode={config.isTextFallback}
        onToggleMute={handleToggleMute}
        onLeaveRoom={handleEndDiscussion}
        onFastForwardDemo={() => {
          setTimeRemaining(30);
          setPhase("closing");
        }}
        onSendTextMessage={(text) => {
          handleUserSpeechDetected();
          finalizeUserSpeechTurn(text);
        }}
      />

      {/* Coach Nudges & Debug Overlay */}
      <NudgeToast
        message={nudgeMessage}
        onDismiss={() => setNudgeMessage(null)}
      />

      <DebugOverlay
        floorState={floorState}
        phase={phase}
        activeSpeakerId={activeSpeakerId}
        biddingScores={biddingScores}
        timeRemainingSeconds={timeRemainingSeconds}
      />
    </div>
  );
}
