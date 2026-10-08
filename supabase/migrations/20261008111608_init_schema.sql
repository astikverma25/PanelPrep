-- ==============================================================================
-- GD Arena / PanelPrep Database Schema Migration
-- ==============================================================================

-- 1. Create Profiles Table (syncs with Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create Sessions Table (GD arena discussions)
create table if not exists public.sessions (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  topic text not null,
  panel_size integer not null default 4,
  duration_seconds integer not null default 300,
  patience_ms integer default 1200,
  is_text_fallback boolean default false,
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

-- 3. Create Reports Table (Session scores, rubrics, and feedback)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  topic text not null,
  duration_seconds integer not null default 0,
  stats jsonb not null default '{}'::jsonb,
  dimensions jsonb not null default '[]'::jsonb,
  missed_openings jsonb default '[]'::jsonb,
  top_3_actions text[] default '{}',
  transcript jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 4. Create Utterance Segments Table (Turn-by-turn replay & analytics)
create table if not exists public.utterance_segments (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.sessions(id) on delete cascade,
  speaker_id text not null,
  speaker_name text not null,
  is_user boolean not null default false,
  start_ms integer not null,
  end_ms integer not null,
  text text not null,
  interrupted boolean not null default false,
  words_spoken integer,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- Indexes for Fast Querying
-- ==============================================================================
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_created_at on public.sessions(created_at desc);

create index if not exists idx_reports_session_id on public.reports(session_id);
create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_reports_created_at on public.reports(created_at desc);

create index if not exists idx_segments_session_id on public.utterance_segments(session_id);

-- ==============================================================================
-- Auto-create profile on User Signup (Auth Trigger)
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.reports enable row level security;
alter table public.utterance_segments enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Sessions Policies
create policy "Users can view their own sessions or public sessions"
  on public.sessions for select
  using (auth.uid() = user_id or user_id is null);

create policy "Anyone can insert a session"
  on public.sessions for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update their own sessions"
  on public.sessions for update
  using (auth.uid() = user_id or user_id is null);

-- Reports Policies
create policy "Users can view their own reports"
  on public.reports for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert reports"
  on public.reports for insert
  with check (auth.uid() = user_id or user_id is null);

-- Utterance Segments Policies
create policy "Anyone can view session segments"
  on public.utterance_segments for select
  using (true);

create policy "Anyone can insert session segments"
  on public.utterance_segments for insert
  with check (true);
