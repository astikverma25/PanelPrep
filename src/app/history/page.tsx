"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GDReport } from "@/lib/types/report";
import { getAllReports } from "@/lib/storage/reportStorage";
import { useSessionStore } from "@/hooks/useSessionStore";
import { Button } from "@/components/common/Button";
import { History, Calendar, Clock, Star, ArrowRight, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { setReport } = useSessionStore();
  const [reports, setReports] = useState<GDReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReports().then((data) => {
      setReports(data.reverse());
      setLoading(false);
    });
  }, []);

  const handleOpenReport = (report: GDReport) => {
    setReport(report);
    router.push("/report");
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="!p-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </Button>
            <h1 className="text-2xl font-black text-slate-950 flex items-center gap-2">
              <History className="w-6 h-6 text-blue-600" />
              Your GD Practice History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 pl-8">
            Review past group discussions, track your talk share and speaking pace trends over time.
          </p>
        </div>
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
                  <span>View Report</span>
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
