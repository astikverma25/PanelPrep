import React from "react";
import { PERSONAS } from "@/lib/constants/personas";
import { Users, Bot, Mic, Volume2, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/common/Badge";

export default function DashboardPersonasPage() {
  const personaList = Object.values(PERSONAS);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>AI Participant Roster</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Persona Profiles & Behaviors
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Each AI participant is engineered with dedicated talkativeness weights, distinct browser speech synthesis acoustics, and conversational archetypes.
        </p>
      </div>

      {/* Grid of Personas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personaList.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                    {p.id === "moderator" ? (
                      <Badge type="moderator" />
                    ) : (
                      <Badge type="ai" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{p.role}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Talkativeness
                </span>
                <span className="text-xs font-mono font-bold text-blue-700">
                  {p.talkativeness > 0 ? `${p.talkativeness} / 2.5` : "Moderator Rule"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {p.description}
            </p>

            {/* Acoustic Configuration */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Voice Pitch: <strong className="text-slate-900">{p.voiceConfig.pitch}x</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Speed: <strong className="text-slate-900">{p.voiceConfig.rate}x</strong></span>
              </div>
            </div>

            {/* Canned Fallback Sample */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sample Conversational Line:
              </span>
              <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                &ldquo;{p.cannedLines[0]}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
