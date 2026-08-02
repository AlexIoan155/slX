import { TrendingUp, Wallet, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PRIORITY_LABEL } from "@/constants/risk-meta";
import { formatRON, formatRONRange } from "@/utils/format";
import type { ActiveRecommendation } from "@/types/domain";

const PRIORITY_STYLE: Record<string, string> = {
  critica: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
  ridicata: "bg-risk-high/15 text-risk-high border-risk-high/30",
  medie: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30",
  scazuta: "bg-risk-low/15 text-risk-low border-risk-low/30",
};

export function RecommendationCard({ rec }: { rec: ActiveRecommendation }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-display font-semibold leading-snug">{rec.title}</h4>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${PRIORITY_STYLE[rec.priority]}`}
        >
          {PRIORITY_LABEL[rec.priority]}
        </span>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{rec.explanation}</p>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-surface-border pt-4 text-xs">
        <div>
          <div className="flex items-center gap-1.5 text-ink-faint">
            <Wallet size={13} /> Cost estimativ
          </div>
          <div className="mt-1 font-mono text-[13px] text-ink">
            {rec.estimatedCostRON[0] === 0 ? "Fără cost" : formatRONRange(rec.estimatedCostRON)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-ink-faint">
            <Zap size={13} /> Impact scor
          </div>
          <div className="mt-1 font-mono text-[13px] text-shield-to">+{rec.scoreImpact} pct</div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-ink-faint">
            <TrendingUp size={13} /> Economii/an
          </div>
          <div className="mt-1 font-mono text-[13px] text-ink">{formatRON(rec.estimatedAnnualSavingsRON)}</div>
        </div>
      </div>
    </Card>
  );
}
