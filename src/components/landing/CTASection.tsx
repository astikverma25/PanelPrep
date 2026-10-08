import React from "react";
import Link from "next/link";
import { Mic, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/common/Button";

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 border-t border-slate-800/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-indigo-950/20 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          Ready For Your Next Placement Round?
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Join A Real Discussion Room in 10 Seconds.
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Test your turn-taking, build logical frameworks under pressure, and receive line-by-line evidence feedback before actual campus placement drives.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-base font-bold shadow-2xl shadow-blue-500/25 px-8 py-4 cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span>Enter Practice Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
