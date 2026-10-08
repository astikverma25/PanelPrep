"use client";

import React from "react";
import { Users, UserPlus } from "lucide-react";
import { PERSONAS } from "@/lib/constants/personas";

interface PanelSelectorProps {
  panelSize: number;
  onSelectSize: (size: number) => void;
}

export const PanelSelector: React.FC<PanelSelectorProps> = ({
  panelSize,
  onSelectSize,
}) => {
  const options = [
    {
      size: 3,
      label: "3 AI + Moderator",
      names: ["Dr. Nair", "Arjun", "Meera", "Kabir"],
      desc: "Fast-paced & focused panel",
    },
    {
      size: 4,
      label: "4 AI + Moderator",
      names: ["Dr. Nair", "Arjun", "Meera", "Kabir", "Sana"],
      desc: "Realistic campus GD dynamics",
    },
    {
      size: 5,
      label: "5 AI + Moderator",
      names: ["Dr. Nair", "Arjun", "Meera", "Kabir", "Sana", "Rohan"],
      desc: "High competitive pressure",
    },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-400" />
        Panel Size & AI Personas
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = panelSize === opt.size;
          return (
            <button
              type="button"
              key={opt.size}
              onClick={() => onSelectSize(opt.size)}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{opt.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-semibold">
                  {opt.size} AIs
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">{opt.desc}</p>
              <div className="flex flex-wrap gap-1">
                {opt.names.map((name) => (
                  <span
                    key={name}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 font-medium border border-slate-700/50"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
