"use client";

import React from "react";
import { PersonaProfile } from "@/lib/types/personas";
import { Badge } from "../common/Badge";
import { Mic, Volume2 } from "lucide-react";

interface ParticipantCardProps {
  persona?: PersonaProfile;
  isUser?: boolean;
  isSpeaking: boolean;
  isThinking?: boolean;
  roleDescription?: string;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  persona,
  isUser = false,
  isSpeaking,
  isThinking = false,
}) => {
  const name = isUser ? "You" : persona?.name || "AI Participant";
  const role = isUser ? "Candidate" : persona?.role || "Panelist";
  const color = isUser ? "#10B981" : persona?.color || "#3B82F6";

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 shadow-sm ${
        isSpeaking
          ? "bg-emerald-50/70 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.02] ring-2 ring-emerald-500/30"
          : isThinking
          ? "bg-blue-50/60 border-blue-400 shadow-md shadow-blue-500/10 animate-pulse"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Speaking Glow Ring & Avatar */}
      <div className="relative mb-2 sm:mb-2.5">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base sm:text-lg font-bold text-white shadow-md transition-all ${
            isSpeaking ? "scale-105 ring-4 ring-emerald-400/40" : ""
          }`}
          style={{
            backgroundColor: color,
            boxShadow: isSpeaking ? `0 0 16px ${color}90` : undefined,
          }}
        >
          {name.charAt(0)}
        </div>

        {isSpeaking && (
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md">
            <Volume2 className="w-3 h-3 animate-pulse" />
          </div>
        )}

        {isThinking && (
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-md animate-spin">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-0.5">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{name}</h4>
        {isUser ? (
          <Badge type="user" />
        ) : persona?.id === "moderator" ? (
          <Badge type="moderator" />
        ) : (
          <Badge type="ai" />
        )}
      </div>

      <p className="text-[10px] sm:text-[11px] text-slate-500 text-center line-clamp-1 font-medium">
        {role}
      </p>

      {/* Live Equalizer or Status */}
      {isSpeaking ? (
        <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-[9px] text-emerald-800 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-0.5">
            <span className="w-0.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-0.5 h-3.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-0.5 h-2 bg-emerald-600 rounded-full animate-bounce" />
          </div>
          <span>Speaking</span>
        </div>
      ) : isThinking ? (
        <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-blue-100/80 border border-blue-300 text-[9px] text-blue-800 font-bold uppercase tracking-wider">
          <span>Thinking</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 mt-1.5 text-[9px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span>Listening</span>
        </div>
      )}
    </div>
  );
};
