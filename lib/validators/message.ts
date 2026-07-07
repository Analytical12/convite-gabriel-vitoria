import { z } from "zod";

export const createMessageSchema = z.object({
  authorName: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(1000),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
