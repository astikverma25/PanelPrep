import React from "react";
import { Bot, User } from "lucide-react";

interface BadgeProps {
  type: "ai" | "user" | "moderator" | "status";
  label?: string;
  variant?: "blue" | "emerald" | "amber" | "indigo" | "red";
}

export const Badge: React.FC<BadgeProps> = ({ type, label, variant = "blue" }) => {
  if (type === "ai") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
        <Bot className="w-2.5 h-2.5" />
        AI
      </span>
    );
  }

  if (type === "user") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <User className="w-2.5 h-2.5" />
        You
      </span>
    );
  }

  if (type === "moderator") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
        Moderator
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
      {label}
    </span>
  );
};
