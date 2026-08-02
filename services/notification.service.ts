import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, NotificationRow } from "@/types/database";

type Client = SupabaseClient<Database>;

/**
 * Client-safe notification reads/writes only — both functions accept
 * whichever Supabase client the caller already has (browser client from a
 * Client Component, or a server client from a Route Handler) and rely on
 * RLS / the `mark_notification_read` RPC for authorization.
 *
 * Anything that needs the service-role (admin) client lives in
 * services/notification-alerts.service.ts instead, which is marked
 * "server-only" — keeping it out of this file is what keeps
 * NotificationBell.tsx (a Client Component) safely importable.
 */

export async function listNotifications(supabase: Client, userId: string, limit = 20): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(supabase: Client, notificationId: string): Promise<void> {
  const { error } = await supabase.rpc("mark_notification_read", { p_notification_id: notificationId });
  if (error) throw error;
}
