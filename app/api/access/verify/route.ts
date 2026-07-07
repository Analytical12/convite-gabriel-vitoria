import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { signAccessCookie, accessCookieOptions } from "@/lib/auth/access-cookie";
import { verifyAccessSchema } from "@/lib/validators/access";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = verifyAccessSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: household } = await supabase
    .from("households")
    .select("id, code, is_active")
    .ilike("code", parsed.data.code)
    .maybeSingle();

  if (!household || !household.is_active) {
    // deliberately the same generic 404 whether the code doesn't exist or
    // is inactive — don't leak which case it was
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { value, maxAge } = await signAccessCookie({
    householdId: household.id,
    code: household.code,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(accessCookieOptions.name, value, { ...accessCookieOptions, maxAge });
  return response;
}
