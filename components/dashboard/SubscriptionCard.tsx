import Link from "next/link";
import { Crown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ManageSubscriptionButton } from "@/components/settings/ManageSubscriptionButton";
import type { SubscriptionPlan } from "@/types/database";

export function SubscriptionCard({ plan }: { plan: SubscriptionPlan }) {
  const isPremium = plan === "premium";
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isPremium ? "bg-alert-to/15 text-alert-to" : "bg-surface-elevated text-ink-muted"}`}>
          <Crown size={16} />
        </span>
        <div>
          <div className="text-sm text-ink-muted">Abonament curent</div>
          <div className="font-display font-semibold">{isPremium ? "Premium" : "Gratuit"}</div>
        </div>
      </div>
      {isPremium ? (
        <ManageSubscriptionButton className="mt-4 w-full" />
      ) : (
        <Link href="/premium" className="mt-4 block">
          <Button variant="secondary" size="sm" className="w-full">
            Vezi planul Premium
          </Button>
        </Link>
      )}
    </Card>
  );
}
