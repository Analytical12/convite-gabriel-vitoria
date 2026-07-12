import {
  MercadoPagoConfig,
  Preference,
  Payment,
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from "mercadopago";

/**
 * Mercado Pago (Checkout Pro) integration, isolated behind this module so
 * nothing else in the app touches the SDK directly. Every function here
 * throws a clear, specific error when credentials are missing instead of
 * silently succeeding — there is no "fake success" dev mock, per the
 * project's requirement to never pretend a payment went through.
 *
 * TODO(payments): this has not been exercised against a real Mercado Pago
 * account yet (no MERCADOPAGO_ACCESS_TOKEN was available while building
 * this). Test the full create-preference -> pay -> webhook loop in sandbox
 * before going live. See docs/PAYMENTS.md for the manual test plan.
 */

export function isMercadoPagoConfigured(): boolean {
  return Boolean(
    process.env.MERCADOPAGO_ACCESS_TOKEN &&
      process.env.NEXT_PUBLIC_SITE_URL &&
      ["test", "production"].includes(process.env.MERCADOPAGO_ENV ?? "")
  );
}

export function isExpectedMercadoPagoLiveMode(liveMode: boolean | undefined): boolean {
  if (typeof liveMode !== "boolean") return false;
  if (process.env.MERCADOPAGO_ENV === "production") return liveMode;
  if (process.env.MERCADOPAGO_ENV === "test") return !liveMode;
  return false;
}

function getConfig(): MercadoPagoConfig {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN is not set. Configure it in .env before accepting payments."
    );
  }
  return new MercadoPagoConfig({ accessToken });
}

function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set.");
  }
  return url.replace(/\/$/, "");
}

export type CreateGiftPreferenceInput = {
  contributionId: string;
  giftTitle: string;
  amountCents: number;
};

export async function createGiftPreference(
  input: CreateGiftPreferenceInput
): Promise<{ initPoint: string; preferenceId: string }> {
  const config = getConfig();
  const preferenceClient = new Preference(config);
  const siteUrl = getSiteUrl();

  const response = await preferenceClient.create({
    body: {
      items: [
        {
          id: input.contributionId,
          title: input.giftTitle,
          quantity: 1,
          currency_id: "BRL",
          unit_price: input.amountCents / 100,
        },
      ],
      external_reference: input.contributionId,
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      back_urls: {
        success: `${siteUrl}/convite?presente=sucesso`,
        pending: `${siteUrl}/convite?presente=pendente`,
        failure: `${siteUrl}/convite?presente=falha`,
      },
      auto_return: "approved",
      statement_descriptor: "GABRIEL VITORIA",
      metadata: {
        contribution_id: input.contributionId,
      },
    },
    requestOptions: { idempotencyKey: input.contributionId },
  });

  if (!response.id || !response.init_point) {
    throw new Error("Mercado Pago não retornou uma preference válida.");
  }

  return { initPoint: response.init_point, preferenceId: response.id };
}

export async function getMercadoPagoPayment(paymentId: string) {
  const config = getConfig();
  const paymentClient = new Payment(config);
  return paymentClient.get({ id: paymentId });
}

export type WebhookValidationInput = {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
};

export function isValidMercadoPagoWebhook(input: WebhookValidationInput): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("MERCADOPAGO_WEBHOOK_SECRET is not set.");
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature: input.xSignature,
      xRequestId: input.xRequestId,
      dataId: input.dataId,
      secret,
    });
    return true;
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return false;
    }
    throw error;
  }
}

/**
 * Maps a Mercado Pago payment status to this app's internal
 * gift_contributions.payment_status enum.
 */
export function mapMercadoPagoStatus(
  status: string | undefined
): "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "manual_review" {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
    case "charged_back":
      return "refunded";
    case "in_process":
    case "in_mediation":
    case "authorized":
      return "manual_review";
    case "pending":
    default:
      return "pending";
  }
}
