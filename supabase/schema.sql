-- ============================================================
-- AURA PSC Agent — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Subscribers (one row per beauty business client)
create table if not exists subscribers (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references auth.users(id) on delete cascade,
  business_name         text not null,
  owner_name            text,
  specialty             text,
  email                 text not null,
  phone                 text,
  location              text,
  plan                  text not null default 'trial',  -- trial | solo | studio | multi
  status                text not null default 'trial',  -- trial | active | paused | cancelled
  trial_ends_at         timestamptz default (now() + interval '14 days'),
  stripe_customer_id    text,
  stripe_subscription_id text,
  agent_name            text default 'AURA',
  booking_url           text,
  greeting_script       text,
  vapi_agent_id         text,
  calls_this_month      int default 0,
  bookings_this_month   int default 0,
  reminders_this_month  int default 0,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- FAQ answers per subscriber
create table if not exists subscriber_faqs (
  id          uuid primary key default uuid_generate_v4(),
  subscriber_id uuid references subscribers(id) on delete cascade,
  question    text not null,
  answer      text not null,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Call logs per subscriber
create table if not exists call_logs (
  id             uuid primary key default uuid_generate_v4(),
  subscriber_id  uuid references subscribers(id) on delete cascade,
  call_type      text,       -- inbound | outbound
  caller_number  text,
  caller_name    text,
  duration_secs  int,
  outcome        text,       -- booked | faq | rescheduled | confirmed | no_answer | escalated
  summary        text,
  vapi_call_id   text,
  created_at     timestamptz default now()
);

-- Outbound reminders per subscriber
create table if not exists reminders (
  id            uuid primary key default uuid_generate_v4(),
  subscriber_id uuid references subscribers(id) on delete cascade,
  client_name   text,
  client_phone  text,
  appt_at       timestamptz,
  service       text,
  status        text default 'scheduled', -- scheduled | sent | confirmed | no_answer | retry
  sent_at       timestamptz,
  created_at    timestamptz default now()
);

-- Sales outreach queue per subscriber
create table if not exists sales_queue (
  id            uuid primary key default uuid_generate_v4(),
  subscriber_id uuid references subscribers(id) on delete cascade,
  client_name   text,
  segment       text,   -- hot_lead | gone_quiet | lapsed | promo
  context       text,
  service       text,
  source        text,
  priority      text default 'medium',
  status        text default 'pending', -- pending | drafted | sent | skipped
  drafted_msg   text,
  created_at    timestamptz default now()
);

-- ── Row Level Security ─────────────────────────────────────

alter table subscribers      enable row level security;
alter table subscriber_faqs  enable row level security;
alter table call_logs        enable row level security;
alter table reminders        enable row level security;
alter table sales_queue      enable row level security;

-- Subscribers can only read/write their own data
create policy "Subscriber: own data only" on subscribers
  for all using (auth.uid() = user_id);

create policy "Subscriber: own faqs" on subscriber_faqs
  for all using (
    subscriber_id in (select id from subscribers where user_id = auth.uid())
  );

create policy "Subscriber: own calls" on call_logs
  for all using (
    subscriber_id in (select id from subscribers where user_id = auth.uid())
  );

create policy "Subscriber: own reminders" on reminders
  for all using (
    subscriber_id in (select id from subscribers where user_id = auth.uid())
  );

create policy "Subscriber: own sales queue" on sales_queue
  for all using (
    subscriber_id in (select id from subscribers where user_id = auth.uid())
  );

-- Admin bypass: set VITE_ADMIN_EMAIL in env — handled in application layer
-- For full admin RLS, create a custom claim or use service_role key server-side

-- ── Helper: auto-update updated_at ────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger subscribers_updated_at
  before update on subscribers
  for each row execute function update_updated_at();
