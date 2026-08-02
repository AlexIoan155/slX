import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity.service";

/**
 * Permanently deletes the requesting user's account. Deleting the
 * `auth.users` row cascades through every table that references
 * `profiles.id` (assessments, risk_results, subscriptions, payments,
 * notifications, activity_logs — all declared `on delete cascade` in
 * supabase/migrations/0001_init.sql), so a single admin call is enough.
 *
 * Uses the admin client deliberately: the Auth Admin API (`auth.admin.*`)
 * is not reachable through a normal user session, by design.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  try {
    await logActivity(supabase, "account_deletion_requested");
  } catch {
    // Never block deletion on a failed audit-log write.
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
