"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/services/profile.service";
import { profileSchema } from "@/lib/validation/profile";
import type { ProfileRow } from "@/types/database";

export function ProfileForm({ profile, onSaved }: { profile: ProfileRow; onSaved: (p: ProfileRow) => void }) {
  const { toast } = useToast();
  const [current, setCurrent] = useState(profile);
  const [name, setName] = useState(profile.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [address, setAddress] = useState(profile.address ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function handleProfileUpdate(updated: ProfileRow) {
    setCurrent(updated);
    onSaved(updated);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = profileSchema.safeParse({ name, phone, address });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        errors[String(issue.path[0])] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSaving(true);
    try {
      const supabase = createClient();
      const updated = await updateProfile(supabase, profile.id, {
        name: parsed.data.name.trim(),
        phone: parsed.data.phone?.trim() || null,
        address: parsed.data.address?.trim() || null,
      });
      handleProfileUpdate(updated);
      toast("Profil actualizat.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Nu am putut salva profilul.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-7">
      <AvatarUpload profile={current} onUploaded={handleProfileUpdate} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email" value={current.email} disabled readOnly hint="Emailul nu poate fi schimbat momentan." />
        <Input label="Nume" value={name} onChange={(e) => setName(e.target.value)} error={fieldErrors.name} required />
        <Input
          label="Telefon (opțional)"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={fieldErrors.phone}
          placeholder="+40 7xx xxx xxx"
        />
        <Input
          label="Adresă (opțional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={fieldErrors.address}
          placeholder="Strada, număr, oraș"
        />
        <Button type="submit" disabled={saving} icon={<Save size={16} />}>
          {saving ? "Se salvează..." : "Salvează modificările"}
        </Button>
      </form>

      <div>
        <h3 className="mb-3 text-sm font-medium text-ink-muted">Preferințe notificări</h3>
        <NotificationPreferences profile={current} onSaved={handleProfileUpdate} />
      </div>
    </div>
  );
}
