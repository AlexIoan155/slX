import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProfileRow } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getProfile(supabase: Client, userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: Client,
  userId: string,
  patch: Partial<Pick<ProfileRow, "name" | "avatar_url" | "phone" | "address" | "notify_email">>
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/**
 * Uploads a new avatar image to the `avatars` Storage bucket (public read,
 * writes scoped to the owner's own folder via RLS — see
 * supabase/migrations/0003_profile_extras.sql), then updates the profile
 * row to point at the new public URL. Returns the updated profile so the
 * caller doesn't need a second round trip.
 */
export async function uploadAvatar(supabase: Client, userId: string, file: File): Promise<ProfileRow> {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    throw new Error("Format neacceptat. Folosește PNG, JPEG, WEBP sau GIF.");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("Imaginea depășește limita de 5MB.");
  }

  const extension = file.name.split(".").pop() ?? "png";
  const path = `${userId}/avatar-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  return updateProfile(supabase, userId, { avatar_url: publicUrl });
}

/**
 * Called right after an assessment completes, to keep the lightweight
 * summary on `profiles` (used by the dashboard greeting/header) in sync
 * with the authoritative `risk_results` row.
 */
export async function syncProfileAfterAssessment(
  supabase: Client,
  userId: string,
  homeRiskScore: number
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ risk_score: homeRiskScore, last_scan: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}
