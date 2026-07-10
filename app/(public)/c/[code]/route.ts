import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { signAccessCookie, accessCookieOptions } from "@/lib/auth/access-cookie";

/**
 * Link-embedded access, e.g. https://weddinggv.com/c/GV-FAMILIA sent
 * over WhatsApp. Validates the code, sets the same signed cookie the manual
 * gate on "/" sets, then redirects into the invitation.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const url = request.nextUrl.clone();

  const supabase = createSupabaseAdminClient();
  const { data: household } = await supabase
    .from("households")
    .select("id, code, is_active")
    .ilike("code", code)
    .maybeSingle();

  if (!household || !household.is_active) {
    url.pathname = "/";
    url.search = "";
    url.searchParams.set("erro", "codigo");
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
