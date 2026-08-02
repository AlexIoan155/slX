import Link from "next/link";
import { ShieldHalf } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-surface-border py-12">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-alert-from to-alert-to">
            <ShieldHalf size={14} className="text-black" strokeWidth={2.4} />
          </span>
          HomeRisk AI
        </div>

        <p className="text-center text-sm text-ink-faint">
          © {new Date().getFullYear()} HomeRisk AI. Prezicem riscurile locuinței înainte să apară.
        </p>

        <nav className="flex items-center gap-6 text-sm text-ink-muted">
          <Link href="/evaluare" className="hover:text-ink transition-colors">
            Evaluare
          </Link>
          <Link href="/dashboard" className="hover:text-ink transition-colors">
            Dashboard
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
