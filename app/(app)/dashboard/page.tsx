"use client";

import Link from "next/link";
import { Wallet, AlertOctagon, ClipboardCheck, ShieldCheck, Wrench, Wifi, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { DomainScoreRing } from "@/components/dashboard/DomainScoreRing";
import { ProbabilityBar } from "@/components/dashboard/ProbabilityBar";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { RiskTimeline } from "@/components/dashboard/RiskTimeline";
import { StatCard } from "@/components/dashboard/StatCard";
import { HistoryList } from "@/components/dashboard/HistoryList";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { RiskAlertBanner } from "@/components/dashboard/RiskAlertBanner";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { DownloadReportButton } from "@/components/dashboard/DownloadReportButton";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useUserContext } from "@/components/providers/UserProvider";
import { useAssessmentResult } from "@/hooks/useAssessmentResult";
import { rowToAssessmentResult } from "@/services/assessment.service";
import { RISK_LABELS, RISK_LEVEL_LABEL, RISK_LEVEL_COLOR } from "@/constants/risk-meta";
import { formatDate, formatRON } from "@/utils/format";

export default function DashboardPage() {
  // Auth is already guaranteed by app/(app)/layout.tsx — userId is never
  // null here in practice, but the hook's type still allows it, so the
  // narrow checks below stay for type-safety rather than re-guarding auth.
  const { userId, profile } = useUserContext();
  const { result: resultRow, history, loading: resultLoading, error } = useAssessmentResult(userId);

  if (resultLoading) {
    return <DashboardSkeleton />;
  }

  if (!userId) return null;

  const firstName = profile?.name?.split(" ")[0] ?? "acolo";

  if (!resultRow) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
        <Card className="max-w-md p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-alert-to/10 text-alert-to">
            <Sparkles size={22} />
          </span>
          <h1 className="mt-5 font-display text-xl font-semibold">Salut, {firstName}!</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
            Nu ai încă un raport HomeRisk. Completează evaluarea locuinței tale ca să generezi scorul,
            probabilitățile de risc și recomandările personalizate.
          </p>
          <Link href="/evaluare" className="mt-7 block">
            <Button className="w-full">Începe evaluarea</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const result = rowToAssessmentResult(resultRow);
  const levelColor = RISK_LEVEL_COLOR[result.riskLevel];

  return (
    <div className="pb-24 pt-8">
      <Container>
        {error && (
          <div className="mb-6 rounded-xl border border-risk-critical/30 bg-risk-critical/10 px-4 py-3 text-sm text-risk-critical">
            {error}
          </div>
        )}

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">Salut, {firstName}!</h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Ultima analiză: {formatDate(result.answeredAt)} · {result.answersCount} răspunsuri
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell userId={userId} />
            <span
              className={`inline-flex w-max items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ${levelColor.bg} ${levelColor.text} ${levelColor.ring}`}
            >
              {RISK_LEVEL_LABEL[result.riskLevel]}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <RiskAlertBanner level={result.riskLevel} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/evaluare">
            <Button size="sm">Evaluare nouă</Button>
          </Link>
          <DownloadReportButton isPremium={profile?.subscription === "premium"} />
        </div>

        {/* Top row: score + domain scores */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="flex flex-col items-center justify-center p-10">
            <ScoreGauge score={result.homeRiskScore} size={220} />
          </Card>

          <Card className="p-8">
            <h3 className="font-display font-semibold">Scoruri pe domenii</h3>
            <div className="mt-6 flex flex-wrap justify-around gap-6">
              <DomainScoreRing icon={ShieldCheck} label="Siguranță" value={result.domainScores.safety} color="#22D3EE" />
              <DomainScoreRing icon={Wrench} label="Întreținere" value={result.domainScores.maintenance} color="#34D399" />
              <DomainScoreRing icon={Wifi} label="Smart Home" value={result.domainScores.smartHome} color="#FFB020" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={Wallet} label="Cost anual estimat" value={formatRON(result.estimatedAnnualCostRON)} accent="text-alert-to" />
              <StatCard
                icon={AlertOctagon}
                label="Prioritate intervenție"
                value={RISK_LEVEL_LABEL[result.interventionPriority]}
                accent={RISK_LEVEL_COLOR[result.interventionPriority].text}
              />
              <StatCard icon={ClipboardCheck} label="Recomandări active" value={String(result.recommendations.length)} />
            </div>
          </Card>
        </div>

        {/* Subscription + history */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
          <SubscriptionCard plan={profile?.subscription ?? "free"} />
          <div>
            <HistoryList history={history.slice(0, 5)} />
            {history.length > 1 && (
              <Link href="/istoric" className="mt-3 inline-block text-sm text-ink-muted hover:text-ink transition-colors">
                Vezi tot istoricul →
              </Link>
            )}
          </div>
        </div>

        {/* Probabilities */}
        <Card className="mt-6 p-8">
          <h3 className="font-display font-semibold">Probabilități pe categorii de risc</h3>
          <div className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {(Object.keys(result.probabilities) as (keyof typeof result.probabilities)[]).map((key) => (
              <ProbabilityBar
                key={key}
                label={RISK_LABELS[key]}
                value={result.probabilities[key]}
                level={
                  result.detectedRisks.find((r) => r.key === key)?.level ??
                  (result.probabilities[key] >= 30 ? "moderat" : "scazut")
                }
              />
            ))}
          </div>
        </Card>

        {/* Detected risks + timeline */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-8">
            <h3 className="font-display font-semibold">Riscuri detectate</h3>
            <div className="mt-5 space-y-4">
              {result.detectedRisks.length === 0 && (
                <p className="text-sm text-ink-muted">Niciun risc semnificativ detectat. Continuă rutina de întreținere.</p>
              )}
              {result.detectedRisks.map((risk) => {
                const c = RISK_LEVEL_COLOR[risk.level];
                return (
                  <div key={risk.key} className="flex items-start justify-between gap-4 border-b border-surface-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{risk.label}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${c.bg} ${c.text}`}>
                          {RISK_LEVEL_LABEL[risk.level]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">{risk.description}</p>
                    </div>
                    <span className="font-mono text-lg font-semibold shrink-0">{risk.probability}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="font-display font-semibold">Ordinea recomandată de intervenție</h3>
            <div className="mt-6">
              <RiskTimeline items={result.recommendations} />
            </div>
          </Card>
        </div>

        {/* Recommendations grid */}
        <div className="mt-10">
          <h3 className="font-display text-xl font-semibold">Recomandări AI personalizate</h3>
          <p className="mt-1.5 text-sm text-ink-muted">
            Generate exclusiv din răspunsurile tale — fiecare recomandare rezolvă un risc identificat concret.
          </p>
          {result.recommendations.length === 0 ? (
            <p className="mt-6 text-sm text-ink-muted">Nicio recomandare — locuința ta este într-o stare foarte bună.</p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {result.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
