import React from "react";
import { MissedOpening } from "@/lib/types/report";
import { Lightbulb, ArrowRight } from "lucide-react";

interface MissedOpeningsProps {
  missedOpenings: MissedOpening[];
  onClickSegment: (segmentId: string) => void;
}

export const MissedOpenings: React.FC<MissedOpeningsProps> = ({
  missedOpenings,
  onClickSegment,
}) => {
  if (!missedOpenings || missedOpenings.length === 0) return null;

  return (
    <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="text-sm font-bold text-amber-200">
          Missed Openings &bull; &ldquo;What You Could Have Said&rdquo; Replay
        </h4>
      </div>
      <p className="text-xs text-slate-300">
        Moments where other speakers opened up an opportunity or made an assumption you could have capitalized on:
      </p>

      <div className="space-y-3 pt-1">
        {missedOpenings.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-amber-500/30 p-3.5 rounded-xl space-y-2"
          >
            {item.context_snippet && (
              <p className="text-xs text-slate-400 italic">
                Context: &ldquo;{item.context_snippet}&rdquo;
              </p>
            )}
            <div className="text-xs text-amber-300 font-medium leading-relaxed bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <strong>Suggested Intervention:</strong> {item.suggestion}
            </div>
            {item.after_segment_id && (
              <button
                type="button"
                onClick={() => onClickSegment(item.after_segment_id)}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Jump to turn #{item.after_segment_id}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
