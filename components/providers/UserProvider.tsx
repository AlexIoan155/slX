"use client";

import { createContext, useContext } from "react";
import { useUser } from "@/hooks/useUser";

type UserContextValue = ReturnType<typeof useUser>;

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const value = useUser();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Reads the auth/profile state established by the nearest <UserProvider>
 * (mounted once in app/(app)/layout.tsx). Prefer this over calling
 * useUser() directly inside a page — it avoids opening a second
 * Supabase auth listener per page.
 */
export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext trebuie folosit în interiorul <UserProvider>.");
  return ctx;
}
