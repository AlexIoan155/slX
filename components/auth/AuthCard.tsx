import Link from "next/link";
import { ShieldHalf } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-16">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-24 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-glow-alert opacity-30 blur-3xl" aria-hidden />

      <Container className="relative flex justify-center">
        <Card glass className="w-full max-w-md p-8 sm:p-10">
          <Link href="/" className="flex items-center justify-center gap-2 font-display font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-alert-from to-alert-to">
              <ShieldHalf size={18} className="text-black" strokeWidth={2.4} />
            </span>
            HomeRisk AI
          </Link>

          <div className="mt-7 text-center">
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
          </div>

          <div className="mt-7">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
        </Card>
      </Container>
    </div>
  );
}
