import React from "react";
import { Settings, Sparkles, Sliders, Shield, Bell } from "lucide-react";

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-arena-card border border-arena-border p-6 rounded-3xl shadow-xl space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-400 mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage cloud voice models, account preferences, and custom audio calibration parameters.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-arena-card border border-arena-border rounded-3xl p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Advanced Settings Coming Soon</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Custom voice cloning integrations (ElevenLabs / Cartesia keys), localized Hindi-English mixed GD modes, and multi-candidate peer practice rooms will be configurable here in the upcoming release.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Current Tier: Browser Engine (Tier A Zero Cost)
          </span>
        </div>
      </div>
    </div>
  );
}
