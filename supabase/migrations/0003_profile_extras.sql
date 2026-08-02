-- HomeRisk AI — profile extras + avatar storage
-- Adds the fields needed by the Profil/Setări pages and a Supabase Storage
-- bucket for avatar uploads, with RLS scoping every write to its owner.

-- ============================================================================
-- PROFILE COLUMNS
-- ============================================================================
alter table public.profiles
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists notify_email boolean not null default true;

-- ============================================================================
-- AVATAR STORAGE BUCKET
-- ============================================================================
-- Public read (avatars are non-sensitive, shown in the header/sidebar),
-- writes restricted to the owner and to their own folder
-- (`avatars/<user_id>/...`), enforced by the policies below.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_owner_insert" on storage.objects;
create policy "avatars_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
