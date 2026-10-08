"use client";

import React, { useState } from "react";
import { CURATED_TOPICS, CuratedTopic } from "@/lib/constants/topics";
import { Sparkles, Edit3, CheckCircle2, AlertCircle } from "lucide-react";

interface TopicSelectorProps {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopic,
  onSelectTopic,
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [isCheckingModeration, setIsCheckingModeration] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectCurated = (topic: CuratedTopic) => {
    setIsCustom(false);
    setErrorMsg(null);
    onSelectTopic(topic.title);
  };

  const handleApplyCustom = async () => {
    if (customText.trim().length < 5) {
      setErrorMsg("Topic must be at least 5 characters long.");
      return;
    }

    setIsCheckingModeration(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: customText.trim() }),
      });
      const data = await res.json();
      if (!data.allowed) {
        setErrorMsg(data.reason || "This topic was flagged by moderation safety.");
      } else {
        onSelectTopic(customText.trim());
      }
    } catch {
      onSelectTopic(customText.trim());
    } finally {
      setIsCheckingModeration(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Select Discussion Topic
        </label>
        <button
          type="button"
          onClick={() => {
            setIsCustom(!isCustom);
            setErrorMsg(null);
          }}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-semibold"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isCustom ? "Pick from curated topics" : "Enter custom topic"}
        </button>
      </div>

      {isCustom ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Impact of Quantum Computing on Financial Cybersecurity"
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
            />
            <button
              type="button"
              onClick={handleApplyCustom}
              disabled={isCheckingModeration}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isCheckingModeration ? "Validating..." : "Set Topic"}
            </button>
          </div>
          {errorMsg && (
            <p className="text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CURATED_TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic.title;
            return (
              <button
                type="button"
                key={topic.id}
                onClick={() => handleSelectCurated(topic)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative group cursor-pointer shadow-sm ${
                  isSelected
                    ? "bg-blue-50/50 border-blue-500 shadow-md ring-1 ring-blue-400/40"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {topic.category}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                </div>
                <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                  {topic.title}
                </h4>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
