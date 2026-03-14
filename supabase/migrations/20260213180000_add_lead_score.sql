
-- Add score columns to leads if they don't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'leads' and column_name = 'score') then
    alter table public.leads add column score integer;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'leads' and column_name = 'score_reason') then
    alter table public.leads add column score_reason text;
  end if;
end $$;
