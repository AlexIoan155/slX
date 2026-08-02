"use client";

import { CalendarDays, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useUserContext } from "@/components/providers/UserProvider";
import { formatDate } from "@/utils/format";

export default function ProfilePage() {
  const { userId, profile, refreshProfile } = useUserContext();

  if (userId && !profile) {
    return <DashboardSkeleton />;
  }

  if (!userId || !profile) return null;

  return (
    <div className="pb-24 pt-8">
      <Container className="max-w-3xl">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Profilul tău</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Gestionează datele contului și abonamentul.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_260px]">
          <Card className="p-8">
            <ProfileForm profile={profile} onSaved={() => refreshProfile()} />
          </Card>

          <div className="space-y-6">
            <SubscriptionCard plan={profile.subscription} />
            <Card className="p-6 text-sm">
              <div className="flex items-center gap-2 text-ink-muted">
                <Mail size={15} />
                <span>{profile.email}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-ink-muted">
                <CalendarDays size={15} />
                <span>Membru din {formatDate(profile.created_at)}</span>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
