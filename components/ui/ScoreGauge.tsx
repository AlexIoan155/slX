"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";

function colorForScore(score: number): { stroke: string; glow: string } {
  if (score >= 80) return { stroke: "#34D399", glow: "rgba(52,211,153,0.45)" };
  if (score >= 60) return { stroke: "#FFB020", glow: "rgba(255,176,32,0.4)" };
  if (score >= 40) return { stroke: "#FF7A3D", glow: "rgba(255,122,61,0.4)" };
  return { stroke: "#FF4136", glow: "rgba(255,65,54,0.45)" };
}

export function ScoreGauge({
  score,
  size = 240,
  strokeWidth = 14,
  label = "Scor HomeRisk",
  className,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const { stroke, glow } = colorForScore(score);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = circumference * (1 - displayScore / 100);

  return (
    <div
      className={clsx("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-70"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
        aria-hidden
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-5xl font-semibold tabular-nums text-ink">{displayScore}</span>
        <span className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      </div>
    </div>
  );
}
