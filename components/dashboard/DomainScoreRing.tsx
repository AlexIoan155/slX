"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function DomainScoreRing({
  icon: Icon,
  label,
  value,
  color = "#22D3EE",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  color?: string;
}) {
  const size = 84;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={16} className="text-ink-muted" />
          <span className="mt-1 font-mono text-sm font-semibold">{value}</span>
        </div>
      </div>
      <span className="text-xs text-ink-muted">{label}</span>
    </div>
  );
}
