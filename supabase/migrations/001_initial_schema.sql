-- 001_initial_schema.sql
-- Core schema for the Gabriel & Vitória wedding invitation app.

create extension if not exists "pgcrypto";

create table households (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  display_name text not null,
  type text not null check (type in ('family', 'individual')),
  max_invited integer not null check (max_invited > 0),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table guests (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  full_name text not null,
  age_group text not null check (age_group in ('adult', 'child_10_plus', 'child_under_10')),
  is_invited boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table rsvp_submissions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  status text not null check (status in ('confirmed', 'declined', 'partial')),
  dietary_restrictions text,
  message text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locked boolean not null default true,
  edited_by_admin boolean not null default false
);

-- one submission per household: the public flow only ever inserts once and
-- then relies on `locked` — this unique index is the hard backstop.
create unique index rsvp_submissions_household_id_key on rsvp_submissions(household_id);

create table rsvp_guest_status (
  id uuid primary key default gen_random_uuid(),
  rsvp_id uuid not null references rsvp_submissions(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  will_attend boolean not null,
  created_at timestamptz not null default now()
);

create unique index rsvp_guest_status_rsvp_guest_key on rsvp_guest_status(rsvp_id, guest_id);

create table gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  suggested_amount_cents integer not null check (suggested_amount_cents > 0),
  allow_custom_amount boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table gift_contributions (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references gifts(id) on delete restrict,
  household_id uuid references households(id) on delete set null,
  giver_name text,
  message text,
  amount_cents integer not null check (amount_cents > 0),
  payment_method text,
  payment_provider text not null default 'mercadopago',
  provider_payment_id text,
  provider_preference_id text,
  provider_status text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'manual_review')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index gift_contributions_provider_payment_id_idx on gift_contributions(provider_payment_id);

create table private_messages (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete set null,
  author_name text,
  message text not null,
  created_at timestamptz not null default now()
);

create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- keep updated_at fresh on household/rsvp edits
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger households_set_updated_at
  before update on households
  for each row execute function set_updated_at();

create trigger rsvp_submissions_set_updated_at
  before update on rsvp_submissions
  for each row execute function set_updated_at();
