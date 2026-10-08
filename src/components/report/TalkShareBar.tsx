import React from "react";
import { PERSONAS } from "@/lib/constants/personas";

interface TalkShareBarProps {
  talkShare: Record<string, number>;
}

export const TalkShareBar: React.FC<TalkShareBarProps> = ({ talkShare }) => {
  const getColor = (speakerId: string) => {
    if (speakerId === "user") return "#10B981"; // Emerald
    return PERSONAS[speakerId]?.color || "#6366F1";
  };

  const getName = (speakerId: string) => {
    if (speakerId === "user") return "You";
    return PERSONAS[speakerId]?.name || speakerId;
  };

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
        <span>Talk Share Distribution</span>
        <span className="text-[11px] text-slate-500">
          Ideal for 4-5 panel: 18% - 28%
        </span>
      </div>

      {/* Multi-color Progress Bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
        {Object.entries(talkShare).map(([speakerId, percent]) => {
          if (percent <= 0) return null;
          return (
            <div
              key={speakerId}
              style={{
                width: `${percent}%`,
                backgroundColor: getColor(speakerId),
              }}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 relative group"
              title={`${getName(speakerId)}: ${percent}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {Object.entries(talkShare).map(([speakerId, percent]) => (
          <div key={speakerId} className="flex items-center gap-1.5 text-xs text-slate-700">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getColor(speakerId) }}
            />
            <span className="font-medium">{getName(speakerId)}:</span>
            <span className="font-bold text-slate-950">{percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
