import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getMercadoPagoPayment, isValidMercadoPagoWebhook, mapMercadoPagoStatus } from "@/lib/payments/mercadopago";

/**
 * Mercado Pago calls this URL (configured as `notification_url` on the
 * preference) whenever a payment's status changes. See docs/PAYMENTS.md for
 * the full flow and the manual test plan — this has not been exercised
 * against a real Mercado Pago account yet.
 */
export async function POST(request: NextRequest) {
  const dataId = request.nextUrl.searchParams.get("data.id") ?? request.nextUrl.searchParams.get("id");
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!dataId) {
    return NextResponse.json({ error: "missing_data_id" }, { status: 400 });
  }

  let signatureValid: boolean;
  try {
    signatureValid = isValidMercadoPagoWebhook({ xSignature, xRequestId, dataId });
  } catch {
    // MERCADOPAGO_WEBHOOK_SECRET not configured — nothing to verify against
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  if (!signatureValid) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const payment = await getMercadoPagoPayment(dataId);
  const contributionId = payment.external_reference;

  if (!contributionId) {
    // nothing to reconcile against — acknowledge so MP doesn't retry forever
    return NextResponse.json({ ok: true });
  }

  const supabase = createSupabaseAdminClient();
  const paymentStatus = mapMercadoPagoStatus(payment.status);

  await supabase
    .from("gift_contributions")
    .update({
      provider_payment_id: String(payment.id ?? dataId),
      provider_status: payment.status ?? null,
      payment_status: paymentStatus,
      ...(paymentStatus === "approved" ? { paid_at: new Date().toISOString() } : {}),
    })
    .eq("id", contributionId);

  return NextResponse.json({ ok: true });
}
