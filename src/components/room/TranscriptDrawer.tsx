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

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col h-64 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          Real-Time Transcript Log ({segments.length} turns)
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
        {segments.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            Chronological speech transcripts will populate here in real time.
          </div>
        ) : (
          segments.map((s) => (
            <div
              key={s.id}
              className={`text-xs p-2.5 rounded-xl border transition-all ${
                s.isUser
                  ? "bg-emerald-950/20 border-emerald-800/40 text-slate-200"
                  : "bg-slate-900/60 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-bold ${
                    s.isUser ? "text-emerald-400" : "text-blue-400"
                  }`}
                >
                  {s.speakerName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {Math.round(s.startMs / 1000)}s
                </span>
              </div>
              <p className="leading-relaxed">{s.text}</p>
              {s.interrupted && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                  <AlertCircle className="w-3 h-3" />
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
