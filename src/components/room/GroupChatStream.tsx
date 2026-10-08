"use client";

import React, { useRef, useEffect } from "react";
import { UtteranceSegment, FloorState } from "@/lib/types/arena";
import { PERSONAS } from "@/lib/constants/personas";
import {
  MessageSquare,
  CheckCheck,
  AlertCircle,
  Volume2,
  Mic,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

interface GroupChatStreamProps {
  segments: UtteranceSegment[];
  activeSpeakerId: string | null;
  activeSpeakerName: string | null;
  activeAiSentence: string | null;
  currentInterimTranscript: string;
  floorState: FloorState;
  topic: string;
}

export const GroupChatStream: React.FC<GroupChatStreamProps> = ({
  segments,
  activeSpeakerId,
  activeSpeakerName,
  activeAiSentence,
  currentInterimTranscript,
  floorState,
  topic,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom smoothly on any new segment or live speech stream
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [segments, activeAiSentence, currentInterimTranscript, floorState]);

  const formatTime = (ms: number) => {
    const totalSec =
      ms > 100000000000 ? Math.floor((ms % 3600000) / 1000) : Math.floor(ms / 1000);
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getPersonaColor = (speakerId: string) => {
    if (speakerId === "user") return "#10B981";
    if (speakerId === "moderator") return "#6366F1";
    return PERSONAS[speakerId]?.color || "#3B82F6";
  };

  const getPersonaRole = (speakerId: string) => {
    if (speakerId === "user") return "Candidate";
    if (speakerId === "moderator") return "Moderator";
    return PERSONAS[speakerId]?.role || "Panelist";
  };

  const isUserSpeaking = floorState === "STUDENT_SPEAKING";
  const isAiSpeaking =
    floorState === "AI_SPEAKING" || floorState === "MODERATOR_OPENING";
  const isAiThinking = floorState === "AI_THINKING";

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[480px]">
      {/* WhatsApp / Chat Stream Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Live Panel Transcript Feed</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {segments.length} contributions &bull; Auto-scrolling active
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-mono">
          <span>GD Session Active</span>
        </div>
      </div>

      {/* Main Chat Scroll Body */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC]/50 scroll-smooth"
      >
        {/* Centered Topic Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] text-slate-600 max-w-lg text-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="line-clamp-1"><strong>Topic:</strong> {topic}</span>
          </div>
        </div>

        {/* Empty State */}
        {segments.length === 0 && !isUserSpeaking && !isAiSpeaking && !isAiThinking && (
          <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Mic className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs font-medium">Floor opened. Waiting for the first speaker...</p>
          </div>
        )}

        {/* Chronological Chat Messages */}
        {segments.map((seg) => {
          const isUser = seg.isUser;
          const color = getPersonaColor(seg.speakerId);
          const role = getPersonaRole(seg.speakerId);

          if (isUser) {
            // USER MESSAGE (RIGHT ALIGNED - WHATSAPP EMERALD / DARK STYLE)
            return (
              <div key={seg.id} className="flex justify-end gap-2.5 pl-8 sm:pl-16">
                <div className="flex flex-col items-end max-w-xl">
                  {/* Speaker Label */}
                  <div className="flex items-center gap-1.5 mb-1 pr-1">
                    <span className="text-[10px] font-bold text-emerald-700">You (Candidate)</span>
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-md space-y-1.5 relative group">
                    <p className="text-xs sm:text-sm leading-relaxed text-emerald-50">
                      {seg.text}
                    </p>

                    <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/90 font-mono">
                      <span>{formatTime(seg.startMs)}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                    </div>
                  </div>

                  {seg.interrupted && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold mt-1">
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      Interrupted
                    </span>
                  )}
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm mt-1">
                  Y
                </div>
              </div>
            );
          }

          // AI / MODERATOR MESSAGE (LEFT ALIGNED)
          const isMod = seg.speakerId === "moderator";
          return (
            <div key={seg.id} className="flex justify-start gap-2.5 pr-8 sm:pr-16">
              {/* Speaker Avatar */}
              <div
                className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm mt-1"
                style={{ backgroundColor: color }}
              >
                {seg.speakerName.charAt(0)}
              </div>

              <div className="flex flex-col items-start max-w-xl">
                {/* Speaker Label */}
                <div className="flex items-center gap-2 mb-1 pl-1">
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: isMod ? "#4F46E5" : "#0F172A" }}
                  >
                    {seg.speakerName}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full border ${
                      isMod
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {role}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl rounded-tl-xs shadow-sm space-y-1.5 border ${
                    isMod
                      ? "bg-indigo-50/50 border-indigo-200 text-slate-900"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-800">
                    {seg.text}
                  </p>

                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
                    <span>{formatTime(seg.startMs)}</span>
                  </div>
                </div>

                {seg.interrupted && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold mt-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    Interrupted mid-sentence
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* LIVE IN-PROGRESS SPEAKING BUBBLE (USER) */}
        {isUserSpeaking && currentInterimTranscript && (
          <div className="flex justify-end gap-2.5 pl-8 sm:pl-16 animate-fadeIn">
            <div className="flex flex-col items-end max-w-xl">
              <div className="flex items-center gap-1.5 mb-1 pr-1">
                <span className="text-[10px] font-bold text-emerald-700">You (Speaking now...)</span>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-500 text-slate-900 px-4 py-3 rounded-2xl rounded-tr-xs shadow-md space-y-1.5 ring-2 ring-emerald-500/20">
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {currentInterimTranscript}
                </p>
                <div className="flex items-center justify-end gap-1.5 text-[10px] text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Transcribing live audio...</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm mt-1 animate-pulse">
              Y
            </div>
          </div>
        )}

        {/* LIVE IN-PROGRESS SPEAKING BUBBLE (AI / MODERATOR) */}
        {isAiSpeaking && activeAiSentence && activeSpeakerName && (
          <div className="flex justify-start gap-2.5 pr-8 sm:pr-16 animate-fadeIn">
            <div
              className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md mt-1 animate-pulse"
              style={{ backgroundColor: getPersonaColor(activeSpeakerId || "") }}
            >
              {activeSpeakerName.charAt(0)}
            </div>

            <div className="flex flex-col items-start max-w-xl">
              <div className="flex items-center gap-2 mb-1 pl-1">
                <span className="text-[11px] font-bold text-slate-900">
                  {activeSpeakerName}
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Speaking Live
                </span>
              </div>

              <div className="bg-blue-50/70 border-2 border-blue-400 text-slate-900 px-4 py-3 rounded-2xl rounded-tl-xs shadow-md space-y-1.5 ring-2 ring-blue-400/20">
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {activeAiSentence}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] text-blue-700 font-bold">
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-2 bg-blue-600 rounded-full animate-bounce" />
                  </div>
                  <span>Audio synthesis active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI THINKING INDICATOR */}
        {isAiThinking && activeSpeakerName && (
          <div className="flex justify-start gap-2.5 pr-8 sm:pr-16 animate-fadeIn">
            <div
              className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm mt-1"
              style={{ backgroundColor: getPersonaColor(activeSpeakerId || "") }}
            >
              {activeSpeakerName.charAt(0)}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-sm flex items-center gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                <strong>{activeSpeakerName}</strong> is structuring an argument...
              </span>
            </div>
          </div>
        )}

        {/* Auto-scroll target */}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
};
