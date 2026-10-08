import React from "react";
import { DeterministicStats } from "@/lib/types/report";
import { Activity, Clock, MessageSquare, AlertTriangle, Zap, HelpCircle } from "lucide-react";

interface StatsOverviewProps {
  stats: DeterministicStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const cards = [
    {
      label: "Speaking Pace",
      value: `${stats.studentWpm} WPM`,
      sub: stats.studentWpm > 160 ? "Fast" : stats.studentWpm < 110 ? "Slow" : "Optimal (120-150)",
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Contribution Turns",
      value: stats.studentTurnsCount,
      sub: `Avg ${stats.studentAvgWordsPerTurn} words/turn`,
      icon: MessageSquare,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "First Entry",
      value: `${stats.timeToFirstContributionSeconds}s`,
      sub: stats.timeToFirstContributionSeconds < 45 ? "Early Initiative" : "Delayed Entry",
      icon: Clock,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Filler Words",
      value: `${stats.fillerWordsPerMinute}/min`,
      sub: `${stats.fillerWordsCount} total detected`,
      icon: AlertTriangle,
      color: stats.fillerWordsPerMinute > 4 ? "text-red-400" : "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Interruptions Managed",
      value: `${stats.studentInterruptionsCount} made`,
      sub: `${stats.aiInterruptionsCount} received`,
      icon: Zap,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Peer References",
      value: stats.referencesToOthersCount,
      sub: "Citing others by name",
      icon: HelpCircle,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-400">{c.label}</span>
              <div className={`p-1.5 rounded-lg ${c.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${c.color}`} />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-white tracking-tight">{c.value}</div>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
