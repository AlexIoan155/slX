import { History } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RISK_LEVEL_COLOR, RISK_LEVEL_LABEL } from "@/constants/risk-meta";
import { formatDate } from "@/utils/format";
import type { RiskResultRow } from "@/types/database";
import type { RiskLevel } from "@/types/domain";

export function HistoryList({ history }: { history: RiskResultRow[] }) {
  if (history.length <= 1) {
    return (
      <Card className="p-8">
        <div className="flex items-center gap-2 text-ink-muted">
          <History size={17} />
          <h3 className="font-display font-semibold text-ink">Istoric evaluări</h3>
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Fiecare evaluare nouă apare aici, ca să poți urmări evoluția scorului HomeRisk în timp.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="flex items-center gap-2 text-ink-muted">
        <History size={17} />
        <h3 className="font-display font-semibold text-ink">Istoric evaluări</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {history.map((row) => {
          const level = row.risk_level as RiskLevel;
          const color = RISK_LEVEL_COLOR[level] ?? RISK_LEVEL_COLOR.moderat;
          return (
            <li key={row.id} className="flex items-center justify-between border-b border-surface-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm">{formatDate(row.created_at)}</div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${color.bg} ${color.text}`}>
                  {RISK_LEVEL_LABEL[level] ?? row.risk_level}
                </span>
              </div>
              <span className="font-mono text-lg font-semibold">{row.home_risk_score}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
