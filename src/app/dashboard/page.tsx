"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSessionStore } from "@/hooks/useSessionStore";
import { DiscussionSetupWizard } from "@/components/setup/DiscussionSetupWizard";
import { CountdownTransition } from "@/components/setup/CountdownTransition";
import { getAllReports } from "@/lib/storage/reportStorage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { GDReport } from "@/lib/types/report";
import { Button } from "@/components/common/Button";
import {
  Play,
  Sparkles,
  Trophy,
  History,
  Users,
  Mic,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Clock,
  ShieldCheck,
  Database,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { setConfig, resetSession } = useSessionStore();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [selectedTopicForCountdown, setSelectedTopicForCountdown] = useState("");
  const [pastReports, setPastReports] = useState<GDReport[]>([]);

  useEffect(() => {
    getAllReports().then((data) => {
      setPastReports(data.reverse());
    });
  }, []);

  const handleStartPracticeWizard = () => {
    resetSession();
    setIsWizardOpen(true);
  };

  const handleWizardComplete = (config: {
    topic: string;
    panelSize: number;
    selectedPersonaIds: string[];
    durationMinutes: number;
    patienceMs: number;
    isTextFallback: boolean;
  }) => {
    setConfig(config);
    setSelectedTopicForCountdown(config.topic);
    setIsWizardOpen(false);
    setIsCountdownActive(true);
  };

  const handleCountdownFinished = () => {
    router.push("/room");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 3-2-1 COUNTDOWN TRANSITION OVERLAY */}
      {isCountdownActive && (
        <CountdownTransition
          topic={selectedTopicForCountdown}
          onComplete={handleCountdownFinished}
        />
      )}

      {/* STEP-BY-STEP GUIDED WIZARD MODE */}
      {isWizardOpen ? (
        <DiscussionSetupWizard
          onComplete={handleWizardComplete}
          onCancel={() => setIsWizardOpen(false)}
        />
      ) : (
        /* PROFESSIONAL DASHBOARD OVERVIEW */
        <div className="space-y-8">
          {/* Main Action Callout Card */}
          <div className="relative overflow-hidden bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Voice-First AI Group Discussion</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
                Ready for Your Next Placement GD Round?
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Configure your discussion topic, select 3 to 5 AI participants, calibrate silence patience, and practice natural spoken turn-taking with verified evidence feedback.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartPracticeWizard}
              className="py-4 px-8 text-base font-bold shadow-lg shrink-0 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start New Discussion</span>
            </Button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Practice Rounds</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-950">{pastReports.length} Completed</div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-500 inline" />
                <span>{isSupabaseConfigured ? "Synced with Supabase Cloud" : "Stored locally in IndexedDB"}</span>
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">AI Panelist Engine</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600">5 Personas + Mod</div>
              <p className="text-[11px] text-slate-500">Dr. Nair, Arjun, Meera, Kabir, Sana, Rohan</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Evidence Verification</span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-950">100% Verified</div>
              <p className="text-[11px] text-slate-500">Zero hallucinated coaching quotes</p>
            </div>
          </div>

          {/* Recent Practice Rounds List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Recent Practice Discussions
              </h3>
              <Link
                href="/dashboard/history"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pastReports.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-3 shadow-sm">
                <p className="text-xs text-slate-500">
                  No previous sessions yet. Click &ldquo;Start New Discussion&rdquo; above to launch your first AI-moderated group discussion.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastReports.slice(0, 3).map((r) => (
                  <div
                    key={r.sessionId}
                    className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span className="font-bold text-slate-900">{r.stats.studentWpm} WPM</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{r.topic}</h4>
                    </div>

                    <Link href="/report">
                      <Button variant="outline" size="sm" className="shrink-0 text-xs">
                        <span>Report</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
