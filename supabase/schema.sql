create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gate_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  branch text not null,
  target_year text not null,
  attempt_number integer not null default 1,
  college_type text not null,
  months_of_prep numeric not null default 0,
  hours_per_day numeric not null default 0,
  syllabus_coverage numeric not null default 0,
  test_series text,
  first_mock_score numeric,
  no_mock_yet boolean not null default false,
  predicted_rank_low integer,
  predicted_rank_high integer,
  onboarding_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gate_profiles_attempt_number_check check (attempt_number between 1 and 4),
  constraint gate_profiles_months_check check (months_of_prep between 0 and 36),
  constraint gate_profiles_hours_check check (hours_per_day between 0 and 18),
  constraint gate_profiles_syllabus_check check (syllabus_coverage between 0 and 100),
  constraint gate_profiles_mock_check check (first_mock_score is null or first_mock_score between 0 and 100),
  constraint gate_profiles_rank_check check (
    predicted_rank_low is null
    or predicted_rank_high is null
    or predicted_rank_low <= predicted_rank_high
  )
);

alter table public.profiles enable row level security;
alter table public.gate_profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "gate_profiles_select_own" on public.gate_profiles;
drop policy if exists "gate_profiles_insert_own" on public.gate_profiles;
drop policy if exists "gate_profiles_update_own" on public.gate_profiles;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = user_id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "gate_profiles_select_own"
on public.gate_profiles for select
using (auth.uid() = user_id);

create policy "gate_profiles_insert_own"
on public.gate_profiles for insert
with check (auth.uid() = user_id);

create policy "gate_profiles_update_own"
on public.gate_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
