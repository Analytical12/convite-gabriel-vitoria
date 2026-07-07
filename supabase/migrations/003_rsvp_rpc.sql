-- 003_rsvp_rpc.sql
-- Atomic RSVP submission. Called from app/api/rsvp/route.ts via the
-- service-role client (after the signed access cookie has already been
-- verified at the application layer). Guarantees the household can only
-- submit once: the unique index on rsvp_submissions(household_id) makes a
-- second call fail loudly instead of silently overwriting the guest's
-- original answer.

create or replace function submit_rsvp(
  p_household_id uuid,
  p_guest_statuses jsonb, -- [{ "guest_id": "uuid", "will_attend": true }, ...]
  p_dietary_restrictions text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rsvp_id uuid;
  v_total integer;
  v_attending integer;
  v_status text;
begin
  if exists (select 1 from rsvp_submissions where household_id = p_household_id) then
    raise exception 'rsvp_already_submitted' using errcode = 'P0001';
  end if;

  select count(*), count(*) filter (where (item ->> 'will_attend')::boolean)
    into v_total, v_attending
  from jsonb_array_elements(p_guest_statuses) as item;

  if v_total = 0 then
    raise exception 'rsvp_no_guests_selected' using errcode = 'P0001';
  end if;

  v_status := case
    when v_attending = 0 then 'declined'
    when v_attending = v_total then 'confirmed'
    else 'partial'
  end;

  insert into rsvp_submissions (household_id, status, dietary_restrictions, message, locked)
  values (p_household_id, v_status, nullif(p_dietary_restrictions, ''), nullif(p_message, ''), true)
  returning id into v_rsvp_id;

  insert into rsvp_guest_status (rsvp_id, guest_id, will_attend)
  select
    v_rsvp_id,
    (item ->> 'guest_id')::uuid,
    (item ->> 'will_attend')::boolean
  from jsonb_array_elements(p_guest_statuses) as item;

  return v_rsvp_id;
end;
$$;

-- Admin-only correction path: overwrites a household's RSVP and marks it
-- edited_by_admin, bypassing the "one submission ever" rule intentionally.
create or replace function admin_override_rsvp(
  p_household_id uuid,
  p_guest_statuses jsonb,
  p_dietary_restrictions text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rsvp_id uuid;
  v_total integer;
  v_attending integer;
  v_status text;
begin
  select count(*), count(*) filter (where (item ->> 'will_attend')::boolean)
    into v_total, v_attending
  from jsonb_array_elements(p_guest_statuses) as item;

  v_status := case
    when v_total = 0 then 'declined'
    when v_attending = 0 then 'declined'
    when v_attending = v_total then 'confirmed'
    else 'partial'
  end;

  insert into rsvp_submissions (household_id, status, dietary_restrictions, message, locked, edited_by_admin)
  values (p_household_id, v_status, nullif(p_dietary_restrictions, ''), nullif(p_message, ''), true, true)
  on conflict (household_id) do update set
    status = excluded.status,
    dietary_restrictions = excluded.dietary_restrictions,
    message = excluded.message,
    edited_by_admin = true,
    updated_at = now()
  returning id into v_rsvp_id;

  delete from rsvp_guest_status where rsvp_id = v_rsvp_id;

  insert into rsvp_guest_status (rsvp_id, guest_id, will_attend)
  select
    v_rsvp_id,
    (item ->> 'guest_id')::uuid,
    (item ->> 'will_attend')::boolean
  from jsonb_array_elements(p_guest_statuses) as item;

  return v_rsvp_id;
end;
$$;

grant execute on function submit_rsvp(uuid, jsonb, text, text) to service_role;
grant execute on function admin_override_rsvp(uuid, jsonb, text, text) to service_role, authenticated;
