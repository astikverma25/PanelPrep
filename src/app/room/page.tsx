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

import { ArenaStage } from "@/components/room/ArenaStage";
import { LiveCaptions } from "@/components/room/LiveCaptions";
import { TranscriptDrawer } from "@/components/room/TranscriptDrawer";
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
  const userUtteranceStartMs = useRef<number>(0);

  // 1. Initialize Speech Engines & Floor
  useEffect(() => {
    ttsRef.current = new TTSService();

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
      if (userSpeechSilenceTimer.current) clearTimeout(userSpeechSilenceTimer.current);
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
    if (userSpeechSilenceTimer.current) clearTimeout(userSpeechSilenceTimer.current);
    userSpeechSilenceTimer.current = setTimeout(() => {
      finalizeUserSpeechTurn(text);
    }, config.patienceMs);
  };

  const finalizeUserSpeechTurn = (text: string) => {
    if (!text || text.trim().length === 0) return;

    const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
    const newSegment = {
      id: segId,
      speakerId: "user",
      speakerName: "You",
      isUser: true,
      startMs: userUtteranceStartMs.current || Date.now() - 2000,
      endMs: Date.now(),
      text: text.trim(),
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
          const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
          addSegment({
            id: segId,
            speakerId: "moderator",
            speakerName: "Dr. Nair",
            isUser: false,
            startMs: Date.now() - 4000,
            endMs: Date.now(),
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
          const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
          addSegment({
            id: segId,
            speakerId: "moderator",
            speakerName: "Dr. Nair",
            isUser: false,
            startMs: Date.now() - 3000,
            endMs: Date.now(),
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
        const segId = `u_${String(segmentIdCounter.current++).padStart(3, "0")}`;
        addSegment({
          id: segId,
          speakerId: persona.id,
          speakerName: persona.name,
          isUser: false,
          startMs: Date.now() - 3000,
          endMs: Date.now(),
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

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: config.topic,
          duration_s: totalDurationSeconds - timeRemainingSeconds || 300,
          segments,
        }),
      });

      const reportData = await res.json();
      setReport(reportData);
      await saveReportToHistory(reportData);
      router.push("/report");
    } catch (err) {
      console.error("Report generation failed:", err);
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-arena-border p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="uppercase tracking-wider">{phase}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
            {config.topic}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-white">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Prep Phase Banner */}
      {phase === "prep" && (
        <div className="bg-indigo-950/40 border border-indigo-500/50 p-6 rounded-3xl text-center space-y-2 animate-pulse">
          <Sparkles className="w-6 h-6 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            Preparation Time: {prepCountdown}s
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
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

      {/* Live Captions */}
      <LiveCaptions
        speakerName={activeSpeakerName}
        captionText={activeAiSentence || currentInterimTranscript}
        isUser={activeSpeakerId === "user"}
      />

      {/* Real-Time Transcript Drawer */}
      <TranscriptDrawer segments={segments} />

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
