"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldHalf, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { signOut } from "@/services/auth.service";

const PUBLIC_LINKS = [
  { href: "/", label: "Acasă" },
  { href: "/#cum-functioneaza", label: "Cum funcționează" },
  { href: "/preturi", label: "Prețuri" },
];

// Only shown when a logged-in user browses a marketing page (e.g. the
// landing page) — the full app navigation lives in the sidebar once
// they're inside /dashboard, /evaluare, /istoric, /profil, /setari, /premium.
const AUTHENTICATED_LINKS = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, email, profile, loading } = useUser();
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  const links = isAuthenticated ? AUTHENTICATED_LINKS : PUBLIC_LINKS;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass shadow-card" : "bg-transparent border-b border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-alert-from to-alert-to">
            <ShieldHalf className="text-black" size={18} strokeWidth={2.4} />
          </span>
          HomeRisk <span className="text-gradient-alert">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-muted hover:text-ink transition-colors focus-ring"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-surface-elevated" />
          ) : isAuthenticated ? (
            <>
              <span className="text-sm text-ink-muted">{profile?.name ?? email}</span>
              <Button size="sm" variant="secondary" icon={<LogOut size={15} />} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Creează cont</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden focus-ring p-2 text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="md:hidden glass border-t border-surface-border">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2.5 text-sm text-ink-muted hover:bg-surface-elevated hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button className="mt-2 w-full" variant="secondary" icon={<LogOut size={15} />} onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link href="/login">
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">Creează cont</Button>
                </Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
