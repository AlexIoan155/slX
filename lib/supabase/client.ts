"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * `createBrowserClient<Database>()` (from @supabase/ssr) and
 * `SupabaseClient<Database>` (from @supabase/supabase-js, used everywhere
 * else in services/* as `type Client = SupabaseClient<Database>`) resolve
 * their extra generic parameters slightly differently. Both describe the
 * same real client at runtime, but `tsc`'s full program check (the one
 * `next build` runs, unlike the faster dev-server check) treats them as
 * structurally distinct types unless the return type is pinned explicitly
 * here — this annotation is what keeps every service call type-safe
 * without any of them needing a cast.
 *
 * One client per browser tab is enough; Supabase's browser client is
 * lightweight and safe to re-create, but we memoize it to avoid opening a
 * new realtime/auth listener on every render.
 */
let browserClient: SupabaseClient<Database> | undefined;

export function createClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Lipsesc NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Verifică .env.local."
    );
  }

  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}
