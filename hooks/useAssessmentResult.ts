"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAssessmentHistory, getLatestResult } from "@/services/assessment.service";
import type { RiskResultRow } from "@/types/database";

/**
 * Reads the authoritative HomeRisk result straight from Supabase
 * (`risk_results`), scoped by RLS to the signed-in user. Used by the
 * dashboard; the /dashboard route itself is protected by middleware.ts.
 */
export function useAssessmentResult(userId: string | null) {
  const [result, setResult] = useState<RiskResultRow | null>(null);
  const [history, setHistory] = useState<RiskResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useRef(createClient()).current;

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [latest, past] = await Promise.all([
        getLatestResult(supabase, userId),
        getAssessmentHistory(supabase, userId),
      ]);
      setResult(latest);
      setHistory(past);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut încărca rezultatele.");
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  return { result, history, loading, error, refresh: load };
}
