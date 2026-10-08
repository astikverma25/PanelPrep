"use client";

import React from "react";
import Link from "next/link";
import { Mic, Volume2, ShieldCheck, History } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-arena-border/60 bg-arena-dark/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">GD Arena</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Voice AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Campus Placement GD Simulator</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-arena-card/80 px-3 py-1.5 rounded-lg border border-arena-border">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Turn-Taking Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <Link
            href="/history"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
          </Link>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Disclosure</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
