"use client";

import React, { useEffect, useState } from "react";
import { Mic, Sparkles } from "lucide-react";

interface CountdownTransitionProps {
  onComplete: () => void;
  topic: string;
}

export const CountdownTransition: React.FC<CountdownTransitionProps> = ({
  onComplete,
  topic,
}) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-white/95 border border-slate-200 p-8 rounded-3xl shadow-2xl space-y-6 flex flex-col items-center">
        {/* Topic Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Entering Discussion Room</span>
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-slate-800 line-clamp-2 px-4">
          &ldquo;{topic}&rdquo;
        </h3>

        {/* Animated Countdown Number */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-28 h-28 rounded-full bg-slate-950 flex items-center justify-center shadow-xl animate-pulse">
            <span
              key={count}
              className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tighter animate-in zoom-in-50 duration-300"
            >
              {count > 0 ? count : "GO!"}
            </span>
          </div>
          {/* Ripple Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-900/40 animate-ping pointer-events-none" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
            <Mic className="w-4 h-4 text-emerald-600 animate-bounce" />
            Connecting AI Panelists & Moderator...
          </p>
          <p className="text-xs text-slate-500">
            Dr. Nair will open the room with the discussion guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};
