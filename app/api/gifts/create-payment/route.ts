import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessCookie } from "@/lib/auth/access-cookie";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ACCESS_COOKIE_NAME } from "@/lib/constants";
import { createGiftPaymentSchema } from "@/lib/validators/gift";
import { createGiftPreference, isMercadoPagoConfigured } from "@/lib/payments/mercadopago";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const payload = await verifyAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!payload) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createGiftPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ error: "config_missing" }, { status: 503 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: gift } = await supabase
    .from("gifts")
    .select("id, title, is_active")
    .eq("id", parsed.data.giftId)
    .maybeSingle();

  if (!gift || !gift.is_active) {
    return NextResponse.json({ error: "gift_not_found" }, { status: 404 });
  }

  const { data: contribution, error: insertError } = await supabase
    .from("gift_contributions")
    .insert({
      gift_id: gift.id,
      household_id: payload.householdId,
      giver_name: parsed.data.giverName || null,
      message: parsed.data.message || null,
      amount_cents: parsed.data.amountCents,
      payment_status: "pending",
      payment_provider: "mercadopago",
    })
    .select("id")
    .single();

  if (insertError || !contribution) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  try {
    const { initPoint, preferenceId } = await createGiftPreference({
      contributionId: contribution.id,
      giftTitle: gift.title,
      amountCents: parsed.data.amountCents,
    });

    await supabase
      .from("gift_contributions")
      .update({ provider_preference_id: preferenceId })
      .eq("id", contribution.id);

    return NextResponse.json({ initPoint });
  } catch {
    // preference creation failed — remove the orphaned pending row instead
    // of leaving a contribution nobody can ever pay for
    await supabase.from("gift_contributions").delete().eq("id", contribution.id);
    return NextResponse.json({ error: "payment_provider_error" }, { status: 502 });
  }
}
