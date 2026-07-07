import { z } from "zod";

export const accessCodeSchema = z
  .string()
  .trim()
  .min(3, "Código muito curto.")
  .max(40, "Código muito longo.")
  .transform((value) => value.toUpperCase());

export const verifyAccessSchema = z.object({
  code: accessCodeSchema,
});

export type VerifyAccessInput = z.infer<typeof verifyAccessSchema>;
