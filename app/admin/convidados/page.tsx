import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import GuestsTable, { type HouseholdWithGuests } from "@/components/admin/GuestsTable";

export default async function AdminGuestsPage() {
  const supabase = createSupabaseAdminClient();

  const { data: households } = await supabase
    .from("households")
    .select("id, code, display_name, type, max_invited, is_active, guests(id, full_name, age_group, sort_order)")
    .order("display_name", { ascending: true });

  const rows: HouseholdWithGuests[] = (households ?? []).map((household) => ({
    id: household.id,
    code: household.code,
    displayName: household.display_name,
    type: household.type,
    maxInvited: household.max_invited,
    isActive: household.is_active,
    guests: (household.guests ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((guest) => ({ id: guest.id, fullName: guest.full_name, ageGroup: guest.age_group })),
  }));

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", marginBottom: "var(--space-6)" }}>
        Convidados
      </h1>
      <GuestsTable households={rows} />
    </div>
  );
}
