import { PRIORITY_LABEL } from "@/constants/risk-meta";
import { formatRONRange } from "@/utils/format";
import type { ActiveRecommendation } from "@/types/domain";

const DOT_COLOR: Record<string, string> = {
  critica: "bg-risk-critical",
  ridicata: "bg-risk-high",
  medie: "bg-risk-moderate",
  scazuta: "bg-risk-low",
};

export function RiskTimeline({ items }: { items: ActiveRecommendation[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Nicio intervenție urgentă identificată — locuința ta stă foarte bine. Continuă reviziile periodice.
      </p>
    );
  }

  return (
    <ol className="relative space-y-7 pl-6">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-surface-border" />
      {items.map((rec, i) => (
        <li key={rec.id} className="relative">
          <span
            className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full ring-4 ring-base ${DOT_COLOR[rec.priority]}`}
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              Pasul {i + 1} · {PRIORITY_LABEL[rec.priority]}
            </span>
            <span className="font-mono text-xs text-ink-faint">
              {rec.estimatedCostRON[0] === 0 ? "fără cost" : formatRONRange(rec.estimatedCostRON)}
            </span>
          </div>
          <h4 className="mt-1 font-display font-medium">{rec.title}</h4>
        </li>
      ))}
    </ol>
  );
}
