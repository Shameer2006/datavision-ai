-- ============================================================
-- Step 1: Plans table
-- ============================================================
create table if not exists public.plans (
  id                     text primary key,
  name                   text not null,
  credits                int  not null default 100,
  price_usd              int  not null default 0,
  rate_limit_per_minute  int  not null default 10,
  rate_limit_per_day     int  not null default 100,
  max_api_keys           int  not null default 1
);

insert into public.plans (id, name, credits, price_usd, rate_limit_per_minute, rate_limit_per_day, max_api_keys)
values
  ('free',       'Free',       100,  0,  10,  100,  1),
  ('pro',        'Pro',        10000, 9,  60,  1000, 5),
  ('enterprise', 'Enterprise', 99999, 29, 300, 9999, 20)
on conflict (id) do nothing;

-- ============================================================
-- Step 2: User plans table
-- ============================================================
create table if not exists public.user_plans (
  user_id    uuid references public.profiles on delete cascade primary key,
  plan_id    text references public.plans default 'free',
  started_at timestamptz default now(),
  resets_at  timestamptz default (now() + interval '30 days')
);

-- ============================================================
-- Step 3: Alter api_keys — add new columns
-- ============================================================
alter table public.api_keys
  add column if not exists name            text default 'Default',
  add column if not exists total_requests  int  default 0,
  add column if not exists revoked_at      timestamptz,
  add column if not exists expires_at      timestamptz,
  add column if not exists rate_limit_per_minute int default null,
  add column if not exists rate_limit_per_day    int default null;

-- ============================================================
-- Step 4: Alter credits — add reset_at column
-- ============================================================
alter table public.credits
  add column if not exists resets_at timestamptz default (now() + interval '30 days');

-- ============================================================
-- Step 5: Alter usage_logs — add action_type and credits_used
-- ============================================================
alter table public.usage_logs
  add column if not exists action_type  text default 'chat_message',
  add column if not exists credits_used int  default 1;

-- ============================================================
-- Step 6: Update handle_new_user trigger to also insert user_plan
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.credits (user_id, balance, total_used, resets_at)
  values (new.id, 100, 0, now() + interval '30 days')
  on conflict (user_id) do nothing;

  insert into public.user_plans (user_id, plan_id, started_at, resets_at)
  values (new.id, 'free', now(), now() + interval '30 days')
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- ============================================================
-- Step 7: RLS policies for new tables
-- ============================================================
alter table public.plans      enable row level security;
alter table public.user_plans enable row level security;

create policy "Plans are public read" on public.plans
  for select using (true);

create policy "Users can view own plan" on public.user_plans
  for select using (auth.uid() = user_id);

-- ============================================================
-- Step 8: Rate limit check function
-- ============================================================
create or replace function public.check_rate_limit(
  p_user_id    uuid,
  p_window     text,   -- 'minute' or 'day'
  p_limit      int
) returns boolean as $$
declare
  v_count int;
  v_since timestamptz;
begin
  v_since := case p_window
    when 'minute' then now() - interval '1 minute'
    when 'day'    then now() - interval '1 day'
    else now() - interval '1 minute'
  end;

  select count(*) into v_count
  from public.usage_logs
  where user_id = p_user_id
    and created_at > v_since;

  return v_count < p_limit;
end;
$$ language plpgsql security definer;

-- ============================================================
-- Step 9: Deduct credits function (atomic)
-- ============================================================
create or replace function public.deduct_credits(
  p_user_id     uuid,
  p_amount      int,
  p_action_type text,
  p_api_key_id  uuid default null
) returns jsonb as $$
declare
  v_balance int;
  v_plan    record;
  v_limit_ok_min boolean;
  v_limit_ok_day boolean;
begin
  -- Get plan limits
  select p.rate_limit_per_minute, p.rate_limit_per_day
  into v_plan
  from public.user_plans up
  join public.plans p on p.id = up.plan_id
  where up.user_id = p_user_id;

  -- Check rate limits
  v_limit_ok_min := public.check_rate_limit(p_user_id, 'minute', coalesce(v_plan.rate_limit_per_minute, 10));
  v_limit_ok_day := public.check_rate_limit(p_user_id, 'day',    coalesce(v_plan.rate_limit_per_day,    100));

  if not v_limit_ok_min then
    return jsonb_build_object('ok', false, 'error', 'rate_limit_minute');
  end if;

  if not v_limit_ok_day then
    return jsonb_build_object('ok', false, 'error', 'rate_limit_day');
  end if;

  -- Check and deduct balance atomically
  update public.credits
  set
    balance    = balance - p_amount,
    total_used = total_used + p_amount,
    updated_at = now()
  where user_id = p_user_id
    and balance >= p_amount
  returning balance into v_balance;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'insufficient_credits');
  end if;

  -- Log usage
  insert into public.usage_logs (user_id, api_key_id, action_type, credits_used, endpoint)
  values (p_user_id, p_api_key_id, p_action_type, p_amount, p_action_type);

  -- Update api_key last_used and request count
  if p_api_key_id is not null then
    update public.api_keys
    set last_used_at    = now(),
        total_requests  = total_requests + 1
    where id = p_api_key_id;
  end if;

  return jsonb_build_object('ok', true, 'balance', v_balance);
end;
$$ language plpgsql security definer;
