import React from "react";
import Link from "next/link";
import { PERSONAS } from "@/lib/constants/personas";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/common/Button";

export const PersonasPreview: React.FC = () => {
  const personaList = Object.values(PERSONAS);

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Diverse AI Personalities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Meet Your Practice Panel
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Every persona exhibits realistic traits—from the aggressive interrupter to the silent data analyst.
            </p>
          </div>

          <Link href="/dashboard/personas">
            <Button variant="outline" size="sm" className="gap-2">
              <span>View Full Persona Profiles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {personaList.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-slate-700 transition-all group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shadow-md group-hover:scale-105 transition-transform"
                style={{ backgroundColor: p.color }}
              >
                {p.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  {p.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
