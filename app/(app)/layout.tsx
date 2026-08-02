"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { UserProvider, useUserContext } from "@/components/providers/UserProvider";

/**
 * Shared shell for every authenticated route (Dashboard, Evaluare, Istoric,
 * Profil, Setări, Premium). middleware.ts already redirects unauthenticated
 * requests server-side before this ever renders; the client-side check here
 * is a defensive second layer (e.g. session expiring mid-visit).
 *
 * <UserProvider> opens a single Supabase auth subscription for the whole
 * shell — child pages read it via useUserContext() instead of each calling
 * useUser() and opening their own listener.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppShell>{children}</AppShell>
    </UserProvider>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userId, email, profile, loading } = useUserContext();

  useEffect(() => {
    if (!loading && !userId) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [loading, userId, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-surface-border border-t-alert-to" />
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          name={profile?.name ?? null}
          email={profile?.email ?? email}
          avatarUrl={profile?.avatar_url ?? null}
          riskScore={profile?.risk_score ?? null}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
