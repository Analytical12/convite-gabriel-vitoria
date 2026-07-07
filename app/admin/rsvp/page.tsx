import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import RSVPTable, { type RsvpRow } from "@/components/admin/RSVPTable";

export const dynamic = "force-dynamic";

export default async function AdminRsvpPage() {
  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from("rsvp_submissions")
    .select(
      `id, household_id, status, dietary_restrictions, message, submitted_at, edited_by_admin,
       households(code, display_name, guests(id, full_name, age_group, sort_order)),
       rsvp_guest_status(guest_id, will_attend)`
    )
    .order("submitted_at", { ascending: false })
    .returns<
      Array<{
        id: string;
        household_id: string;
        status: string;
        dietary_restrictions: string | null;
        message: string | null;
        submitted_at: string;
        edited_by_admin: boolean;
        households: {
          code: string;
          display_name: string;
          guests: Array<{ id: string; full_name: string; age_group: string; sort_order: number }>;
        } | null;
        rsvp_guest_status: Array<{ guest_id: string; will_attend: boolean }>;
      }>
    >();

  const rows: RsvpRow[] = (data ?? []).map((row) => {
    const guests = (row.households?.guests ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((guest) => ({ id: guest.id, fullName: guest.full_name, ageGroup: guest.age_group }));

    const attendance: Record<string, boolean> = {};
    for (const guest of guests) attendance[guest.id] = false;
    for (const entry of row.rsvp_guest_status ?? []) attendance[entry.guest_id] = entry.will_attend;

    return {
      id: row.id,
      householdId: row.household_id,
      householdCode: row.households?.code ?? "",
      householdName: row.households?.display_name ?? "—",
      status: row.status,
      dietaryRestrictions: row.dietary_restrictions,
      message: row.message,
      submittedAt: row.submitted_at,
      editedByAdmin: row.edited_by_admin,
      guests,
      attendance,
    };
  });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", marginBottom: "var(--space-6)" }}>
        RSVP
      </h1>
      <p style={{ color: "var(--color-ink-soft)", marginBottom: "var(--space-5)" }}>
        Use &quot;Editar RSVP&quot; para corrigir manualmente a presença, restrição alimentar ou mensagem de uma
        família. O convidado continua sem poder alterar a própria resposta pelo site.
      </p>
      <RSVPTable rows={rows} />
    </div>
  );
}
