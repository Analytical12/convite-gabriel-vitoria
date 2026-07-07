import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessCookie } from "@/lib/auth/access-cookie";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ACCESS_COOKIE_NAME } from "@/lib/constants";
import { submitRsvpSchema } from "@/lib/validators/rsvp";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const payload = await verifyAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!payload) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitRsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // guard against a guest_id that doesn't belong to this household — the
  // form only ever sends the household's own guests, but the API can't
  // assume the client is honest.
  const { data: householdGuests } = await supabase
    .from("guests")
    .select("id")
    .eq("household_id", payload.householdId);

  const validGuestIds = new Set((householdGuests ?? []).map((guest) => guest.id));
  const allGuestsBelongToHousehold = parsed.data.guests.every((guest) => validGuestIds.has(guest.guestId));

  if (!allGuestsBelongToHousehold) {
    return NextResponse.json({ error: "invalid_guests" }, { status: 400 });
  }

  const { error } = await supabase.rpc("submit_rsvp", {
    p_household_id: payload.householdId,
    p_guest_statuses: parsed.data.guests.map((guest) => ({
      guest_id: guest.guestId,
      will_attend: guest.willAttend,
    })),
    p_dietary_restrictions: parsed.data.dietaryRestrictions,
    p_message: parsed.data.message,
  });

  if (error) {
    if (error.message.includes("rsvp_already_submitted")) {
      return NextResponse.json({ error: "already_submitted" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
