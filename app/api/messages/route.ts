import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessCookie } from "@/lib/auth/access-cookie";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ACCESS_COOKIE_NAME } from "@/lib/constants";
import { createMessageSchema } from "@/lib/validators/message";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const payload = await verifyAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!payload) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("private_messages").insert({
    household_id: payload.householdId,
    author_name: parsed.data.authorName || null,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
