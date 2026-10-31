import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import GuestsTable, { type HouseholdWithGuests } from "@/components/admin/GuestsTable";

// rsvp_submissions is unique per household, so PostgREST may embed it as a
// single object or as a one-item array depending on how it reads the index.
function rsvpStatusOf(embedded: unknown): string | null {
  const row = Array.isArray(embedded) ? embedded[0] : embedded;
  return row && typeof row === "object" && "status" in row ? String(row.status) : null;
}

export default async function AdminGuestsPage() {
  const supabase = createSupabaseAdminClient();

  // households.notes holds the family's group (Noivos, Padrinhos, ...)
  const { data: households } = await supabase
    .from("households")
    .select("id, code, display_name, notes, is_active, guests(id, full_name, sort_order), rsvp_submissions(status)")
    .order("notes", { ascending: true })
    .order("display_name", { ascending: true });

  const rows: HouseholdWithGuests[] = (households ?? []).map((household) => ({
    id: household.id,
    code: household.code,
    displayName: household.display_name,
    group: household.notes,
    isActive: household.is_active,
    rsvpStatus: rsvpStatusOf(household.rsvp_submissions),
    guests: (household.guests ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((guest) => ({ id: guest.id, fullName: guest.full_name })),
  }));

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", marginBottom: "var(--space-2)" }}>
        Convidados
      </h1>
      <p style={{ color: "var(--color-ink-soft)", marginBottom: "var(--space-6)" }}>
        Cada família confirma presença pelo próprio link. Use &ldquo;WhatsApp&rdquo; para enviar o convite já com o link.
      </p>
      <GuestsTable households={rows} />
    </div>
  );
}
