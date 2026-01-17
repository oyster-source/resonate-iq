
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  credits integer default 100,
  tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- LEADS
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  linkedin_url text not null,
  status text default 'new', -- new, enriching, enriched, error
  enrichment_data jsonb default '{}'::jsonb, -- The psychological dossier
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.leads enable row level security;

create policy "Users can view own leads" on public.leads
  for select using (auth.uid() = user_id);

create policy "Users can insert own leads" on public.leads
  for insert with check (auth.uid() = user_id);

create policy "Users can update own leads" on public.leads
  for update using (auth.uid() = user_id);

create policy "Users can delete own leads" on public.leads
  for delete using (auth.uid() = user_id);

-- CAMPAIGNS
create table public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  status text default 'draft', -- draft, active, paused, completed
  config jsonb default '{}'::jsonb, -- sending schedule, templates, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.campaigns enable row level security;

create policy "Users can view own campaigns" on public.campaigns
  for select using (auth.uid() = user_id);

create policy "Users can insert own campaigns" on public.campaigns
  for insert with check (auth.uid() = user_id);

create policy "Users can update own campaigns" on public.campaigns
  for update using (auth.uid() = user_id);

create policy "Users can delete own campaigns" on public.campaigns
  for delete using (auth.uid() = user_id);

-- EMAILS
create table public.emails (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  lead_id uuid references public.leads(id) not null,
  campaign_id uuid references public.campaigns(id),
  status text default 'draft', -- draft, scheduled, sent, failed
  subject text,
  body text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.emails enable row level security;

create policy "Users can view own emails" on public.emails
  for select using (auth.uid() = user_id);

create policy "Users can insert own emails" on public.emails
  for insert with check (auth.uid() = user_id);

create policy "Users can update own emails" on public.emails
  for update using (auth.uid() = user_id);

-- FUNCTIONS & TRIGGERS
-- Auto-create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
