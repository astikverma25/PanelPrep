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
    if (speakerId === "user") return "text-emerald-700 border-emerald-200 bg-emerald-50";
    if (speakerId === "moderator") return "text-indigo-700 border-indigo-200 bg-indigo-50";
    return "text-blue-700 border-blue-200 bg-blue-50";
  };

  const formatTime = (ms: number) => {
    const totalSec = ms > 100000000000 ? Math.floor((ms % 3600000) / 1000) : Math.floor(ms / 1000);
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Interactive Discussion Transcript
        </h4>
        <span className="text-xs text-slate-500">
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
                  ? "bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-400/40 scale-[1.01]"
                  : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getSpeakerColor(
                      s.speakerId
                    )}`}
                  >
                    {s.speakerName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    #{s.id} &bull; {formatTime(s.startMs)}
                  </span>
                </div>
                {s.interrupted && (
                  <span className="text-[10px] text-amber-700 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Interrupted
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-800 leading-relaxed pl-1">
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
