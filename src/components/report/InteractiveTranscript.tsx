"use client";

import React from "react";
import { UtteranceSegment } from "@/lib/types/arena";
import { FileText, AlertCircle, User, Award, ShieldAlert, Sparkles } from "lucide-react";
import { PERSONAS } from "@/lib/constants/personas";

interface InteractiveTranscriptProps {
  segments: UtteranceSegment[];
  highlightedSegmentId: string | null;
}

export const InteractiveTranscript: React.FC<InteractiveTranscriptProps> = ({
  segments,
  highlightedSegmentId,
}) => {
  const formatTime = (ms: number) => {
    const totalSec = ms > 100000000000 ? Math.floor((ms % 3600000) / 1000) : Math.floor(ms / 1000);
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getPersona = (speakerId: string) => {
    if (speakerId === "user") {
      return {
        name: "You (Candidate Desk #01)",
        role: "Evaluated Candidate",
        color: "#10B981",
        isUser: true,
      };
    }
    if (speakerId === "moderator") {
      return {
        name: "Dr. Nair",
        role: "GD Moderator & Evaluator",
        color: "#6366F1",
        isUser: false,
      };
    }
    const p = PERSONAS[speakerId];
    return {
      name: p?.name || speakerId,
      role: p?.role || "AI Panelist",
      color: p?.color || "#3B82F6",
      isUser: false,
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-950 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>Interactive Discussion Transcript</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {segments.length} turns
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Every candidate and AI response tagged with chronological turn ID and exact timestamp.
          </p>
        </div>
        <div className="text-xs text-blue-600 font-medium bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-200/60 shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Click any report quote to auto-jump</span>
        </div>
      </div>

      <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1.5 scroll-smooth">
        {segments.map((s) => {
          const isHighlighted = highlightedSegmentId === s.id;
          const persona = getPersona(s.speakerId);
          const isUser = s.isUser || s.speakerId === "user";
          const isMod = s.speakerId === "moderator";

          return (
            <div
              id={`segment-${s.id}`}
              key={s.id}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 relative ${
                isHighlighted
                  ? "bg-amber-50 border-amber-400 shadow-lg ring-4 ring-amber-400/30 scale-[1.01]"
                  : isUser
                  ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border-emerald-400/80 shadow-xs"
                  : isMod
                  ? "bg-gradient-to-r from-indigo-50/70 to-slate-50/60 border-indigo-300/80 shadow-xs"
                  : "bg-white border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* Speaker Header */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Avatar Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs ${
                      isUser ? "bg-emerald-600" : isMod ? "bg-indigo-600" : ""
                    }`}
                    style={!isUser && !isMod ? { backgroundColor: persona.color } : {}}
                  >
                    {isUser ? <User className="w-4 h-4" /> : isMod ? <Award className="w-4 h-4" /> : persona.name.charAt(0)}
                  </div>

                  {/* Speaker Name Pill */}
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${
                      isUser
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-2xs"
                        : isMod
                        ? "bg-indigo-600 text-white border-indigo-700 shadow-2xs"
                        : "bg-slate-100 text-slate-900 border-slate-200"
                    }`}
                  >
                    {persona.name}
                  </span>

                  {/* Role Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      isUser
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : isMod
                        ? "bg-indigo-100 text-indigo-900 border border-indigo-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {persona.role}
                  </span>

                  {/* Turn ID and Timestamp */}
                  <span className="text-[10px] text-slate-400 font-mono">
                    #{s.id} &bull; {formatTime(s.startMs)}
                  </span>
                </div>

                {s.interrupted && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Interrupted
                  </span>
                )}
              </div>

              {/* Spoken Text */}
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "text-slate-950 font-medium pl-1 border-l-2 border-emerald-500"
                    : isMod
                    ? "text-indigo-950 font-medium pl-1 border-l-2 border-indigo-400"
                    : "text-slate-800 pl-1 border-l-2 border-slate-200"
                }`}
              >
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
