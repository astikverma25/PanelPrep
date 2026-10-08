"use client";

import React from "react";
import { PersonaProfile } from "@/lib/types/personas";
import { FloorState, UtteranceSegment } from "@/lib/types/arena";
import { GroupChatStream } from "./GroupChatStream";
import {
  Mic,
  Volume2,
  ShieldCheck,
  Zap,
  Flame,
  User,
  Sparkles,
  Award,
  Radio,
  Clock,
} from "lucide-react";

interface VirtualBoardroomArenaProps {
  personas: PersonaProfile[];
  activeSpeakerId: string | null;
  activeSpeakerName: string | null;
  activeAiSentence: string | null;
  currentInterimTranscript: string;
  floorState: FloorState;
  segments: UtteranceSegment[];
  topic: string;
}

export const VirtualBoardroomArena: React.FC<VirtualBoardroomArenaProps> = ({
  personas,
  activeSpeakerId,
  activeSpeakerName,
  activeAiSentence,
  currentInterimTranscript,
  floorState,
  segments,
  topic,
}) => {
  const isUserSpeaking = activeSpeakerId === "user";
  const moderator = personas.find((p) => p.id === "moderator");
  const aiParticipants = personas.filter((p) => p.id !== "moderator");

  // Divide AI participants between left wing and right wing of the boardroom table
  const leftWingParticipants = aiParticipants.filter((_, idx) => idx % 2 === 0);
  const rightWingParticipants = aiParticipants.filter((_, idx) => idx % 2 === 1);

  // User stats calculated on the fly
  const userSegments = segments.filter((s) => s.isUser);
  const userWordsCount = userSegments.reduce(
    (acc, s) => acc + s.text.trim().split(/\s+/).filter(Boolean).length,
    0
  );

  return (
    <div className="w-full relative">
      {/* Boardroom Ambient Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 mb-3 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold tracking-wider uppercase text-[11px] text-amber-400">
            Placement GD Arena &bull; High Stakes Mode
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="hidden sm:inline">Turn Contention: <strong className="text-emerald-400">Active (&lt;150ms)</strong></span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
            Table Size: {aiParticipants.length + 1} Candidates
          </span>
        </div>
      </div>

      {/* Real Room Conference Round-Table Grid */}
      <div className="relative w-full rounded-3xl bg-slate-100/80 border-2 border-slate-300/80 p-3 sm:p-5 shadow-lg space-y-4">
        {/* Subtle Conference Table Felt Texture & Center Ring */}
        <div className="absolute inset-4 rounded-3xl border border-dashed border-slate-300/60 pointer-events-none -z-0" />

        {/* 1. TOP: Head of the Table (Evaluator & Moderator Desk) */}
        {moderator && (
          <div className="flex justify-center relative z-10">
            <div
              className={`w-full max-w-md bg-white border-2 rounded-2xl p-3 sm:p-4 transition-all shadow-md flex items-center justify-between gap-3 ${
                activeSpeakerId === moderator.id
                  ? "border-indigo-500 bg-indigo-50/70 shadow-indigo-500/20 ring-2 ring-indigo-400/30 scale-[1.02]"
                  : "border-slate-300/80 hover:border-slate-400"
              }`}
            >
              {/* Evaluator Avatar & Desk Card */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-md"
                    style={{ backgroundColor: moderator.color }}
                  >
                    {moderator.name.charAt(0)}
                  </div>
                  {activeSpeakerId === moderator.id && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full shadow-md animate-bounce">
                      <Volume2 className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-black text-slate-950">
                      {moderator.name}
                    </h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Evaluator & Chair
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                    Head of Panel &bull; Scoring Rubric & Timekeeper
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right shrink-0">
                {activeSpeakerId === moderator.id ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 border border-indigo-300 text-[10px] font-bold text-indigo-800">
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-2 bg-indigo-600 rounded-full animate-bounce" />
                    </div>
                    <span>Interjecting</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                    Observing Desk
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. MIDDLE AREA: 3-Column Conference Layout (Left Wing Panelists, Center Chat Stream, Right Wing Panelists) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start relative z-10">
          {/* LEFT WING PANELISTS */}
          <div className="lg:col-span-3 space-y-3 flex flex-row lg:flex-col justify-center gap-2 lg:gap-3 flex-wrap">
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              <span>Left Wing Desks</span>
            </div>
            {leftWingParticipants.map((p, idx) => {
              const isSpeaking = activeSpeakerId === p.id;
              const isThinking =
                floorState === "AI_THINKING" && activeSpeakerId === p.id;

              return (
                <div
                  key={p.id}
                  className={`w-full bg-white border-2 p-3 rounded-2xl transition-all shadow-sm flex items-center justify-between gap-2.5 ${
                    isSpeaking
                      ? "border-blue-500 bg-blue-50/70 shadow-blue-500/15 ring-2 ring-blue-400/30 scale-[1.02]"
                      : isThinking
                      ? "border-blue-300 bg-blue-50/30 animate-pulse"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                        <span className="text-[9px] font-mono text-slate-400">
                          #{idx * 2 + 2}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{p.role}</p>
                    </div>
                  </div>

                  {isSpeaking ? (
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-blue-100 border border-blue-300 rounded text-[9px] font-bold text-blue-800 shrink-0">
                      <Volume2 className="w-3 h-3 text-blue-600 animate-pulse" />
                      <span>Speaking</span>
                    </div>
                  ) : isThinking ? (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                      Thinking...
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" title="Listening" />
                  )}
                </div>
              );
            })}
          </div>

          {/* CENTER: THE WHATSAPP-STYLE LIVE GROUP CHAT STREAM */}
          <div className="lg:col-span-6 w-full">
            <GroupChatStream
              segments={segments}
              activeSpeakerId={activeSpeakerId}
              activeSpeakerName={activeSpeakerName}
              activeAiSentence={activeAiSentence}
              currentInterimTranscript={currentInterimTranscript}
              floorState={floorState}
              topic={topic}
            />
          </div>

          {/* RIGHT WING PANELISTS */}
          <div className="lg:col-span-3 space-y-3 flex flex-row lg:flex-col justify-center gap-2 lg:gap-3 flex-wrap">
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              <span>Right Wing Desks</span>
            </div>
            {rightWingParticipants.map((p, idx) => {
              const isSpeaking = activeSpeakerId === p.id;
              const isThinking =
                floorState === "AI_THINKING" && activeSpeakerId === p.id;

              return (
                <div
                  key={p.id}
                  className={`w-full bg-white border-2 p-3 rounded-2xl transition-all shadow-sm flex items-center justify-between gap-2.5 ${
                    isSpeaking
                      ? "border-blue-500 bg-blue-50/70 shadow-blue-500/15 ring-2 ring-blue-400/30 scale-[1.02]"
                      : isThinking
                      ? "border-blue-300 bg-blue-50/30 animate-pulse"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                        <span className="text-[9px] font-mono text-slate-400">
                          #{idx * 2 + 3}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{p.role}</p>
                    </div>
                  </div>

                  {isSpeaking ? (
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-blue-100 border border-blue-300 rounded text-[9px] font-bold text-blue-800 shrink-0">
                      <Volume2 className="w-3 h-3 text-blue-600 animate-pulse" />
                      <span>Speaking</span>
                    </div>
                  ) : isThinking ? (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                      Thinking...
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" title="Listening" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. BOTTOM: The Candidate "Hot Seat" Desk (YOU) */}
        <div className="flex justify-center relative z-10 pt-1">
          <div
            className={`w-full max-w-xl bg-white border-2 rounded-3xl p-4 transition-all shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isUserSpeaking
                ? "border-emerald-500 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-400/40 scale-[1.02]"
                : "border-emerald-300/80 hover:border-emerald-400"
            }`}
          >
            {/* Candidate Identity & Hot Seat Desk Badge */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-md transition-all ${
                    isUserSpeaking
                      ? "bg-emerald-600 ring-4 ring-emerald-300 animate-pulse"
                      : "bg-emerald-700"
                  }`}
                >
                  YOU
                </div>
                {isUserSpeaking && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md animate-bounce ring-2 ring-white">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-950">
                    Candidate Desk #01 (You)
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Hot Seat
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  {userSegments.length} turns spoken &bull; {userWordsCount} words contributed
                </p>
              </div>
            </div>

            {/* Speaking Live Indicator & Hot Seat Pressure Tracker */}
            <div className="flex items-center gap-3">
              {isUserSpeaking ? (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md animate-pulse">
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-4.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce" />
                  </div>
                  <span>You Are Speaking Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-3 py-1.5 rounded-full">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Barge-in Ready (Speak Anytime)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
