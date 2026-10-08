"use client";

import React from "react";
import { Sliders, HelpCircle } from "lucide-react";

interface PatienceSliderProps {
  patienceMs: number;
  onChangePatience: (val: number) => void;
}

export const PatienceSlider: React.FC<PatienceSliderProps> = ({
  patienceMs,
  onChangePatience,
}) => {
  const getPatienceLabel = (val: number) => {
    if (val <= 800) return "Aggressive (High Pressure)";
    if (val <= 1400) return "Standard Placement GD";
    if (val <= 2000) return "Patient (Comfortable)";
    return "Gentle (Shy Speakers)";
  };

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          AI Silence Patience (End-of-Turn Gap)
        </label>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
          {(patienceMs / 1000).toFixed(1)}s &bull; {getPatienceLabel(patienceMs)}
        </span>
      </div>

      <input
        type="range"
        min={600}
        max={2500}
        step={100}
        value={patienceMs}
        onChange={(e) => onChangePatience(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
      />

      <div className="flex justify-between text-[10px] text-slate-500">
        <span>0.6s (Fast Cut-in)</span>
        <span>1.2s (Default)</span>
        <span>2.5s (Shy Panel)</span>
      </div>
    </div>
  );
};
