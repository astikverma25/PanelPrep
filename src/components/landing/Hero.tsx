import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Mic, Volume2, ShieldCheck, Play, Bot, Users } from "lucide-react";
import { Button } from "@/components/common/Button";

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-slate-50/50">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-100/40 via-indigo-100/40 to-emerald-100/30 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>LLOYD Hackathon &bull; Problem Statement 2</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-500 font-normal">Voice AI Simulation</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.1]">
          Sit in a Real GD Room. <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            Get Feedback That Cites Exactly What You Said.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Master campus placement group discussions with 3 to 5 realistic AI panelists and an active moderator. Experience natural spoken turn-taking, instant barge-in interruptions, and zero-hallucination rubric coaching.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-base font-bold shadow-xl px-8 py-4"
            >
              <Mic className="w-5 h-5" />
              <span>Launch Practice Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/dashboard/personas">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-sm px-6 py-4"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Explore AI Personas</span>
            </Button>
          </Link>
        </div>

        {/* Live Feature Highlights Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Low-Latency STT & TTS</span>
            </div>
            <p className="text-[11px] text-slate-500">Zero-lag speech synthesis with browser voice selection.</p>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>Bidding Floor Engine</span>
            </div>
            <p className="text-[11px] text-slate-500">Natural urge scores with 2-AI turn cap to prevent lockouts.</p>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Evidence</span>
            </div>
            <p className="text-[11px] text-slate-500">100% of feedback quotes link to real transcript moments.</p>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
              <Play className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant Barge-In</span>
            </div>
            <p className="text-[11px] text-slate-500">&lt;150ms audio stop when you cut in on an AI speaker.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
