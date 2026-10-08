"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/hooks/useSessionStore";
import { TopicSelector } from "@/components/setup/TopicSelector";
import { PanelSelector } from "@/components/setup/PanelSelector";
import { PatienceSlider } from "@/components/setup/PatienceSlider";
import { MicCheckModal } from "@/components/setup/MicCheckModal";
import { Button } from "@/components/common/Button";
import { Mic, Clock, Sparkles, Shield, Play } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { config, setConfig, resetSession } = useSessionStore();
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);

  const durationOptions = [
    { minutes: 5, label: "5 Min (Fast Sprint)" },
    { minutes: 8, label: "8 Min (Standard Placement)" },
    { minutes: 10, label: "10 Min (Deep Discussion)" },
  ];

  const handleStartFlow = () => {
    resetSession();
    setIsMicModalOpen(true);
  };

  const handleProceedToRoom = (isTextFallback: boolean) => {
    setConfig({ isTextFallback });
    setIsMicModalOpen(false);
    router.push("/room");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-arena-card border border-arena-border p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive GD Arena Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Launch a Discussion Room
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select your topic, panel size, and silence tolerance before starting the spoken round.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleStartFlow}
          className="shadow-xl shadow-blue-500/20 shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Room</span>
        </Button>
      </div>

      {/* Setup Configurator Card */}
      <div className="bg-arena-card/90 border border-arena-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        {/* Topic Selector */}
        <TopicSelector
          selectedTopic={config.topic}
          onSelectTopic={(topic) => setConfig({ topic })}
        />

        {/* Panel Size & Persona Roster */}
        <PanelSelector
          panelSize={config.panelSize}
          onSelectSize={(panelSize) => setConfig({ panelSize })}
        />

        {/* Duration Options */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Discussion Duration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {durationOptions.map((opt) => (
              <button
                type="button"
                key={opt.minutes}
                onClick={() => setConfig({ durationMinutes: opt.minutes })}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  config.durationMinutes === opt.minutes
                    ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patience Slider */}
        <PatienceSlider
          patienceMs={config.patienceMs}
          onChangePatience={(patienceMs) => setConfig({ patienceMs })}
        />

        {/* Launch Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartFlow}
            className="w-full py-4 text-base font-bold shadow-xl shadow-blue-500/20 cursor-pointer"
          >
            <Mic className="w-5 h-5" />
            <span>Enter Room & Begin Practice</span>
          </Button>
        </div>
      </div>

      {/* Mic Check Modal */}
      <MicCheckModal
        isOpen={isMicModalOpen}
        onClose={() => setIsMicModalOpen(false)}
        onProceedToRoom={handleProceedToRoom}
      />
    </div>
  );
}
