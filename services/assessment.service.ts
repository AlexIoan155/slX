import { TOTAL_QUESTIONS } from "@/data/questions";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AssessmentRow, RiskResultRow } from "@/types/database";
import type { Answers, AssessmentResult } from "@/types/domain";

type Client = SupabaseClient<Database>;

/**
 * Client-safe assessment reads/writes — every function here accepts
 * whichever Supabase client the caller already has (browser client from a
 * Client Component, or a server client from a Route Handler) and relies on
 * RLS for authorization. None of these touch the admin client.
 *
 * `completeAssessment` (the scoring + notification step, which needs the
 * admin client) lives in services/assessment-complete.service.ts instead —
 * splitting it out is what keeps this file safely importable from
 * hooks/useAssessment.ts and hooks/useAssessmentResult.ts (both Client
 * Components).
 */

export async function getOrCreateInProgressAssessment(
  supabase: Client,
  userId: string
): Promise<AssessmentRow> {
  const { data: existing, error: findError } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from("assessments")
    .insert({ user_id: userId, status: "in_progress" })
    .select("*")
    .single();
  if (createError) throw createError;
  return created;
}

export async function saveAnswer(
  supabase: Client,
  assessmentId: string,
  questionId: string,
  value: string
): Promise<void> {
  const { error } = await supabase
    .from("assessment_answers")
    .upsert({ assessment_id: assessmentId, question_id: questionId, value }, { onConflict: "assessment_id,question_id" });
  if (error) throw error;
}

export async function getAnswers(supabase: Client, assessmentId: string): Promise<Answers> {
  const { data, error } = await supabase
    .from("assessment_answers")
    .select("question_id, value")
    .eq("assessment_id", assessmentId);
  if (error) throw error;
  const answers: Answers = {};
  (data ?? []).forEach((row) => {
    answers[row.question_id] = row.value;
  });
  return answers;
}

export async function getLatestResult(supabase: Client, userId: string): Promise<RiskResultRow | null> {
  const { data, error } = await supabase
    .from("risk_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAssessmentHistory(supabase: Client, userId: string, limit = 10): Promise<RiskResultRow[]> {
  const { data, error } = await supabase
    .from("risk_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/**
 * Converts a `risk_results` row (snake_case, jsonb columns typed as
 * `unknown`) back into the app's `AssessmentResult` shape. The jsonb
 * columns were written directly from a real `AssessmentResult` in
 * `completeAssessment`, so this is a safe, structure-preserving mapping —
 * not a re-derivation of the data.
 */
export function rowToAssessmentResult(row: RiskResultRow): AssessmentResult {
  return {
    homeRiskScore: row.home_risk_score,
    riskLevel: row.risk_level as AssessmentResult["riskLevel"],
    probabilities: row.probabilities as unknown as AssessmentResult["probabilities"],
    domainScores: row.domain_scores as unknown as AssessmentResult["domainScores"],
    estimatedAnnualCostRON: row.estimated_annual_cost_ron,
    interventionPriority: row.intervention_priority as AssessmentResult["interventionPriority"],
    detectedRisks: row.detected_risks as AssessmentResult["detectedRisks"],
    recommendations: row.recommendations as AssessmentResult["recommendations"],
    answeredAt: row.created_at,
    answersCount: TOTAL_QUESTIONS,
  };
}
