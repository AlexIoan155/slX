import { AlertTriangle } from "lucide-react";
import type { RiskLevel } from "@/types/domain";

export function RiskAlertBanner({ level }: { level: RiskLevel }) {
  if (level !== "ridicat" && level !== "critic") return null;

  const critical = level === "critic";
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${
        critical ? "border-risk-critical/30 bg-risk-critical/10" : "border-risk-high/30 bg-risk-high/10"
      }`}
    >
      <AlertTriangle size={19} className={critical ? "text-risk-critical" : "text-risk-high"} />
      <div>
        <p className={`font-medium ${critical ? "text-risk-critical" : "text-risk-high"}`}>
          {critical ? "Risc critic detectat în locuința ta" : "Risc ridicat detectat în locuința ta"}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Verifică recomandările prioritare de mai jos — câteva intervenții simple pot reduce semnificativ expunerea.
        </p>
      </div>
    </div>
  );
}
