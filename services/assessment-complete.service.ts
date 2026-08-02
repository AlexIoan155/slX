import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { AssessmentResult } from "@/types/domain";
import { computeAssessment } from "@/lib/risk-engine";
import { getAnswers } from "@/services/assessment.service";
import { syncProfileAfterAssessment } from "@/services/profile.service";
import { logActivity } from "@/services/activity.service";
import { maybeCreateRiskAlert } from "@/services/notification-alerts.service";

type Client = SupabaseClient<Database>;

/**
 * Runs the (unchanged) HomeRisk engine over the stored answers, then
 * persists the result and keeps the profile summary + notifications in
 * sync. Only ever called server-side, via
 * app/api/assessments/[assessmentId]/complete/route.ts — never directly
 * from a Client Component. That route uses the requesting user's own
 * server-side session (so every write here still goes through the same
 * RLS policies as before), while `maybeCreateRiskAlert` internally uses
 * the admin client for the one write that needs it (`notifications`).
 */
export async function completeAssessment(
  supabase: Client,
  userId: string,
  assessmentId: string
): Promise<AssessmentResult> {
  const answers = await getAnswers(supabase, assessmentId);
  const result = computeAssessment(answers);

  const { error: assessmentError } = await supabase
    .from("assessments")
    .update({ status: "completed", answers_count: result.answersCount, completed_at: result.answeredAt })
    .eq("id", assessmentId)
    .eq("user_id", userId);
  if (assessmentError) throw assessmentError;

  const { error: resultError } = await supabase.from("risk_results").upsert(
    {
      assessment_id: assessmentId,
      user_id: userId,
      home_risk_score: result.homeRiskScore,
      risk_level: result.riskLevel,
      probabilities: result.probabilities,
      domain_scores: result.domainScores,
      estimated_annual_cost_ron: result.estimatedAnnualCostRON,
      intervention_priority: result.interventionPriority,
      detected_risks: result.detectedRisks,
      recommendations: result.recommendations,
    },
    { onConflict: "assessment_id" }
  );
  if (resultError) throw resultError;

  await syncProfileAfterAssessment(supabase, userId, result.homeRiskScore);
  await logActivity(supabase, "assessment_completed", { assessmentId, homeRiskScore: result.homeRiskScore });
  await maybeCreateRiskAlert(userId, result);

  return result;
}
