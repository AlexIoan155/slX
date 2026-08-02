import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

/**
 * Records an audit-trail entry via the `log_activity` RPC (a SECURITY
 * DEFINER function), rather than inserting into `activity_logs` directly —
 * that table intentionally has no client-facing INSERT policy.
 * Failures are logged but never thrown, since activity logging must never
 * block the user-facing action it is describing.
 */
export async function logActivity(
  supabase: Client,
  action: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.rpc("log_activity", {
    p_action: action,
    p_metadata: metadata ?? null,
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error(`[activity_logs] failed to log "${action}"`, error);
  }
}
