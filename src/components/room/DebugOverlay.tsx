"use client";

import React, { useState, useEffect } from "react";
import { FloorState, DiscussionPhase } from "@/lib/types/arena";
import { Terminal } from "lucide-react";

interface DebugOverlayProps {
  floorState: FloorState;
  phase: DiscussionPhase;
  activeSpeakerId: string | null;
  biddingScores: Record<string, number>;
  timeRemainingSeconds: number;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  floorState,
  phase,
  activeSpeakerId,
  biddingScores,
  timeRemainingSeconds,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "D" && e.shiftKey) {
        setIsVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-3 left-3 z-30 p-2 bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-[10px] rounded-lg border border-slate-800 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
        title="Debug Overlay (Shift + D)"
      >
        <Terminal className="w-3 h-3" />
        <span>Debug</span>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-72 bg-slate-950/95 border border-slate-800 rounded-xl p-3 text-[11px] font-mono shadow-2xl text-slate-300 space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-bold text-blue-400">
        <span className="flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5" />
          Engine State Machine
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-500 hover:text-white"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1 text-slate-400">
        <div>State: <span className="text-emerald-400 font-semibold">{floorState}</span></div>
        <div>Phase: <span className="text-indigo-400 font-semibold">{phase}</span></div>
        <div>Speaker: <span className="text-amber-400 font-semibold">{activeSpeakerId || "none"}</span></div>
        <div>Time: <span className="text-white font-semibold">{timeRemainingSeconds}s</span></div>
      </div>

      <div className="border-t border-slate-800 pt-1.5">
        <span className="text-slate-400 block mb-1">Live Bidding Scores:</span>
        <div className="space-y-0.5 max-h-24 overflow-y-auto">
          {Object.entries(biddingScores).map(([persona, score]) => (
            <div key={persona} className="flex justify-between text-[10px]">
              <span className="capitalize">{persona}:</span>
              <span className={score > 1.0 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                {score.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
