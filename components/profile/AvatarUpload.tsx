"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar } from "@/services/profile.service";
import type { ProfileRow } from "@/types/database";

export function AvatarUpload({ profile, onUploaded }: { profile: ProfileRow; onUploaded: (p: ProfileRow) => void }) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const updated = await uploadAvatar(supabase, profile.id, file);
      onUploaded(updated);
      toast("Poza de profil a fost actualizată.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Încărcarea a eșuat.", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar name={profile.name} email={profile.email} avatarUrl={profile.avatar_url} size="lg" />
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 size={18} className="animate-spin text-white" />
          </span>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-3.5 py-2 text-sm text-ink transition-colors hover:border-ink-faint/60 disabled:opacity-50"
        >
          <Camera size={15} />
          {uploading ? "Se încarcă..." : "Schimbă poza"}
        </button>
        <p className="mt-1.5 text-xs text-ink-faint">PNG, JPEG, WEBP sau GIF, max 5MB.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
