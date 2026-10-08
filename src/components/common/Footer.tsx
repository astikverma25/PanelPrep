import React from "react";
import { Info } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="PanelPrep Logo"
            className="w-5 h-5 rounded-md object-cover border border-slate-300"
          />
          <span>
            <strong className="text-slate-900">PANELPREP</strong> &bull; Voice-first Group Discussion AI Practice Room
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            AI Disclosure: Participants & moderator are AI agents. Practice metrics and transcripts are processed locally.
          </span>
        </div>
      </div>
    </footer>
  );
};
