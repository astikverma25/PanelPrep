"use client";

import React from "react";
import { PersonaProfile } from "@/lib/types/personas";
import { ParticipantCard } from "./ParticipantCard";

interface ArenaStageProps {
  personas: PersonaProfile[];
  activeSpeakerId: string | null;
  floorState: string;
}

export const ArenaStage: React.FC<ArenaStageProps> = ({
  personas,
  activeSpeakerId,
  floorState,
}) => {
  const isUserSpeaking = activeSpeakerId === "user";
  const moderator = personas.find((p) => p.id === "moderator");
  const aiParticipants = personas.filter((p) => p.id !== "moderator");

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Virtual GD Panelist Table
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          {aiParticipants.length + 1} Candidates &bull; 1 Moderator
        </span>
      </div>

      {/* Moderator Spot on Top */}
      {moderator && (
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <ParticipantCard
              persona={moderator}
              isSpeaking={activeSpeakerId === moderator.id}
              isThinking={floorState === "AI_THINKING" && activeSpeakerId === moderator.id}
            />
          </div>
        </div>
      )}

      {/* Grid of AI Panelists + Candidate */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* User Card */}
        <ParticipantCard
          isUser
          isSpeaking={isUserSpeaking}
          roleDescription="Candidate"
        />

        {/* AI Panelists */}
        {aiParticipants.map((p) => (
          <ParticipantCard
            key={p.id}
            persona={p}
            isSpeaking={activeSpeakerId === p.id}
            isThinking={floorState === "AI_THINKING" && activeSpeakerId === p.id}
          />
        ))}
      </div>
    </div>
  );
};
