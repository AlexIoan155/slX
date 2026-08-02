"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useUserContext } from "@/components/providers/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { getAssessmentHistory } from "@/services/assessment.service";
import { RISK_LEVEL_COLOR, RISK_LEVEL_LABEL } from "@/constants/risk-meta";
import { formatDate, formatRON } from "@/utils/format";
import type { RiskResultRow } from "@/types/database";
import type { RiskLevel } from "@/types/domain";

export default function IstoricPage() {
  const { userId } = useUserContext();
  const [history, setHistory] = useState<RiskResultRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    const supabase = createClient();
    getAssessmentHistory(supabase, userId, 50)
      .then((data) => {
        if (active) setHistory(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Nu am putut încărca istoricul.");
      });
    return () => {
      active = false;
    };
  }, [userId]);

  if (!userId || history === null) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="pb-24 pt-8">
      <Container className="max-w-3xl">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Istoric evaluări</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Toate evaluările tale HomeRisk, în ordine cronologică.</p>

        {error && (
          <div className="mt-6 rounded-xl border border-risk-critical/30 bg-risk-critical/10 px-4 py-3 text-sm text-risk-critical">
            {error}
          </div>
        )}

        {history.length === 0 ? (
          <Card className="mt-8 p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-alert-to/10 text-alert-to">
              <History size={22} />
            </span>
            <h2 className="mt-5 font-display text-lg font-semibold">Nicio evaluare încă</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Completează prima evaluare ca să începi să-ți urmărești istoricul scorului HomeRisk.
            </p>
            <Link href="/evaluare" className="mt-6 block">
              <Button className="w-full">Începe evaluarea</Button>
            </Link>
          </Card>
        ) : (
          <div className="mt-8 space-y-3">
            {history.map((row) => {
              const level = row.risk_level as RiskLevel;
              const color = RISK_LEVEL_COLOR[level] ?? RISK_LEVEL_COLOR.moderat;
              return (
                <Card key={row.id} className="flex items-center justify-between p-5">
                  <div>
                    <div className="text-sm text-ink-muted">{formatDate(row.created_at)}</div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color.bg} ${color.text}`}>
                        {RISK_LEVEL_LABEL[level] ?? row.risk_level}
                      </span>
                      <span className="text-xs text-ink-faint">
                        Cost anual estimat: {formatRON(row.estimated_annual_cost_ron)}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-2xl font-semibold">{row.home_risk_score}</span>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
