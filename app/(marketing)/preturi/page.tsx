import Link from "next/link";
import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Prețuri — HomeRisk AI",
  description: "Planurile HomeRisk AI: gratuit pentru totdeauna, cu Premium în curând.",
};

const FREE_FEATURES = [
  "Evaluare completă a locuinței (54 de întrebări)",
  "Scor HomeRisk și probabilități pe 7 categorii de risc",
  "Recomandări personalizate cu cost estimativ",
  "Istoric al evaluărilor anterioare",
];

const PREMIUM_FEATURES = [
  "Tot ce include planul Gratuit",
  "Alerte automate la schimbări semnificative de risc",
  "Rapoarte PDF descărcabile",
  "Reevaluări programate automat",
  "Suport prioritar",
];

export default function PreturiPage() {
  return (
    <div className="min-h-screen pb-24 pt-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-alert-to">Prețuri</span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Simplu, transparent, fără costuri ascunse.
          </h1>
          <p className="mt-4 text-[17px] text-ink-muted">
            HomeRisk AI este gratuit pentru evaluarea de bază. Planul Premium este în pregătire.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          <Card className="p-8">
            <h2 className="font-display text-lg font-semibold">Gratuit</h2>
            <p className="mt-1 text-sm text-ink-muted">Pentru orice proprietar care vrea să-și cunoască riscurile.</p>
            <div className="mt-5 font-mono text-3xl font-semibold">0 RON</div>
            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-shield-to" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="mt-7 block">
              <Button variant="secondary" className="w-full">
                Creează cont gratuit
              </Button>
            </Link>
          </Card>

          <Card className="relative overflow-hidden border-alert-to/30 p-8">
            <span className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-alert-to/15 px-3 py-1 text-xs font-medium text-alert-to">
              <Sparkles size={12} /> În curând
            </span>
            <h2 className="font-display text-lg font-semibold">Premium</h2>
            <p className="mt-1 text-sm text-ink-muted">Pentru proprietari care vor monitorizare continuă.</p>
            <div className="mt-5 font-mono text-3xl font-semibold text-ink-faint">—</div>
            <ul className="mt-6 space-y-3">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-alert-to" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-7 w-full" disabled>
              Plățile nu sunt încă active
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
