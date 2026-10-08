import React from "react";
import { FeedbackDimension } from "@/lib/types/report";
import { EvidenceChip } from "./EvidenceChip";
import { Star, CheckCircle, AlertCircle } from "lucide-react";

interface DimensionCardProps {
  dimension: FeedbackDimension;
  onClickQuote: (segmentId: string) => void;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({
  dimension,
  onClickQuote,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (score === 3) return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-sm font-bold text-white leading-snug">
            {dimension.displayName}
          </h4>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${getScoreColor(
              dimension.score
            )}`}
          >
            <Star className="w-3 h-3 fill-current" />
            {dimension.score} / 5
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {dimension.summary}
        </p>

        {/* Strengths & Improvements */}
        <div className="space-y-2 mb-3">
          {dimension.strengths?.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                What went well:
              </span>
              {dimension.strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}

          {dimension.improvements?.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Areas to elevate:
              </span>
              {dimension.improvements.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verified Evidence Quotes */}
      {dimension.evidence && dimension.evidence.length > 0 ? (
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Evidence Moments:
          </span>
          {dimension.evidence.map((ev, idx) => (
            <EvidenceChip key={idx} evidence={ev} onClickQuote={onClickQuote} />
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-slate-500 italic pt-2 border-t border-slate-800">
          No direct moment cited for this dimension.
        </div>
      )}
    </div>
  );
};
