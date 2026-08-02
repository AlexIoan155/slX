import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - static assets (svg, png, jpg, jpeg, gif, webp, ico)
     * - api routes that must remain reachable without a session
     *   redirect (webhooks verify Stripe signatures themselves)
     */
    "/((?!_next/static|_next/image|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
