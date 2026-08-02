import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { completeAssessment } from "@/services/assessment-complete.service";

/**
 * Finalizes an assessment: scores it, persists the result, and (if the
 * score warrants it) creates a risk alert notification. This used to run
 * directly in the browser from hooks/useAssessment.ts, which broke because
 * completeAssessment transitively needs the Supabase admin client
 * (service-role key) for the notification write — that must never be
 * bundled into client code. The wizard now POSTs here instead; the actual
 * DB writes still run under the requesting user's own session (via
 * lib/supabase/server.ts), so RLS behaves exactly as before.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  try {
    const result = await completeAssessment(supabase, user.id, assessmentId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Nu am putut finaliza evaluarea.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
