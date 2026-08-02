"use client";

import { useState } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useUserContext } from "@/components/providers/UserProvider";
import { useToast } from "@/hooks/useToast";
import { ManageSubscriptionButton } from "@/components/settings/ManageSubscriptionButton";

const PREMIUM_FEATURES = [
  "Reevaluări nelimitate și alerte de risc în timp real",
  "Rapoarte PDF descărcabile",
  "Recomandări AI aprofundate, cu plan de acțiune pas cu pas",
  "Suport prioritar",
];

export default function PremiumPage() {
  const { profile } = useUserContext();
  const { toast } = useToast();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const isPremium = profile?.subscription === "premium";

  async function handleUpgrade() {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Plățile nu sunt încă active.", "info");
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      toast("Nu am putut porni procesul de upgrade. Încearcă din nou mai târziu.", "error");
    } finally {
      setLoadingCheckout(false);
    }
  }

  return (
    <div className="pb-24 pt-8">
      <Container className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-alert-to/10 text-alert-to">
            <Crown size={20} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">Premium</h1>
            <p className="text-sm text-ink-muted">
              {isPremium ? "Ești deja pe planul Premium." : "Monitorizare continuă a locuinței tale."}
            </p>
          </div>
        </div>

        <Card className="relative mt-8 overflow-hidden border-alert-to/30 p-8">
          {!isPremium && (
            <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-alert-to/15 px-2.5 py-1 text-[11px] font-medium text-alert-to">
              <Sparkles size={12} /> Recomandat
            </span>
          )}
          <ul className="space-y-3 text-sm">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-ink-muted">
                <Check size={16} className="mt-0.5 shrink-0 text-alert-to" />
                {f}
              </li>
            ))}
          </ul>

          {isPremium ? (
            <div className="mt-8 space-y-3">
              <div className="rounded-xl border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-center text-sm text-risk-low">
                Abonamentul tău Premium este activ.
              </div>
              <ManageSubscriptionButton className="w-full" />
            </div>
          ) : (
            <Button className="mt-8 w-full" onClick={handleUpgrade} disabled={loadingCheckout}>
              {loadingCheckout ? "Se pregătește..." : "Fă upgrade la Premium"}
            </Button>
          )}
        </Card>
      </Container>
    </div>
  );
}
