"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/hooks/useSessionStore";
import { TopicSelector } from "@/components/setup/TopicSelector";
import { PanelSelector } from "@/components/setup/PanelSelector";
import { PatienceSlider } from "@/components/setup/PatienceSlider";
import { MicCheckModal } from "@/components/setup/MicCheckModal";
import { Button } from "@/components/common/Button";
import { Mic, Clock, Sparkles, Shield, Trophy } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const { config, setConfig, resetSession } = useSessionStore();
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);

  const durationOptions = [
    { minutes: 5, label: "5 Min (Fast Sprint)" },
    { minutes: 8, label: "8 Min (Standard GD)" },
    { minutes: 10, label: "10 Min (Deep Round)" },
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
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8">
      {/* Hero Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
          Placement GD Preparation &bull; Problem Statement 2
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Sit in a Real GD Room. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Get Evidence-Backed Feedback.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
          Practice high-stakes group discussions with 3 to 5 distinct AI personalities and an active moderator. Experience natural turn-taking, barge-in interrupts, and evidence-verified coaching.
        </p>
      </div>

      {/* Setup Card */}
      <div className="bg-arena-card/80 border border-arena-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        {/* Topic Selection */}
        <TopicSelector
          selectedTopic={config.topic}
          onSelectTopic={(topic) => setConfig({ topic })}
        />

        {/* Panel Size & Personas */}
        <PanelSelector
          panelSize={config.panelSize}
          onSelectSize={(panelSize) => setConfig({ panelSize })}
        />

        {/* Duration Selection */}
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

        {/* Silence Patience Slider */}
        <PatienceSlider
          patienceMs={config.patienceMs}
          onChangePatience={(patienceMs) => setConfig({ patienceMs })}
        />

        {/* Start Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartFlow}
            className="w-full py-4 text-base font-bold shadow-xl shadow-blue-500/20 cursor-pointer"
          >
            <Mic className="w-5 h-5" />
            Start Group Discussion Room
          </Button>
        </div>
      </div>

      {/* Mic Check & Permission Modal */}
      <MicCheckModal
        isOpen={isMicModalOpen}
        onClose={() => setIsMicModalOpen(false)}
        onProceedToRoom={handleProceedToRoom}
      />
    </div>
  );
}
