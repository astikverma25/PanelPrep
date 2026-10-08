"use client";

import React, { useState, useEffect } from "react";
import { CURATED_TOPICS } from "@/lib/constants/topics";
import { PERSONAS } from "@/lib/constants/personas";
import { PersonaProfile } from "@/lib/types/personas";
import { VADDetector } from "@/lib/speech/vadDetector";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  Clock,
  Users,
  Sliders,
  AlertCircle,
  Keyboard,
  Headphones,
  Edit3,
  HelpCircle,
  Flame,
} from "lucide-react";

interface DiscussionSetupWizardProps {
  onComplete: (config: {
    topic: string;
    panelSize: number;
    selectedPersonaIds: string[];
    durationMinutes: number;
    patienceMs: number;
    isTextFallback: boolean;
  }) => void;
  onCancel: () => void;
}

export const DiscussionSetupWizard: React.FC<DiscussionSetupWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [topicMode, setTopicMode] = useState<"dropdown" | "custom">("dropdown");
  const [selectedTopic, setSelectedTopic] = useState<string>(CURATED_TOPICS[0].title);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [panelSize, setPanelSize] = useState<number>(3);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([
    "arjun",
    "meera",
    "kabir",
  ]);
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [patienceMs, setPatienceMs] = useState<number>(1200);
  const [isTextFallback, setIsTextFallback] = useState<boolean>(false);

  // Audio test state
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [detector, setDetector] = useState<VADDetector | null>(null);
  const [isCheckingModeration, setIsCheckingModeration] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const MAX_CUSTOM_WORDS = 50;
  const customWordCount = customTopic.trim() ? customTopic.trim().split(/\s+/).length : 0;

  // Cleanup audio analyser on unmount
  useEffect(() => {
    return () => {
      if (detector) detector.stop();
    };
  }, [detector]);

  // Start VAD when reaching Step 4
  useEffect(() => {
    if (currentStep === 4 && !isTextFallback) {
      const vad = new VADDetector((level) => {
        setAudioLevel(level);
      });
      setDetector(vad);
      vad.start();
    } else {
      if (detector) {
        detector.stop();
        setDetector(null);
      }
    }
  }, [currentStep, isTextFallback]);

  // Handle Step 1 Topic Next
  const handleStep1Next = async () => {
    setErrorMsg(null);
    if (topicMode === "custom") {
      const trimmed = customTopic.trim();
      if (trimmed.length < 10) {
        setErrorMsg("Please enter a descriptive discussion topic (at least 10 characters).");
        return;
      }
      if (customWordCount > MAX_CUSTOM_WORDS) {
        setErrorMsg(`Topic exceeds the maximum limit of ${MAX_CUSTOM_WORDS} words.`);
        return;
      }

      setIsCheckingModeration(true);
      try {
        const res = await fetch("/api/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: trimmed }),
        });
        const data = await res.json();
        if (!data.allowed) {
          setErrorMsg(data.reason || "This topic was flagged by moderation guidelines.");
          setIsCheckingModeration(false);
          return;
        }
      } catch {}
      setIsCheckingModeration(false);
    }
    setCurrentStep(2);
  };

  const handlePanelSizeChange = (newSize: number) => {
    setPanelSize(newSize);
    setErrorMsg(null);
    const availablePool = ["arjun", "meera", "kabir", "sana", "rohan"];
    if (selectedPersonaIds.length > newSize) {
      setSelectedPersonaIds(selectedPersonaIds.slice(0, newSize));
    } else if (selectedPersonaIds.length < newSize) {
      const remaining = availablePool.filter((id) => !selectedPersonaIds.includes(id));
      const added = remaining.slice(0, newSize - selectedPersonaIds.length);
      setSelectedPersonaIds([...selectedPersonaIds, ...added]);
    }
  };

  const handleTogglePersona = (id: string) => {
    setErrorMsg(null);
    if (selectedPersonaIds.includes(id)) {
      if (selectedPersonaIds.length <= 1) {
        setErrorMsg("You must select at least 1 AI panelist.");
        return;
      }
      setSelectedPersonaIds(selectedPersonaIds.filter((pId) => pId !== id));
    } else {
      if (selectedPersonaIds.length >= panelSize) {
        // Swap out the first one to keep exactly panelSize
        const updated = [...selectedPersonaIds.slice(1), id];
        setSelectedPersonaIds(updated);
      } else {
        setSelectedPersonaIds([...selectedPersonaIds, id]);
      }
    }
  };

  const handleStep2Next = () => {
    if (selectedPersonaIds.length !== panelSize) {
      setErrorMsg(`Please select exactly ${panelSize} AI panelists (${selectedPersonaIds.length}/${panelSize} currently selected).`);
      return;
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  const getFinalTopic = () => {
    return topicMode === "custom" ? customTopic.trim() : selectedTopic;
  };

  const getActivePanelList = () => {
    const list: PersonaProfile[] = [PERSONAS.moderator];
    for (const id of selectedPersonaIds) {
      if (PERSONAS[id] && id !== "moderator") {
        list.push(PERSONAS[id]);
      }
    }
    return list;
  };

  const handleFinishWizard = () => {
    if (detector) detector.stop();
    onComplete({
      topic: getFinalTopic(),
      panelSize,
      selectedPersonaIds,
      durationMinutes,
      patienceMs,
      isTextFallback,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      {/* Wizard Step Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider">
            Step {currentStep} of 4:{" "}
            {currentStep === 1
              ? "Select Discussion Topic"
              : currentStep === 2
              ? "Configure AI Panelists"
              : currentStep === 3
              ? "Set Duration & Pace"
              : "Microphone & Readiness Check"}
          </span>
          <span className="text-slate-500 font-mono font-medium">
            {Math.round((currentStep / 4) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-950 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: TOPIC SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Choose Discussion Topic
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Pick a high-impact campus GD prompt or create a custom topic.
              </p>
            </div>

            {/* Toggle Mode */}
            <div className="inline-flex rounded-full bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setTopicMode("dropdown");
                  setErrorMsg(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  topicMode === "dropdown"
                    ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Curated Topics
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopicMode("custom");
                  setErrorMsg(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  topicMode === "custom"
                    ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Custom Topic
              </button>
            </div>
          </div>

          {topicMode === "dropdown" ? (
            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-700 block">
                Select from Curated Placement Topics:
              </label>
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-2xl p-4 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer leading-relaxed shadow-sm"
                >
                  {CURATED_TOPICS.map((topic) => (
                    <option key={topic.id} value={topic.title} className="bg-white py-2 text-slate-900">
                      [{topic.category}] {topic.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  ▼
                </div>
              </div>

              {/* Selected Topic Description Card */}
              {(() => {
                const found = CURATED_TOPICS.find((t) => t.title === selectedTopic);
                if (!found) return null;
                return (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      Topic Scope ({found.category}):
                    </span>
                    <p className="text-slate-600 leading-relaxed">{found.description}</p>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Type Your Custom Topic:
                </label>
                <span
                  className={`text-xs font-mono font-medium ${
                    customWordCount > MAX_CUSTOM_WORDS ? "text-red-600 font-bold" : "text-slate-500"
                  }`}
                >
                  {customWordCount} / {MAX_CUSTOM_WORDS} words
                </span>
              </div>

              <textarea
                rows={3}
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Should central banks replace physical currency with sovereign central bank digital currencies (CBDCs)?"
                className="w-full bg-white border border-slate-300 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none leading-relaxed shadow-sm"
              />

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: NUMBER OF PANELISTS & PERSONAS */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Configure AI Panelists
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Choose the total number of AI panelists, then manually select your preferred discussion partners.
            </p>
          </div>

          {/* Number of Panelists Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 block">
              1. Choose Total Number of AI Panelists:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 4, 5].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => handlePanelSizeChange(size)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    panelSize === size
                      ? "bg-slate-950 border-slate-950 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="text-lg font-black">{size} AIs</div>
                  <div className={`text-[11px] mt-0.5 ${panelSize === size ? "text-slate-300" : "text-slate-500"}`}>
                    {size === 3 ? "Standard Focus" : size === 4 ? "Placement Standard" : "Intense Pressure"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Moderator Bar (Always Included) */}
          <div className="bg-indigo-50/50 border border-indigo-200 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm"
                style={{ backgroundColor: PERSONAS.moderator.color }}
              >
                {PERSONAS.moderator.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{PERSONAS.moderator.name}</h4>
                  <Badge type="moderator" />
                </div>
                <p className="text-[11px] text-slate-600">{PERSONAS.moderator.description}</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg border border-indigo-200 hidden sm:inline">
              Locked Moderator
            </span>
          </div>

          {/* Manual Selectable Panelists Pool */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                2. Select Exactly {panelSize} AI Panelists to Join:
              </label>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedPersonaIds.length === panelSize
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {selectedPersonaIds.length} / {panelSize} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {["arjun", "meera", "kabir", "sana", "rohan"].map((id) => {
                const persona = PERSONAS[id];
                const isSelected = selectedPersonaIds.includes(id);

                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => handleTogglePersona(id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-blue-50/40 border-blue-500 shadow-md ring-1 ring-blue-500/30"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm"
                          style={{ backgroundColor: persona.color }}
                        >
                          {persona.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900">{persona.name}</span>
                            <Badge type="ai" />
                          </div>
                          <span className="text-[11px] text-slate-500 block">{persona.role}</span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow"
                            : "border-slate-300 bg-slate-100"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {persona.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Talkativeness:</span>
                      <span className="font-bold text-blue-700">{persona.talkativeness} / 2.5</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: DURATION & PACING */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Duration & Turn-Taking Pacing
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Set session time limit and silence patience for the conversational engine.
            </p>
          </div>

          {/* Duration in Minutes */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 block">
              Select Discussion Time:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { min: 3, label: "3 Min", sub: "Quick Demo" },
                { min: 5, label: "5 Min", sub: "Sprint Round" },
                { min: 8, label: "8 Min", sub: "Standard GD" },
                { min: 10, label: "10 Min", sub: "Comprehensive" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.min}
                  onClick={() => setDurationMinutes(opt.min)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    durationMinutes === opt.min
                      ? "bg-slate-950 border-slate-950 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="text-base font-bold">{opt.label}</div>
                  <div className={`text-[10px] mt-0.5 ${durationMinutes === opt.min ? "text-slate-300" : "text-slate-500"}`}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Patience Slider */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                Silence Patience Threshold
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {(patienceMs / 1000).toFixed(1)}s
              </span>
            </div>

            <input
              type="range"
              min={600}
              max={2500}
              step={100}
              value={patienceMs}
              onChange={(e) => setPatienceMs(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
            />

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0.6s (Fast Interruptions)</span>
              <span>1.2s (Placement Standard)</span>
              <span>2.5s (Shy Speakers)</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: AUDIO CHECK & READINESS */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-600" />
              Microphone & Audio Check
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Verify your microphone input level for crisp live transcription and barge-in.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsTextFallback(false)}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                !isTextFallback
                  ? "bg-emerald-50/50 border-emerald-500 text-slate-950 shadow-md ring-1 ring-emerald-400/40"
                  : "bg-white border-slate-200 text-slate-600 shadow-sm"
              }`}
            >
              <Mic className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Voice & Spoken Mode (Recommended)</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Speak naturally into your microphone.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsTextFallback(true)}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                isTextFallback
                  ? "bg-blue-50/50 border-blue-500 text-slate-950 shadow-md ring-1 ring-blue-400/40"
                  : "bg-white border-slate-200 text-slate-600 shadow-sm"
              }`}
            >
              <Keyboard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Typing Mode Fallback</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Type your responses if in a noisy environment.
                </p>
              </div>
            </button>
          </div>

          {!isTextFallback && (
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  Live Microphone Visualizer
                </span>
                <span className={audioLevel > 10 ? "text-emerald-700 font-bold" : "text-slate-500"}>
                  {audioLevel > 10 ? "Voice Input Detected ✓" : "Speak to test mic..."}
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    audioLevel > 40
                      ? "bg-emerald-500 shadow-md"
                      : audioLevel > 10
                      ? "bg-blue-500"
                      : "bg-slate-300"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, audioLevel))}%` }}
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <Headphones className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Tip: Use headphones for optimal echo cancellation during barge-ins.</span>
              </div>
            </div>
          )}

          {/* Discussion Summary Card */}
          <div className="bg-blue-50/40 border border-blue-200 p-4 rounded-2xl text-xs space-y-1 text-slate-700">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Session Configuration Summary:
            </span>
            <p><strong>Topic:</strong> &ldquo;{getFinalTopic()}&rdquo;</p>
            <p><strong>Panel:</strong> {getActivePanelList().map((p) => p.name).join(", ")} &bull; <strong>Duration:</strong> {durationMinutes} Minutes</p>
          </div>
        </div>
      )}

      {/* Navigation Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {currentStep > 1 ? (
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="md"
            onClick={onCancel}
            className="cursor-pointer text-slate-600 hover:text-slate-950"
          >
            Cancel
          </Button>
        )}

        {currentStep < 4 ? (
          <Button
            variant="primary"
            size="md"
            onClick={
              currentStep === 1
                ? handleStep1Next
                : currentStep === 2
                ? handleStep2Next
                : () => setCurrentStep(currentStep + 1)
            }
            isLoading={isCheckingModeration}
            className="cursor-pointer font-bold px-6"
          >
            <span>Continue to Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handleFinishWizard}
            className="cursor-pointer font-bold !px-8 shadow-xl"
          >
            <Flame className="w-4 h-4 fill-current text-amber-300" />
            <span>Start Discussion (3-2-1)</span>
          </Button>
        )}
      </div>
    </div>
  );
};
