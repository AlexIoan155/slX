"use client";

import { motion } from "framer-motion";
import { RISK_LEVEL_COLOR } from "@/constants/risk-meta";
import type { RiskLevel } from "@/types/domain";

const BAR_COLOR: Record<RiskLevel, string> = {
  scazut: "#34D399",
  moderat: "#FFB020",
  ridicat: "#FF7A3D",
  critic: "#FF4136",
};

export function ProbabilityBar({
  label,
  value,
  level,
}: {
  label: string;
  value: number;
  level: RiskLevel;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className={`font-mono font-medium ${RISK_LEVEL_COLOR[level].text}`}>{value}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: BAR_COLOR[level] }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
