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
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-center text-slate-400 text-xs italic shadow-sm">
        <MessageSquareQuote className="w-4 h-4 mr-2 opacity-50 text-slate-400" />
        Floor is open. Begin speaking or wait for an AI panelist to contribute...
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-blue-200 rounded-2xl p-4 shadow-md transition-all">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
            isUser
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          <Volume2 className="w-3 h-3" />
          {speakerName || "Speaker"}
        </span>
        <span className="text-[11px] text-slate-500">Live Captions</span>
      </div>
      <p className="text-sm font-medium text-slate-800 leading-relaxed">
        {captionText}
      </p>
    </div>
  );
};
