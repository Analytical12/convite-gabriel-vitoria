import { NextResponse } from "next/server";
import { getAuthorizedAdminUser } from "@/lib/auth/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { adminOverrideRsvpSchema } from "@/lib/validators/rsvp";

/**
 * Admin-only manual correction of a household's RSVP. Calls the existing
 * `admin_override_rsvp` Postgres function (supabase/migrations/003_rsvp_rpc.sql)
 * — this route only authenticates, validates, and forwards; it does not
 * duplicate the RPC's insert/upsert logic.
 */
export async function POST(request: Request) {
  const user = await getAuthorizedAdminUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminOverrideRsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  // guard against a guestId that doesn't belong to this household — the
  // form only ever sends the household's own guests, but the API can't
  // assume the client is honest
  const { data: householdGuests } = await supabase
    .from("guests")
    .select("id")
    .eq("household_id", parsed.data.householdId);

  const validGuestIds = new Set((householdGuests ?? []).map((guest) => guest.id));
  const allGuestsBelongToHousehold = parsed.data.guestStatuses.every((guest) =>
    validGuestIds.has(guest.guestId)
  );

  if (!allGuestsBelongToHousehold) {
    return NextResponse.json({ error: "invalid_guests" }, { status: 400 });
  }

  const { data: rsvpId, error } = await supabase.rpc("admin_override_rsvp", {
    p_household_id: parsed.data.householdId,
    p_guest_statuses: parsed.data.guestStatuses.map((guest) => ({
      guest_id: guest.guestId,
      will_attend: guest.willAttend,
    })),
    p_dietary_restrictions: parsed.data.dietaryRestrictions,
    p_message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  await supabase.from("admin_audit_log").insert({
    admin_user_id: user.id,
    action: "rsvp_override",
    entity_type: "rsvp_submissions",
    entity_id: rsvpId,
    metadata: {
      household_id: parsed.data.householdId,
      status: parsed.data.status,
      admin_email: user.email,
    },
  });

  return NextResponse.json({ ok: true, rsvpId });
}
