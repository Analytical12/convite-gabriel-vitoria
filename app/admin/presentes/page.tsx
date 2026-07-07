import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import GiftsTable, { type GiftContributionRow } from "@/components/admin/GiftsTable";

export default async function AdminGiftsPage() {
  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from("gift_contributions")
    .select("id, amount_cents, payment_status, giver_name, created_at, gifts(title), households(display_name)")
    .order("created_at", { ascending: false })
    .returns<
      Array<{
        id: string;
        amount_cents: number;
        payment_status: string;
        giver_name: string | null;
        created_at: string;
        gifts: { title: string } | null;
        households: { display_name: string } | null;
      }>
    >();

  const rows: GiftContributionRow[] = (data ?? []).map((row) => ({
    id: row.id,
    giftTitle: row.gifts?.title ?? "—",
    householdName: row.households?.display_name ?? null,
    giverName: row.giver_name,
    amountCents: row.amount_cents,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  }));

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", marginBottom: "var(--space-6)" }}>
        Presentes
      </h1>
      <GiftsTable rows={rows} />
    </div>
  );
}
