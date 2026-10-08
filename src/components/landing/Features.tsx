import React from "react";
import { Mic, Zap, ShieldCheck, BarChart3, Users, MessageSquareQuote, Brain, Lightbulb } from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: "Natural Voice Turn-Taking",
      description:
        "AI participants compute urge scores based on silence, recent speaking frequency, and direct mentions. They talk to you and debate with each other.",
      badge: "Patented Flow",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      icon: Mic,
      title: "Instant Barge-In Interrupts (<150ms)",
      description:
        "Don't wait for AIs to finish paragraphs. Jump in, interrupt mid-sentence, and assert your argument just like in a high-pressure placement round.",
      badge: "Realism Engine",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      icon: ShieldCheck,
      title: "Evidence-Backed Trustworthy Report",
      description:
        "Never get generic praise. The server verifies every single feedback claim by linking directly to exact quote snippets from your transcript.",
      badge: "Zero Hallucination",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      icon: Lightbulb,
      title: "“What You Could Have Said” Replay",
      description:
        "Get actionable tactical replays pinpointing missed openings where you could have introduced definitions or countered an assumption.",
      badge: "Exclusive",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      icon: BarChart3,
      title: "Deterministic Live Metrics",
      description:
        "Track your Words Per Minute (WPM), Talk Share percentage, time to first entry, and filler words per minute calculated from exact timestamps.",
      badge: "Analytics",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      icon: Users,
      title: "Adjustable Panel Dynamics",
      description:
        "Configure 3 to 5 AI personas (The Dominator, The Analyst, The Quiet One, The Drifter, The Diplomat) and adjust silence patience from 0.6s to 2.5s.",
      badge: "Customizable",
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Engineered For Placement Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Why PanelPrep Wins Placements
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Most candidates fail group discussions not from lack of knowledge, but from lack of turn-taking practice and evidence-backed critique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 hover:border-slate-300 p-6 rounded-3xl space-y-3 transition-all duration-300 hover:shadow-lg shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
