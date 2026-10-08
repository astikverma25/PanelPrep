import React from "react";
import { Info, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-arena-border/40 bg-arena-dark/95 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>
            <strong>GD Arena</strong> &bull; Voice-first Group Discussion AI Practice Room
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-arena-card/60 px-3 py-1.5 rounded-md border border-arena-border/60">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            AI Disclosure: Other participants & moderator are AI agents. Practice metrics and transcripts are processed locally.
          </span>
        </div>
      </div>
    </footer>
  );
};
