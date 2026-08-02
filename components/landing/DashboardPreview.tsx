"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { ProbabilityBar } from "@/components/dashboard/ProbabilityBar";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { generateTestAnswers } from "@/lib/test-data";
import { computeAssessment } from "@/lib/risk-engine";
import { RISK_LABELS } from "@/constants/risk-meta";
import { formatRON } from "@/utils/format";
import { ArrowRight } from "lucide-react";

export function DashboardPreview() {
  const result = useMemo(() => computeAssessment(generateTestAnswers(0.55, 2024)), []);

  return (
    <section id="dashboard" className="relative py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-alert-to">Dashboard</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Așa arată raportul complet al locuinței tale.
            </h2>
          </div>
          <Link href="/evaluare">
            <Button variant="secondary" icon={<ArrowRight size={16} />}>
              Generează-l pe al tău
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <Card className="flex flex-col items-center justify-center p-10">
            <ScoreGauge score={result.homeRiskScore} size={200} />
            <p className="mt-6 text-center text-sm text-ink-muted">
              Cost anual estimat al riscurilor:{" "}
              <span className="font-mono text-ink">{formatRON(result.estimatedAnnualCostRON)}</span>
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="font-display font-semibold">Probabilități pe categorii de risc</h3>
            <div className="mt-6 space-y-5">
              {result.detectedRisks.slice(0, 5).map((r) => (
                <ProbabilityBar key={r.key} label={RISK_LABELS[r.key]} value={r.probability} level={r.level} />
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {result.recommendations.slice(0, 2).map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      </Container>
    </section>
  );
}
