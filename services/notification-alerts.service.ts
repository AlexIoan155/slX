import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import type { AssessmentResult } from "@/types/domain";

/**
 * In-app notification only for now — no email/push delivery pipeline yet
 * (Stripe and email delivery are intentionally left as scaffolding, see
 * README). Called from services/assessment-complete.service.ts right after
 * an assessment completes — that file, and this one, only ever run
 * server-side (via app/api/assessments/[assessmentId]/complete/route.ts).
 *
 * Uses the admin (service role) client deliberately: `notifications` has no
 * client-facing INSERT policy, since a user must never be able to write
 * arbitrary rows into their own notification feed. The explicit
 * `import "server-only"` above makes sure a future accidental import from a
 * Client Component fails fast at build time instead of shipping the
 * service-role key path into the browser bundle.
 */
export async function maybeCreateRiskAlert(userId: string, result: AssessmentResult): Promise<void> {
  if (result.riskLevel !== "ridicat" && result.riskLevel !== "critic") return;

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("notifications").insert({
      user_id: userId,
      type: "risk_alert",
      title: result.riskLevel === "critic" ? "Risc critic detectat" : "Risc ridicat detectat",
      body: `Ultima ta evaluare arată un scor HomeRisk de ${result.homeRiskScore}. Verifică recomandările prioritare din dashboard.`,
    });
    if (error) throw error;
  } catch (err) {
    // Never let a notification failure block the assessment flow.
    // eslint-disable-next-line no-console
    console.error("[notifications] failed to create risk alert", err);
  }
}
