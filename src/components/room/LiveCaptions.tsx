import React from "react";
import { MessageSquareQuote, Volume2 } from "lucide-react";

interface LiveCaptionsProps {
  speakerName: string | null;
  captionText: string | null;
  isUser: boolean;
}

export const LiveCaptions: React.FC<LiveCaptionsProps> = ({
  speakerName,
  captionText,
  isUser,
}) => {
  if (!captionText) {
    return (
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center text-slate-500 text-xs italic">
        <MessageSquareQuote className="w-4 h-4 mr-2 opacity-50" />
        Floor is open. Begin speaking or wait for an AI panelist to contribute...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 shadow-lg shadow-blue-500/5 transition-all">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isUser
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          }`}
        >
          <Volume2 className="w-3 h-3" />
          {speakerName || "Speaker"}
        </span>
        <span className="text-[11px] text-slate-500">Live Captions</span>
      </div>
      <p className="text-sm font-medium text-slate-100 leading-relaxed">
        {captionText}
      </p>
    </div>
  );
};
