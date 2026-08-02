import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates a request-scoped Supabase client backed by the Next.js cookie
 * jar. Must be called fresh on every request (Server Component, Route
 * Handler or Server Action) — never cached at module scope, since it is
 * bound to the current request's cookies.
 *
 * Return type is pinned to the canonical `SupabaseClient<Database>` (see
 * the matching comment in lib/supabase/client.ts) so it stays assignable
 * everywhere `services/*` expect `type Client = SupabaseClient<Database>`,
 * including under `next build`'s full type-check.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Lipsesc NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Verifică .env.local."
    );
  }

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // `setAll` is called from a Server Component in some cases (e.g.
          // during static rendering), where cookies cannot be mutated.
          // Safe to ignore as long as middleware.ts also refreshes the
          // session on every request.
        }
      },
    },
  });
}

/**
 * Admin client using the service role key — bypasses Row Level Security.
 * Only ever import this from trusted server-only code (webhooks, cron
 * jobs, admin tooling). Never expose it to a Client Component.
 */
export function createAdminClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Lipsesc NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY pentru clientul admin.");
  }

  // Imported lazily to keep the service-role key out of any client bundle.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
