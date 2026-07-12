import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getMercadoPagoPayment,
  isExpectedMercadoPagoLiveMode,
  isValidMercadoPagoWebhook,
  mapMercadoPagoStatus,
} from "@/lib/payments/mercadopago";

/**
 * Mercado Pago calls this URL (configured as `notification_url` on the
 * preference) whenever a payment's status changes. See docs/PAYMENTS.md for
 * the full flow and the manual test plan — this has not been exercised
 * against a real Mercado Pago account yet.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { type?: string; data?: { id?: string | number } }
    | null;
  const dataId =
    request.nextUrl.searchParams.get("data.id") ??
    request.nextUrl.searchParams.get("id") ??
    (body?.data?.id != null ? String(body.data.id) : null);
  const notificationType = request.nextUrl.searchParams.get("type") ?? body?.type;
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (notificationType && notificationType !== "payment") {
    return NextResponse.json({ ok: true, ignored: true });
  }

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

  let payment;
  try {
    payment = await getMercadoPagoPayment(dataId);
  } catch {
    // Non-2xx asks Mercado Pago to retry transient provider/network failures.
    return NextResponse.json({ error: "payment_lookup_failed" }, { status: 502 });
  }
  const contributionId = payment.external_reference;

  if (!isExpectedMercadoPagoLiveMode(payment.live_mode)) {
    return NextResponse.json({ error: "payment_environment_mismatch" }, { status: 422 });
  }

  if (!contributionId) {
    // nothing to reconcile against — acknowledge so MP doesn't retry forever
    return NextResponse.json({ ok: true });
  }

  const supabase = createSupabaseAdminClient();
  const paymentStatus = mapMercadoPagoStatus(payment.status);

  const { data: contribution, error: contributionError } = await supabase
    .from("gift_contributions")
    .select("id, amount_cents, provider_payment_id")
    .eq("id", contributionId)
    .maybeSingle();

  if (contributionError) {
    return NextResponse.json({ error: "reconciliation_lookup_failed" }, { status: 500 });
  }

  if (!contribution) {
    // The reference does not belong to this application. Acknowledge without
    // mutating anything so an invalid reference cannot trigger endless retries.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const amountCents = Math.round((payment.transaction_amount ?? 0) * 100);
  if (payment.currency_id !== "BRL" || amountCents !== contribution.amount_cents) {
    return NextResponse.json({ error: "payment_mismatch" }, { status: 422 });
  }

  const providerPaymentId = String(payment.id ?? dataId);
  if (contribution.provider_payment_id && contribution.provider_payment_id !== providerPaymentId) {
    return NextResponse.json({ error: "payment_reference_conflict" }, { status: 409 });
  }

  const { error: updateError } = await supabase
    .from("gift_contributions")
    .update({
      provider_payment_id: providerPaymentId,
      provider_status: payment.status ?? null,
      provider_status_detail: payment.status_detail ?? null,
      provider_live_mode: payment.live_mode ?? null,
      provider_currency: payment.currency_id ?? null,
      payment_method: payment.payment_type_id ?? payment.payment_method_id ?? null,
      payment_status: paymentStatus,
      ...(paymentStatus === "approved"
        ? { paid_at: payment.date_approved ?? new Date().toISOString() }
        : {}),
    })
    .eq("id", contributionId);

  if (updateError) {
    return NextResponse.json({ error: "reconciliation_update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
