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
      className="text-left w-full bg-slate-950/70 hover:bg-slate-900 border border-slate-800/90 hover:border-blue-500/50 p-2.5 rounded-xl transition-all group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Verified Transcript Quote &bull; Segment #{evidence.segment_id}
        </span>
        <span className="text-[9px] text-blue-400 group-hover:underline">
          Jump to moment &rarr;
        </span>
      </div>
      <p className="text-xs text-slate-200 italic line-clamp-2">
        &ldquo;{evidence.quote}&rdquo;
      </p>
      {evidence.note && (
        <p className="text-[11px] text-slate-400 mt-1">
          <strong>Coach Note:</strong> {evidence.note}
        </p>
      )}
    </button>
  );
};
