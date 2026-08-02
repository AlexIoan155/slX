-- HomeRisk AI — initial schema
-- Run via `supabase db push` or paste into the Supabase SQL editor.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- One row per authenticated user, created automatically on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  subscription text not null default 'free' check (subscription in ('free', 'premium')),
  risk_score integer check (risk_score is null or (risk_score >= 0 and risk_score <= 100)),
  last_scan timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per evaluation a user starts (may be in progress or completed).
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  answers_count integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Individual question answers for a given assessment.
create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  question_id text not null,
  value text not null,
  created_at timestamptz not null default now(),
  unique (assessment_id, question_id)
);

-- The computed HomeRisk output for a completed assessment.
create table if not exists public.risk_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  home_risk_score integer not null check (home_risk_score >= 0 and home_risk_score <= 100),
  risk_level text not null,
  probabilities jsonb not null,
  domain_scores jsonb not null,
  estimated_annual_cost_ron integer not null default 0,
  intervention_priority text not null,
  detected_risks jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (assessment_id)
);

-- Subscription state, mirrored from Stripe (kept in sync via webhook).
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  status text not null default 'active' check (status in ('active', 'trialing', 'canceled', 'past_due', 'incomplete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- Payment history, mirrored from Stripe.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  stripe_payment_intent_id text,
  amount_ron integer not null,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

-- In-app + email notification queue.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('risk_alert', 'reminder', 'system', 'billing')),
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Lightweight audit trail for security review and support.
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists assessments_user_id_idx on public.assessments (user_id);
create index if not exists assessment_answers_assessment_id_idx on public.assessment_answers (assessment_id);
create index if not exists risk_results_user_id_idx on public.risk_results (user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists notifications_user_id_idx on public.notifications (user_id, read_at);
create index if not exists activity_logs_user_id_idx on public.activity_logs (user_id, created_at desc);

-- ============================================================================
-- updated_at TRIGGERS
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ============================================================================
-- AUTO-CREATE PROFILE + FREE SUBSCRIPTION ON SIGNUP
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.risk_results enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;

-- profiles: a user can read and update only their own row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- assessments: full CRUD, scoped to the owning user.
drop policy if exists "assessments_select_own" on public.assessments;
create policy "assessments_select_own" on public.assessments
  for select using (auth.uid() = user_id);

drop policy if exists "assessments_insert_own" on public.assessments;
create policy "assessments_insert_own" on public.assessments
  for insert with check (auth.uid() = user_id);

drop policy if exists "assessments_update_own" on public.assessments;
create policy "assessments_update_own" on public.assessments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "assessments_delete_own" on public.assessments;
create policy "assessments_delete_own" on public.assessments
  for delete using (auth.uid() = user_id);

-- assessment_answers: scoped via the parent assessment's owner.
drop policy if exists "assessment_answers_select_own" on public.assessment_answers;
create policy "assessment_answers_select_own" on public.assessment_answers
  for select using (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_answers.assessment_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "assessment_answers_insert_own" on public.assessment_answers;
create policy "assessment_answers_insert_own" on public.assessment_answers
  for insert with check (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_answers.assessment_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "assessment_answers_update_own" on public.assessment_answers;
create policy "assessment_answers_update_own" on public.assessment_answers
  for update using (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_answers.assessment_id and a.user_id = auth.uid()
    )
  );

-- risk_results: read-only from the client; written by the server (service role).
drop policy if exists "risk_results_select_own" on public.risk_results;
create policy "risk_results_select_own" on public.risk_results
  for select using (auth.uid() = user_id);

-- Written server-side via a Server Action using the requesting user's own
-- session (not the admin client), so an explicit insert policy is needed —
-- scoped to both the result's user_id and the parent assessment's owner.
drop policy if exists "risk_results_insert_own" on public.risk_results;
create policy "risk_results_insert_own" on public.risk_results
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.assessments a
      where a.id = risk_results.assessment_id and a.user_id = auth.uid()
    )
  );

-- subscriptions: read-only from the client; written by the Stripe webhook (service role).
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- payments: read-only from the client; written by the Stripe webhook (service role).
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own" on public.payments
  for select using (auth.uid() = user_id);

-- notifications: users can read their own and mark them as read.
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- activity_logs: read-only from the client; written by services (service role or definer function).
drop policy if exists "activity_logs_select_own" on public.activity_logs;
create policy "activity_logs_select_own" on public.activity_logs
  for select using (auth.uid() = user_id);
