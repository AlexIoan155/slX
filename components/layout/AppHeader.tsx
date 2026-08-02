"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, UserCircle, Settings, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RISK_LEVEL_COLOR, levelFromScoreAscending } from "@/constants/risk-meta";
import { useToast } from "@/hooks/useToast";
import { signOut } from "@/services/auth.service";

export function AppHeader({
  name,
  email,
  avatarUrl,
  riskScore,
}: {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  riskScore: number | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await signOut();
      toast("Ai fost delogat.", "info");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delogarea a eșuat.", "error");
    }
  }

  const scoreLevel = riskScore !== null ? levelFromScoreAscending(riskScore) : null;
  const scoreColor = scoreLevel ? RISK_LEVEL_COLOR[scoreLevel] : null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-surface-border bg-base/80 px-6 backdrop-blur-md">
      {riskScore !== null && scoreColor && (
        <div className={`hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 sm:flex ${scoreColor.bg} ${scoreColor.text} ${scoreColor.ring}`}>
          Scor HomeRisk
          <span className="font-mono font-semibold">{riskScore}</span>
        </div>
      )}

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="focus-ring flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-surface-elevated"
          aria-expanded={open}
        >
          <Avatar name={name} email={email} avatarUrl={avatarUrl} size="sm" />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight">{name ?? "Contul meu"}</span>
            <span className="block text-xs leading-tight text-ink-faint">{email}</span>
          </span>
          <ChevronDown size={15} className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div
            role="menu"
            aria-label="Meniu cont"
            className="glass absolute right-0 top-12 z-50 w-56 rounded-2xl border border-surface-border p-1.5 shadow-card"
          >
            <div className="border-b border-surface-border px-3 py-2.5 sm:hidden">
              <p className="text-sm font-medium">{name ?? "Contul meu"}</p>
              <p className="text-xs text-ink-faint">{email}</p>
            </div>
            <Link
              href="/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-surface-elevated hover:text-ink"
            >
              <UserCircle size={16} /> Profil
            </Link>
            <Link
              href="/setari"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-surface-elevated hover:text-ink"
            >
              <Settings size={16} /> Setări
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-ink-muted hover:bg-surface-elevated hover:text-risk-critical"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
