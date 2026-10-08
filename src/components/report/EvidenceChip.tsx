import React from "react";
import { EvidenceQuote } from "@/lib/types/report";
import { Quote, CheckCircle2 } from "lucide-react";

interface EvidenceChipProps {
  evidence: EvidenceQuote;
  onClickQuote: (segmentId: string) => void;
}

export const EvidenceChip: React.FC<EvidenceChipProps> = ({
  evidence,
  onClickQuote,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClickQuote(evidence.segment_id)}
      className="text-left w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-400 p-2.5 rounded-xl transition-all group cursor-pointer shadow-sm"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Verified Transcript Quote &bull; Segment #{evidence.segment_id}
        </span>
        <span className="text-[9px] text-blue-600 group-hover:underline">
          Jump to moment &rarr;
        </span>
      </div>
      <p className="text-xs text-slate-800 italic line-clamp-2">
        &ldquo;{evidence.quote}&rdquo;
      </p>
      {evidence.note && (
        <p className="text-[11px] text-slate-500 mt-1">
          <strong className="text-slate-700">Coach Note:</strong> {evidence.note}
        </p>
      )}
    </button>
  );
};
