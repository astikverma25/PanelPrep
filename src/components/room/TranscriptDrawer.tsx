"use client";

import React, { useRef, useEffect } from "react";
import { UtteranceSegment } from "@/lib/types/arena";
import { MessageSquare, AlertCircle } from "lucide-react";

interface TranscriptDrawerProps {
  segments: UtteranceSegment[];
}

export const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({ segments }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [segments]);

  const formatTime = (ms: number) => {
    // If ms is epoch (> 100000000000), calculate modulo hour
    const totalSec = ms > 100000000000 ? Math.floor((ms % 3600000) / 1000) : Math.floor(ms / 1000);
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl flex flex-col h-64 overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          Real-Time Transcript Log ({segments.length} turns)
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
        {segments.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
            Chronological speech transcripts will populate here in real time.
          </div>
        ) : (
          segments.map((s) => (
            <div
              key={s.id}
              className={`text-xs p-3 rounded-xl border transition-all ${
                s.isUser
                  ? "bg-emerald-50/60 border-emerald-200 text-slate-900 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-800 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-bold ${
                    s.isUser ? "text-emerald-700" : "text-blue-700"
                  }`}
                >
                  {s.speakerName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatTime(s.startMs)}
                </span>
              </div>
              <p className="leading-relaxed">{s.text}</p>
              {s.interrupted && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 mt-1 font-semibold">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Interrupted mid-sentence
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
