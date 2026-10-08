"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/hooks/useSessionStore";
import { StatsOverview } from "@/components/report/StatsOverview";
import { TalkShareBar } from "@/components/report/TalkShareBar";
import { DimensionCard } from "@/components/report/DimensionCard";
import { MissedOpenings } from "@/components/report/MissedOpenings";
import { InteractiveTranscript } from "@/components/report/InteractiveTranscript";
import { Button } from "@/components/common/Button";
import { Sparkles, Trophy, RotateCcw, Home, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function ReportPage() {
  const router = useRouter();
  const { report, segments, config, resetSession } = useSessionStore();
  const [highlightedSegmentId, setHighlightedSegmentId] = useState<string | null>(null);

  const handleQuoteClick = (segmentId: string) => {
    setHighlightedSegmentId(segmentId);
    const element = document.getElementById(`segment-${segmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleStartNew = () => {
    resetSession();
    router.push("/");
  };

  if (!report) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Session Report Found</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Complete a group discussion session first to generate evidence-backed coaching analytics.
        </p>
        <Button variant="primary" onClick={() => router.push("/")}>
          <Home className="w-4 h-4" />
          Go to Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-arena-card border border-arena-border p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            GD Evaluation Complete &bull; Evidence Verified
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Performance Analysis & Transcript Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-1">
            Topic: &ldquo;{report.topic}&rdquo; &bull; {Math.round(report.durationSeconds / 60)} min session
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="md" onClick={handleStartNew}>
            <RotateCcw className="w-4 h-4" />
            New Practice Round
          </Button>
        </div>
      </div>

      {/* Deterministic Stats Grid */}
      <StatsOverview stats={report.stats} />

      {/* Talk Share Breakdown Bar */}
      <TalkShareBar talkShare={report.stats.talkSharePercent} />

      {/* Top 3 Actionable Takeaways */}
      {report.top_3_actions && report.top_3_actions.length > 0 && (
        <div className="bg-blue-950/20 border border-blue-800/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Top 3 Key Action Steps for Your Next Placement GD
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {report.top_3_actions.map((act, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-200 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missed Openings "What You Could Have Said" */}
      <MissedOpenings
        missedOpenings={report.missed_openings}
        onClickSegment={handleQuoteClick}
      />

      {/* 6 Rubric Dimensions Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          6-Dimension Rubric Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.dimensions.map((dim) => (
            <DimensionCard
              key={dim.name}
              dimension={dim}
              onClickQuote={handleQuoteClick}
            />
          ))}
        </div>
      </div>

      {/* Interactive Transcript Viewer */}
      <InteractiveTranscript
        segments={report.transcript || segments}
        highlightedSegmentId={highlightedSegmentId}
      />
    </div>
  );
}
