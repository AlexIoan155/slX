"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/services/profile.service";
import type { ProfileRow } from "@/types/database";

export function NotificationPreferences({
  profile,
  onSaved,
}: {
  profile: ProfileRow;
  onSaved: (p: ProfileRow) => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    setSaving(true);
    try {
      const supabase = createClient();
      const updated = await updateProfile(supabase, profile.id, { notify_email: !profile.notify_email });
      onSaved(updated);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Nu am putut salva preferința.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-surface-elevated px-4 py-3.5">
      <div className="flex items-start gap-3">
        <Mail size={17} className="mt-0.5 shrink-0 text-ink-muted" />
        <div>
          <p className="text-sm font-medium">Alerte pe email</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            Primești un email când o evaluare detectează un risc ridicat sau critic.
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={profile.notify_email}
        onClick={handleToggle}
        disabled={saving}
        className={`focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          profile.notify_email ? "bg-alert-to" : "bg-surface-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            profile.notify_email ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
