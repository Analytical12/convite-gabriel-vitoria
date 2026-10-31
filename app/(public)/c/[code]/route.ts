import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { signAccessCookie, accessCookieOptions } from "@/lib/auth/access-cookie";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import { escapeLikePattern } from "@/lib/validators/access";

/**
 * Link-embedded access, e.g. https://weddinggv.com/c/valdir-neusa sent
 * over WhatsApp. Validates the code, sets the same signed cookie the manual
 * gate on "/" sets, then redirects into the invitation — this is how a
 * family reaches its own RSVP form.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const url = request.nextUrl.clone();

  const supabase = createSupabaseAdminClient();
  const { data: household } = await supabase
    .from("households")
    .select("id, code, is_active")
    .ilike("code", escapeLikePattern(code))
    .maybeSingle();

  if (!household || !household.is_active) {
    url.search = "";
    if (PUBLIC_EXPERIENCE.requireAccessCode) {
      url.pathname = "/";
      url.searchParams.set("erro", "codigo");
    } else {
      // the invitation is open anyway: show it, just without a family RSVP
      url.pathname = "/convite";
    }
    return NextResponse.redirect(url);
  }

  const { value, maxAge } = await signAccessCookie({
    householdId: household.id,
    code: household.code,
  });

  url.pathname = "/convite";
  url.search = "";
  const response = NextResponse.redirect(url);
  response.cookies.set(accessCookieOptions.name, value, { ...accessCookieOptions, maxAge });
  return response;
}
