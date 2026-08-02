"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/services/profile.service";
import type { ProfileRow } from "@/types/database";

interface UseUserState {
  userId: string | null;
  email: string | null;
  profile: ProfileRow | null;
  loading: boolean;
}

export function useUser() {
  const [state, setState] = useState<UseUserState>({
    userId: null,
    email: null,
    profile: null,
    loading: true,
  });

  const loadProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    try {
      const profile = await getProfile(supabase, userId);
      setState((s) => ({ ...s, profile }));
    } catch {
      // Profile row is created by a DB trigger on signup; a transient miss
      // (e.g. right after email confirmation) will resolve on next refresh.
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const user = data.user;
      setState({
        userId: user?.id ?? null,
        email: user?.email ?? null,
        profile: null,
        loading: false,
      });
      if (user) loadProfile(user.id);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setState({
        userId: user?.id ?? null,
        email: user?.email ?? null,
        profile: null,
        loading: false,
      });
      if (user) loadProfile(user.id);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const refreshProfile = useCallback(() => {
    if (state.userId) return loadProfile(state.userId);
    return Promise.resolve();
  }, [state.userId, loadProfile]);

  return { ...state, isAuthenticated: Boolean(state.userId), refreshProfile };
}
