import React from "react";
import { Sparkles, X } from "lucide-react";

interface NudgeToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const NudgeToast: React.FC<NudgeToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm bg-white border border-indigo-200 rounded-2xl p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-bold text-indigo-800">Coach Nudge</p>
          <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 p-0.5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
