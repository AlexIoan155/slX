-- HomeRisk AI — RLS fix
-- `completeAssessment` (services/assessment.service.ts) upserts into
-- risk_results with `onConflict: "assessment_id"`. Postgres treats
-- `INSERT ... ON CONFLICT DO UPDATE` as needing both INSERT and UPDATE
-- privileges depending on which path is taken — 0001 only granted INSERT,
-- so a retried/duplicate submission (double-click, network retry) would be
-- silently rejected by RLS on the UPDATE path. This adds the missing policy.

drop policy if exists "risk_results_update_own" on public.risk_results;
create policy "risk_results_update_own" on public.risk_results
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
