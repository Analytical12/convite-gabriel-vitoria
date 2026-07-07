import { z } from "zod";

export const rsvpGuestStatusSchema = z.object({
  guestId: z.string().uuid(),
  willAttend: z.boolean(),
});

export const submitRsvpSchema = z.object({
  guests: z.array(rsvpGuestStatusSchema).min(1, "Selecione ao menos um convidado."),
  dietaryRestrictions: z.string().trim().max(500).optional().default(""),
  message: z.string().trim().max(1000).optional().default(""),
});

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;

export const rsvpStatusValues = ["confirmed", "declined", "partial"] as const;
export type RsvpStatus = (typeof rsvpStatusValues)[number];

/**
 * Same derivation the `submit_rsvp`/`admin_override_rsvp` Postgres functions
 * use (supabase/migrations/003_rsvp_rpc.sql): all attending -> confirmed,
 * none attending -> declined, anything mixed -> partial. Kept as a single
 * source of truth so the admin edit UI and this validator can never predict
 * a different status than what actually gets persisted by the RPC.
 */
export function deriveRsvpStatus(guestStatuses: Array<{ willAttend: boolean }>): RsvpStatus {
  const total = guestStatuses.length;
  const attending = guestStatuses.filter((guest) => guest.willAttend).length;
  if (attending === 0) return "declined";
  if (attending === total) return "confirmed";
  return "partial";
}

export const adminOverrideRsvpSchema = z
  .object({
    householdId: z.string().uuid(),
    status: z.enum(rsvpStatusValues),
    dietaryRestrictions: z.string().trim().max(500).optional().default(""),
    message: z.string().trim().max(1000).optional().default(""),
    guestStatuses: z.array(rsvpGuestStatusSchema).min(1, "Selecione ao menos um convidado."),
  })
  .superRefine((data, ctx) => {
    const expected = deriveRsvpStatus(data.guestStatuses);
    if (data.status !== expected) {
      ctx.addIssue({
        code: "custom",
        message: `O status "${data.status}" não corresponde às presenças marcadas (esperado: "${expected}").`,
        path: ["status"],
      });
    }
  });

export type AdminOverrideRsvpInput = z.infer<typeof adminOverrideRsvpSchema>;
