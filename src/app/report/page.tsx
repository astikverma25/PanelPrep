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
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Home,
  CheckCircle2,
  ArrowUpRight,
  ArrowLeft,
  History,
} from "lucide-react";

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
    router.push("/dashboard");
  };

  if (!report) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-950">No Active Session Report Found</h2>
        <p className="text-sm text-slate-600 max-w-md">
          Complete a group discussion session first to generate evidence-backed coaching analytics.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/history")}>
            <History className="w-4 h-4" />
            <span>Practice History</span>
          </Button>
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
      {/* Header Banner with Back to History Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <div className="flex items-start gap-3.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/history")}
            className="rounded-full !p-2.5 shrink-0 mt-1 hover:bg-slate-100 cursor-pointer shadow-2xs border-slate-200"
            title="Back to History"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </Button>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              GD Evaluation Saved to History &bull; Evidence Verified
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Performance Analysis & Transcript Review
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
              Topic: &ldquo;{report.topic}&rdquo; &bull; {Math.round(report.durationSeconds / 60)} min session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push("/dashboard/history")}
            className="rounded-full font-semibold cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Practice History</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleStartNew}
            className="rounded-full font-semibold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Practice</span>
          </Button>
        </div>
      </div>

      {/* Deterministic Stats Grid */}
      <StatsOverview stats={report.stats} />

      {/* Talk Share Breakdown Bar */}
      <TalkShareBar talkShare={report.stats.talkSharePercent} />

      {/* Top 3 Actionable Takeaways */}
      {report.top_3_actions && report.top_3_actions.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Top 3 Key Action Steps for Your Next Placement GD
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {report.top_3_actions.map((act, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-3.5 rounded-xl text-xs text-slate-800 flex items-start gap-2.5 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
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
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
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
