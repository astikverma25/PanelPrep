"use client";

import React, { useRef } from "react";
import { UtteranceSegment } from "@/lib/types/arena";
import { FileText, AlertCircle } from "lucide-react";
import { PERSONAS } from "@/lib/constants/personas";

interface InteractiveTranscriptProps {
  segments: UtteranceSegment[];
  highlightedSegmentId: string | null;
}

export const InteractiveTranscript: React.FC<InteractiveTranscriptProps> = ({
  segments,
  highlightedSegmentId,
}) => {
  const getSpeakerColor = (speakerId: string) => {
    if (speakerId === "user") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (speakerId === "moderator") return "text-indigo-400 border-indigo-500/30 bg-indigo-500/10";
    return "text-blue-400 border-blue-500/30 bg-blue-500/10";
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          Interactive Discussion Transcript
        </h4>
        <span className="text-xs text-slate-400">
          Click any evidence quote in the report to jump and highlight that moment
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {segments.map((s) => {
          const isHighlighted = highlightedSegmentId === s.id;
          return (
            <div
              id={`segment-${s.id}`}
              key={s.id}
              className={`p-3.5 rounded-xl border transition-all duration-500 ${
                isHighlighted
                  ? "bg-blue-600/25 border-blue-400 shadow-xl shadow-blue-500/20 ring-2 ring-blue-400/50 scale-[1.01]"
                  : "bg-slate-950/60 border-slate-850 hover:border-slate-750"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getSpeakerColor(
                      s.speakerId
                    )}`}
                  >
                    {s.speakerName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    #{s.id} &bull; {Math.round(s.startMs / 1000)}s
                  </span>
                </div>
                {s.interrupted && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Interrupted
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-200 leading-relaxed pl-1">
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
