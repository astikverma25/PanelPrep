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
    <div className="w-full space-y-6">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
