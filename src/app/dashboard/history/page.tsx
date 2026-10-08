"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GDReport } from "@/lib/types/report";
import { getAllReportsFromHistory } from "@/lib/storage/indexedDb";
import { useSessionStore } from "@/hooks/useSessionStore";
import { Button } from "@/components/common/Button";
import { History, Calendar, Clock, ArrowRight, Play, Sparkles } from "lucide-react";

export default function DashboardHistoryPage() {
  const router = useRouter();
  const { setReport } = useSessionStore();
  const [reports, setReports] = useState<GDReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReportsFromHistory().then((data) => {
      setReports(data.reverse());
      setLoading(false);
    });
  }, []);

  const handleOpenReport = (report: GDReport) => {
    setReport(report);
    router.push("/report");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Session Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Discussion History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review past group discussion transcripts, talk shares, and verified evidence reports.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/dashboard")}
          className="shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>New Discussion</span>
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          Loading past sessions...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <History className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Saved Discussions Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you complete a discussion round, your detailed evaluation report and transcript will appear here.
          </p>
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            Start Your First Practice Room
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.sessionId}
              className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {Math.round(r.durationSeconds / 60)} min
                  </span>
                  <span>&bull;</span>
                  <span className="font-bold text-slate-900">
                    {r.stats.studentWpm} WPM
                  </span>
                  <span>&bull;</span>
                  <span className="text-blue-600 font-semibold">
                    {r.stats.studentTurnsCount} Turns
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {r.topic}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenReport(r)}
                  className="cursor-pointer"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
