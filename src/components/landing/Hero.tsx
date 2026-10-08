import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Mic, Volume2, ShieldCheck, Play, Bot, Users } from "lucide-react";
import { Button } from "@/components/common/Button";

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-xs font-semibold text-blue-400 shadow-lg shadow-blue-500/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>LLOYD Hackathon &bull; Problem Statement 2</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-normal">Voice AI Simulation</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Sit in a Real GD Room. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Get Feedback That Cites Exactly What You Said.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Master campus placement group discussions with 3 to 5 realistic AI panelists and an active moderator. Experience natural spoken turn-taking, instant barge-in interruptions, and zero-hallucination rubric coaching.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-base font-bold shadow-2xl shadow-blue-500/30 px-8 py-4"
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
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Explore AI Personas</span>
            </Button>
          </Link>
        </div>

        {/* Live Feature Highlights Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Low-Latency STT & TTS</span>
            </div>
            <p className="text-[11px] text-slate-400">Zero-lag speech synthesis with browser voice selection.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>Bidding Floor Engine</span>
            </div>
            <p className="text-[11px] text-slate-400">Natural urge scores with 2-AI turn cap to prevent lockouts.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Evidence</span>
            </div>
            <p className="text-[11px] text-slate-400">100% of feedback quotes link to real transcript moments.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <Play className="w-3.5 h-3.5" />
              <span>Instant Barge-In</span>
            </div>
            <p className="text-[11px] text-slate-400">&lt;150ms audio stop when you cut in on an AI speaker.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
