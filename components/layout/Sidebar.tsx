"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldHalf,
  LayoutDashboard,
  ClipboardList,
  History,
  UserCircle,
  Settings,
  Crown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { signOut } from "@/services/auth.service";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/evaluare", label: "Evaluare", icon: ClipboardList },
  { href: "/istoric", label: "Istoric", icon: History },
  { href: "/profil", label: "Profil", icon: UserCircle },
  { href: "/setari", label: "Setări", icon: Settings },
  { href: "/premium", label: "Premium", icon: Crown },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

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

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2 px-5 pt-6 pb-2 font-display font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-alert-from to-alert-to">
          <ShieldHalf size={18} className="text-black" strokeWidth={2.4} />
        </span>
        HomeRisk <span className="text-gradient-alert">AI</span>
      </Link>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="focus-ring relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-surface-elevated"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <item.icon
                size={17}
                className={`relative z-10 shrink-0 ${active ? "text-alert-to" : "text-ink-faint"}`}
              />
              <span className={`relative z-10 ${active ? "text-ink font-medium" : "text-ink-muted"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-border p-3">
        <button
          onClick={handleLogout}
          className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-elevated hover:text-risk-critical"
        >
          <LogOut size={17} className="shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-surface/60 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile: top bar trigger + slide-in drawer */}
      <div className="glass sticky top-0 z-40 flex h-14 items-center justify-between border-b border-surface-border px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-display font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-alert-from to-alert-to">
            <ShieldHalf size={14} className="text-black" strokeWidth={2.4} />
          </span>
          HomeRisk AI
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="focus-ring p-2 text-ink"
          aria-label="Deschide meniul"
        >
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-surface lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="focus-ring absolute right-3 top-4 p-2 text-ink-muted hover:text-ink"
                aria-label="Închide meniul"
              >
                <X size={20} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
