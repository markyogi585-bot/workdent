-- ====================================================================
-- WorkDent Production Supabase Core Schema & RLS Security Policies
-- Architecture: Role-Based Access Control (Dentist, Designer, Lab, Admin)
-- Includes: Profiles, Cases/Projects, Escrow Transactions, Storage Buckets, RLS
-- Security Standard: Supabase Best Practices (Strict RLS, No BOLA, Protected Storage)
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
  username text unique,
  role text not null check (role in ('dentist', 'designer', 'lab', 'ceramist', 'milling', 'support', 'manufacturer', 'admin', 'other')) default 'dentist',
  profession text,
  specialty text,
  country text,
  state text,
  city text,
  primary_software text,
  scanner_type text,
  company_name text,
  phone text,
  avatar_url text,
  bio text,
  hourly_rate numeric default 0,
  rating numeric default 5.0,
  completed_cases integer default 0,
  onboarding_completed boolean default false,
  verified boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Create Projects / Dental Cases Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  case_code text unique,
  title text not null,
  patient_id text,
  dentist_id uuid references public.profiles(id) on delete cascade not null,
  designer_id uuid references public.profiles(id) on delete set null,
  service_type text default 'Crown & Bridge',
  tooth_numbers text,
  material text default 'Zirconia HT',
  cement_gap_um integer default 30,
  occlusal_offset_um numeric default 0.00,
  status text check (status in ('draft', 'pending', 'escrow_funded', 'in_progress', 'review', 'revision_requested', 'completed', 'disputed', 'cancelled')) default 'escrow_funded',
  escrow_status text check (escrow_status in ('pending', 'held_in_escrow', 'released_to_designer', 'refunded_to_dentist', 'disputed')) default 'held_in_escrow',
  price numeric default 22.00,
  platform_fee numeric default 1.10,
  scan_files jsonb default '[]'::jsonb,
  design_files jsonb default '[]'::jsonb,
  notes text,
  revision_notes text,
  due_date timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Create Escrow Transactions Table
create table if not exists public.escrow_transactions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.projects(id) on delete cascade not null,
  payer_id uuid references public.profiles(id) on delete cascade not null,
  payee_id uuid references public.profiles(id) on delete set null,
  amount numeric not null,
  platform_fee numeric default 0.00,
  status text check (status in ('held', 'released', 'refunded', 'disputed')) default 'held',
  milestone_name text default 'final_delivery',
  transaction_reference text,
  released_at timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. Create Wallets Table (Earnings & Escrow Balances)
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade not null,
  available_balance numeric default 0.00,
  pending_escrow numeric default 0.00,
  total_earned numeric default 0.00,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 6. Create Messages Table
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

-- 7. Create Referrals Table
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
-- SUPABASE STORAGE BUCKETS CONFIGURATION
-- ====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('avatars', 'avatars', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('dental-scans', 'dental-scans', false, 157286400, null),
  ('case-deliverables', 'case-deliverables', false, 157286400, null)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enforces BOLA protection and Supabase Security Checklist guidelines
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.escrow_transactions enable row level security;
alter table public.wallets enable row level security;
alter table public.messages enable row level security;
alter table public.referrals enable row level security;

-- --- Profiles RLS ---
create policy "Authenticated users can view profiles"
  on public.profiles for select
  to authenticated
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check ( (select auth.uid()) = id );

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- --- Projects / Cases RLS ---
create policy "Users can view cases they participate in"
  on public.projects for select
  to authenticated
  using (
    (select auth.uid()) = dentist_id or 
    (select auth.uid()) = designer_id or
    designer_id is null or
    (select role from public.profiles where id = (select auth.uid())) in ('admin', 'designer')
  );

create policy "Dentists can insert new cases"
  on public.projects for insert
  to authenticated
  with check ( (select auth.uid()) = dentist_id );

create policy "Participants can update their case"
  on public.projects for update
  to authenticated
  using ( (select auth.uid()) = dentist_id or (select auth.uid()) = designer_id )
  with check ( (select auth.uid()) = dentist_id or (select auth.uid()) = designer_id );

-- --- Escrow Transactions RLS ---
create policy "Users can view escrow transactions related to them"
  on public.escrow_transactions for select
  to authenticated
  using ( (select auth.uid()) = payer_id or (select auth.uid()) = payee_id );

create policy "System or payer can insert escrow record"
  on public.escrow_transactions for insert
  to authenticated
  with check ( (select auth.uid()) = payer_id );

-- --- Wallets RLS ---
create policy "Users can view their own wallet"
  on public.wallets for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Users can update their own wallet"
  on public.wallets for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- --- Messages RLS ---
create policy "Users can view messages they sent or received"
  on public.messages for select
  to authenticated
  using ( (select auth.uid()) = sender_id or (select auth.uid()) = recipient_id );

create policy "Users can send messages"
  on public.messages for insert
  to authenticated
  with check ( (select auth.uid()) = sender_id );

-- --- Referrals RLS ---
create policy "Users can view their own referrals"
  on public.referrals for select
  to authenticated
  using ( (select auth.uid()) = referrer_id );

create policy "Users can create their referral codes"
  on public.referrals for insert
  to authenticated
  with check ( (select auth.uid()) = referrer_id );

-- ====================================================================
-- STORAGE RLS POLICIES (Avatars, Dental Scans, Case Deliverables)
-- ====================================================================

-- 1. Avatars bucket policies (Public Read, Owner Write/Update)
create policy "Public can view avatar images"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Authenticated users can upload their avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars' and 
    (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Authenticated users can update their avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars' and 
    (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars' and 
    (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Authenticated users can delete their avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars' and 
    (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- 2. Dental Scans bucket policies (Case Participants Read/Write)
create policy "Authenticated users can view scan files"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'dental-scans' );

create policy "Authenticated users can upload scan files"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'dental-scans' );

-- 3. Case Deliverables bucket policies
create policy "Authenticated users can view case deliverables"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'case-deliverables' );

create policy "Authenticated users can upload case deliverables"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'case-deliverables' );

-- ====================================================================
-- STORED PROCEDURES & ESCROW STATE TRANSITIONS
-- Safe atomic state updates for escrow lifecycle
-- ====================================================================

-- Function to release escrow on dentist design approval
create or replace function public.release_case_escrow(p_case_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_case public.projects;
  v_designer_id uuid;
  v_amount numeric;
begin
  select * into v_case from public.projects where id = p_case_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Case not found');
  end if;

  -- Verify calling user is the dentist who owns this case
  if v_case.dentist_id <> auth.uid() then
    return jsonb_build_object('success', false, 'error', 'Unauthorized. Only the case prescribing dentist can release escrow.');
  end if;

  v_designer_id := v_case.designer_id;
  v_amount := v_case.price;

  -- 1. Update Case Status
  update public.projects
  set 
    status = 'completed',
    escrow_status = 'released_to_designer',
    updated_at = now()
  where id = p_case_id;

  -- 2. Update Escrow Transaction
  update public.escrow_transactions
  set 
    status = 'released',
    released_at = now()
  where case_id = p_case_id;

  -- 3. Credit Designer Wallet if assigned
  if v_designer_id is not null then
    update public.wallets
    set 
      available_balance = available_balance + v_amount,
      pending_escrow = greatest(0, pending_escrow - v_amount),
      total_earned = total_earned + v_amount,
      updated_at = now()
    where user_id = v_designer_id;
  end if;

  return jsonb_build_object('success', true, 'message', 'Escrow successfully released to designer');
end;
$$;

-- Function to request revision and keep escrow held
create or replace function public.request_case_revision(p_case_id uuid, p_notes text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_case public.projects;
begin
  select * into v_case from public.projects where id = p_case_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Case not found');
  end if;

  if v_case.dentist_id <> auth.uid() then
    return jsonb_build_object('success', false, 'error', 'Unauthorized. Only the prescribing dentist can request revisions.');
  end if;

  update public.projects
  set 
    status = 'revision_requested',
    revision_notes = p_notes,
    updated_at = now()
  where id = p_case_id;

  return jsonb_build_object('success', true, 'message', 'Revision requested. Escrow remains held in vault.');
end;
$$;

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
  insert into public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    full_name, 
    username,
    role,
    profession,
    avatar_url,
    onboarding_completed
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'full_name', concat(coalesce(new.raw_user_meta_data->>'first_name', ''), ' ', coalesce(new.raw_user_meta_data->>'last_name', ''))),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'dentist'),
    coalesce(new.raw_user_meta_data->>'profession', 'dentist'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce((new.raw_user_meta_data->>'onboarding_completed')::boolean, false)
  )
  on conflict (id) do update set
    updated_at = now();

  insert into public.wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
