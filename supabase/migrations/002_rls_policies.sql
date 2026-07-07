-- 002_rls_policies.sql
-- Locks every table down by default. The public site never talks to
-- Supabase with the anon/authenticated key for guest data — all public
-- reads/writes go through Next.js route handlers using the service role
-- client after validating the signed access cookie (lib/auth/access-cookie.ts).
-- RLS here exists as the DB-level backstop for the admin panel (Supabase
-- Auth session) and to guarantee anon/authenticated have zero direct access.

-- Mirrors ADMIN_EMAIL_ALLOWLIST so RLS policies can check admin identity
-- without reaching into app env vars. Keep this table in sync with the env
-- var — see docs/SUPABASE_SETUP.md for how to add/remove an admin.
create table admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;
-- no policies for anon/authenticated: only service_role (which bypasses RLS)
-- can read/write this table directly.

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table households enable row level security;
alter table guests enable row level security;
alter table rsvp_submissions enable row level security;
alter table rsvp_guest_status enable row level security;
alter table gifts enable row level security;
alter table gift_contributions enable row level security;
alter table private_messages enable row level security;
alter table admin_audit_log enable row level security;

-- households
create policy "admin_select_households" on households for select to authenticated using (is_admin());
create policy "admin_write_households" on households for insert to authenticated with check (is_admin());
create policy "admin_update_households" on households for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin_delete_households" on households for delete to authenticated using (is_admin());

-- guests
create policy "admin_select_guests" on guests for select to authenticated using (is_admin());
create policy "admin_write_guests" on guests for insert to authenticated with check (is_admin());
create policy "admin_update_guests" on guests for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin_delete_guests" on guests for delete to authenticated using (is_admin());

-- rsvp_submissions — admin can review and correct, per brief ("admin pode editar manualmente")
create policy "admin_select_rsvp_submissions" on rsvp_submissions for select to authenticated using (is_admin());
create policy "admin_update_rsvp_submissions" on rsvp_submissions for update to authenticated using (is_admin()) with check (is_admin());

-- rsvp_guest_status
create policy "admin_select_rsvp_guest_status" on rsvp_guest_status for select to authenticated using (is_admin());
create policy "admin_update_rsvp_guest_status" on rsvp_guest_status for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin_write_rsvp_guest_status" on rsvp_guest_status for insert to authenticated with check (is_admin());

-- gifts (catalog, admin-managed)
create policy "admin_select_gifts" on gifts for select to authenticated using (is_admin());
create policy "admin_write_gifts" on gifts for insert to authenticated with check (is_admin());
create policy "admin_update_gifts" on gifts for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin_delete_gifts" on gifts for delete to authenticated using (is_admin());

-- gift_contributions — admin can review/reconcile, no delete (financial ledger)
create policy "admin_select_gift_contributions" on gift_contributions for select to authenticated using (is_admin());
create policy "admin_update_gift_contributions" on gift_contributions for update to authenticated using (is_admin()) with check (is_admin());

-- private_messages — admin-only visibility, never exposed publicly
create policy "admin_select_private_messages" on private_messages for select to authenticated using (is_admin());

-- admin_audit_log — admin can read, nobody edits/deletes (immutable log, written by service_role)
create policy "admin_select_admin_audit_log" on admin_audit_log for select to authenticated using (is_admin());
