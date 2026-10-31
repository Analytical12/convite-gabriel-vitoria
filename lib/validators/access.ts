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

/**
 * Codes are matched case-insensitively with ILIKE, where % and _ are
 * wildcards — unescaped, "/c/gab%" would log in as whichever family matches.
 */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}
