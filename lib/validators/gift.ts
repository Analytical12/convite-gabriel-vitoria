import { z } from "zod";

export const createGiftPaymentSchema = z.object({
  giftId: z.string().uuid(),
  amountCents: z
    .number()
    .int()
    .min(500, "O valor mínimo é R$ 5,00.")
    .max(5_000_000, "Valor muito alto para processar automaticamente."),
  giverName: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(500).optional().default(""),
});

export type CreateGiftPaymentInput = z.infer<typeof createGiftPaymentSchema>;
