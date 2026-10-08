import React from "react";
import { Sliders, Mic, FileCheck, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: Sliders,
      title: "Configure Your Discussion Room",
      description:
        "Select from trending campus GD topics or type your own. Set panel size (3-5 AIs), duration (5-10 min), and silence patience threshold.",
    },
    {
      step: "02",
      icon: Mic,
      title: "Spoken Discussion with Voice AI",
      description:
        "Speak freely using your microphone. Dr. Nair (Moderator) opens the room, manages time checks, and AI panelists debate and respond in real-time.",
    },
    {
      step: "03",
      icon: FileCheck,
      title: "Evidence-Backed Actionable Report",
      description:
        "Review 6 rubric dimensions where every critique quotes exact words you spoke, along with talk share breakdown and missed opening replays.",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Frictionless 3-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How GD Arena Works
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Zero complicated setup. Open the URL on any laptop or mobile browser and start practicing immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-4 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-700 font-mono">
                      {s.step}
                    </span>
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
