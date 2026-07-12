import { z } from "zod";
import { MIN_GIFT_AMOUNT_CENTS } from "@/lib/constants";

export const createGiftPaymentSchema = z.object({
  giftId: z.string().uuid(),
  amountCents: z
    .number()
    .int()
    .min(MIN_GIFT_AMOUNT_CENTS, "O valor mínimo é R$ 10,00.")
    .max(5_000_000, "Valor muito alto para processar automaticamente."),
  giverName: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(500).optional().default(""),
});

export type CreateGiftPaymentInput = z.infer<typeof createGiftPaymentSchema>;
