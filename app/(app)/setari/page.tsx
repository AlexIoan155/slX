"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Crown, Bell, AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { DeleteAccountForm } from "@/components/settings/DeleteAccountForm";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useUserContext } from "@/components/providers/UserProvider";
import type { ProfileRow } from "@/types/database";

export default function SetariPage() {
  const { userId, profile, refreshProfile } = useUserContext();
  const [current, setCurrent] = useState<ProfileRow | null>(profile);

  if (userId && !profile) {
    return <DashboardSkeleton />;
  }

  if (!userId || !profile || !current) return null;

  function handleSaved(updated: ProfileRow) {
    setCurrent(updated);
    refreshProfile();
  }

  return (
    <div className="pb-24 pt-8">
      <Container className="max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Setări</h1>
          <p className="mt-1.5 text-sm text-ink-muted">Gestionează contul, securitatea și abonamentul.</p>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-2 text-ink-muted">
            <Mail size={16} />
            <h2 className="font-display font-semibold text-ink">Cont</h2>
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Autentificat cu <span className="text-ink">{current.email}</span>
          </p>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-2 text-ink-muted">
            <ShieldCheck size={16} />
            <h2 className="font-display font-semibold text-ink">Securitate</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">Schimbă parola contului tău.</p>
          <div className="mt-5">
            <ChangePasswordForm />
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-2 text-ink-muted">
            <Bell size={16} />
            <h2 className="font-display font-semibold text-ink">Notificări</h2>
          </div>
          <div className="mt-5">
            <NotificationPreferences profile={current} onSaved={handleSaved} />
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-2 text-ink-muted">
            <Crown size={16} />
            <h2 className="font-display font-semibold text-ink">Abonament</h2>
          </div>
          <div className="mt-5">
            <SubscriptionCard plan={current.subscription} />
          </div>
        </Card>

        <Card className="border-risk-critical/20 p-8">
          <div className="flex items-center gap-2 text-risk-critical">
            <AlertTriangle size={16} />
            <h2 className="font-display font-semibold">Zonă periculoasă</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Ștergerea contului este permanentă și elimină toate evaluările și datele asociate.
          </p>
          <div className="mt-5">
            <DeleteAccountForm />
          </div>
        </Card>
      </Container>
    </div>
  );
}
