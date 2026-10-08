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
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
        isSpeaking
          ? "bg-slate-900/90 border-emerald-500/80 shadow-xl shadow-emerald-500/20 scale-[1.03]"
          : isThinking
          ? "bg-slate-900/70 border-blue-500/60 shadow-lg shadow-blue-500/10 animate-pulse"
          : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Speaking Glow Ring */}
      <div className="relative mb-3">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md transition-transform ${
            isSpeaking ? "scale-110" : ""
          }`}
          style={{
            backgroundColor: color,
            boxShadow: isSpeaking ? `0 0 25px ${color}80` : undefined,
          }}
        >
          {name.charAt(0)}
        </div>

        {isSpeaking && (
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md animate-bounce">
            <Volume2 className="w-3 h-3" />
          </div>
        )}

        {isThinking && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full shadow-md animate-spin">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-1">
        <h4 className="text-sm font-bold text-white">{name}</h4>
        {isUser ? (
          <Badge type="user" />
        ) : persona?.id === "moderator" ? (
          <Badge type="moderator" />
        ) : (
          <Badge type="ai" />
        )}
      </div>

      <p className="text-[11px] text-slate-400 text-center line-clamp-1">{role}</p>

      {isSpeaking && (
        <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          Speaking
        </div>
      )}
    </div>
  );
};
