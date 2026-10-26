-- ====================================================================
-- WorkDent Production Supabase Core Schema & RLS Security Policies
-- Architecture: Role-Based Access Control (Dentist, Designer, Lab, Admin)
-- Includes: Profiles, Projects/Cases, Messages, Wallets, Referrals
-- ====================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- 2. Create Profiles Table (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  full_name text,
  role text not null check (role in ('dentist', 'designer', 'lab', 'admin')) default 'dentist',
  company_name text,
  phone text,
  avatar_url text,
  bio text,
  hourly_rate numeric default 0,
  rating numeric default 5.0,
  completed_cases integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Create Projects / Cases Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  patient_id text,
  dentist_id uuid references public.profiles(id) on delete cascade not null,
  designer_id uuid references public.profiles(id) on delete set null,
  service_type text default 'Crown & Bridge',
  status text check (status in ('draft', 'pending', 'in_progress', 'review', 'completed', 'disputed')) default 'pending',
  price numeric default 0.00,
  escrow_paid boolean default false,
  scan_files jsonb default '[]'::jsonb,
  design_files jsonb default '[]'::jsonb,
  notes text,
  due_date timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Create Messages Table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  attachments jsonb default '[]'::jsonb,
  read boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. Create Wallets & Earnings Table
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade not null,
  available_balance numeric default 0.00,
  pending_escrow numeric default 0.00,
  total_earned numeric default 0.00,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 6. Create Referrals Table
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  code text unique not null,
  referred_email text,
  status text check (status in ('pending', 'completed')) default 'pending',
  earned_credits numeric default 0.00,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict adhere to Supabase security principles
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.messages enable row level security;
alter table public.wallets enable row level security;
alter table public.referrals enable row level security;

-- Profiles Policies
create policy "Authenticated users can view profiles"
  on public.profiles for select
  to authenticated
  using ( true );

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check ( (select auth.uid()) = id );

-- Projects Policies
create policy "Users can view cases they own or are assigned to"
  on public.projects for select
  to authenticated
  using (
    (select auth.uid()) = dentist_id or 
    (select auth.uid()) = designer_id or
    (select role from public.profiles where id = (select auth.uid())) in ('admin', 'designer')
  );

create policy "Dentists can insert new projects"
  on public.projects for insert
  to authenticated
  with check ( (select auth.uid()) = dentist_id );

create policy "Participants can update their project"
  on public.projects for update
  to authenticated
  using ( (select auth.uid()) = dentist_id or (select auth.uid()) = designer_id )
  with check ( (select auth.uid()) = dentist_id or (select auth.uid()) = designer_id );

-- Messages Policies
create policy "Users can view messages they sent or received"
  on public.messages for select
  to authenticated
  using ( (select auth.uid()) = sender_id or (select auth.uid()) = recipient_id );

create policy "Users can send messages"
  on public.messages for insert
  to authenticated
  with check ( (select auth.uid()) = sender_id );

-- Wallets Policies
create policy "Users can view their own wallet"
  on public.wallets for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Users can update their own wallet"
  on public.wallets for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- Referrals Policies
create policy "Users can view their own referrals"
  on public.referrals for select
  to authenticated
  using ( (select auth.uid()) = referrer_id );

create policy "Users can create their referral codes"
  on public.referrals for insert
  to authenticated
  with check ( (select auth.uid()) = referrer_id );

-- ====================================================================
-- TRIGGERS: Auto-create Profile & Wallet on Auth User Signup
-- ====================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'full_name', concat(coalesce(new.raw_user_meta_data->>'first_name', ''), ' ', coalesce(new.raw_user_meta_data->>'last_name', ''))),
    coalesce(new.raw_user_meta_data->>'role', 'dentist')
  )
  on conflict (id) do nothing;

  insert into public.wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
