-- Add email column to leads if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'leads' and column_name = 'email') then
    alter table public.leads add column email text;
  end if;
end $$;

-- Add from_email to campaigns if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'campaigns' and column_name = 'from_email') then
    alter table public.campaigns add column from_email text;
  end if;
end $$;

-- Campaign Steps
create table if not exists public.campaign_steps (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) not null,
  type text not null, -- 'email', 'delay'
  order_index integer not null,
  delay_days integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Email Variants
create table if not exists public.email_variants (
  id uuid default uuid_generate_v4() primary key,
  campaign_step_id uuid references public.campaign_steps(id) not null,
  subject text,
  body text,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Campaign Leads (The queue)
create table if not exists public.campaign_leads (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) not null,
  lead_id uuid references public.leads(id) not null,
  status text default 'active', -- active, completed, paused
  current_step_id uuid references public.campaign_steps(id),
  next_step_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(campaign_id, lead_id)
);

-- Email Logs
create table if not exists public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id),
  lead_id uuid references public.leads(id),
  step_id uuid references public.campaign_steps(id),
  variant_id uuid references public.email_variants(id),
  message_id text,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Campaign Steps
alter table public.campaign_steps enable row level security;

create policy "Users can view steps for own campaigns" on public.campaign_steps
  for select using (
    exists ( select 1 from public.campaigns where campaigns.id = campaign_steps.campaign_id and campaigns.user_id = auth.uid() )
  );

create policy "Users can manage steps for own campaigns" on public.campaign_steps
  for all using (
    exists ( select 1 from public.campaigns where campaigns.id = campaign_steps.campaign_id and campaigns.user_id = auth.uid() )
  );

-- Email Variants
alter table public.email_variants enable row level security;

create policy "Users can view variants for own campaigns" on public.email_variants
  for select using (
    exists (
      select 1 from public.campaign_steps
      join public.campaigns on campaigns.id = campaign_steps.campaign_id
      where campaign_steps.id = email_variants.campaign_step_id
      and campaigns.user_id = auth.uid()
    )
  );

create policy "Users can manage variants for own campaigns" on public.email_variants
  for all using (
    exists (
      select 1 from public.campaign_steps
      join public.campaigns on campaigns.id = campaign_steps.campaign_id
      where campaign_steps.id = email_variants.campaign_step_id
      and campaigns.user_id = auth.uid()
    )
  );

-- Campaign Leads
alter table public.campaign_leads enable row level security;

create policy "Users can view campaign leads for own campaigns" on public.campaign_leads
  for select using (
    exists ( select 1 from public.campaigns where campaigns.id = campaign_leads.campaign_id and campaigns.user_id = auth.uid() )
  );

create policy "Users can manage campaign leads for own campaigns" on public.campaign_leads
  for all using (
    exists ( select 1 from public.campaigns where campaigns.id = campaign_leads.campaign_id and campaigns.user_id = auth.uid() )
  );

-- Email Logs
alter table public.email_logs enable row level security;

create policy "Users can view email logs for own campaigns" on public.email_logs
  for select using (
    exists ( select 1 from public.campaigns where campaigns.id = email_logs.campaign_id and campaigns.user_id = auth.uid() )
  );

create policy "Users can insert email logs for own campaigns" on public.email_logs
  for insert with check (
    exists ( select 1 from public.campaigns where campaigns.id = email_logs.campaign_id and campaigns.user_id = auth.uid() )
  );
