import React from "react";
import { Bot, User } from "lucide-react";

interface BadgeProps {
  type: "ai" | "user" | "moderator" | "status";
  label?: string;
  variant?: "blue" | "emerald" | "amber" | "indigo" | "red";
}

export const Badge: React.FC<BadgeProps> = ({ type, label }) => {
  if (type === "ai") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
        <Bot className="w-2.5 h-2.5 text-blue-600" />
        AI
      </span>
    );
  }

  if (type === "user") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
        <User className="w-2.5 h-2.5" />
        You
      </span>
    );
  }

  if (type === "moderator") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-300">
        Moderator
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
      {label}
    </span>
  );
};
