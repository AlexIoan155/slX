-- HomeRisk AI — RPC helpers
-- These SECURITY DEFINER functions let authenticated users trigger a
-- narrowly-scoped insert (their own activity log entry) without granting
-- them a blanket INSERT policy on the underlying table.

create or replace function public.log_activity(p_action text, p_metadata jsonb default null)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.activity_logs (user_id, action, metadata)
  values (auth.uid(), p_action, p_metadata);
end;
$$;

revoke all on function public.log_activity(text, jsonb) from public;
grant execute on function public.log_activity(text, jsonb) to authenticated;

-- Marks one notification as read, but only if it belongs to the caller.
create or replace function public.mark_notification_read(p_notification_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.notifications
  set read_at = now()
  where id = p_notification_id and user_id = auth.uid();
end;
$$;

revoke all on function public.mark_notification_read(uuid) from public;
grant execute on function public.mark_notification_read(uuid) to authenticated;
