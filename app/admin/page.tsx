import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import AdminStatCard from "@/components/admin/AdminStatCard";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseAdminClient();

  const [
    householdsCount,
    guestsCount,
    confirmedCount,
    declinedCount,
    partialCount,
    submissionsCount,
    dietaryCount,
    approvedPaymentsCount,
    pendingPaymentsCount,
    messagesCount,
  ] = await Promise.all([
    supabase.from("households").select("id", { count: "exact", head: true }),
    supabase.from("guests").select("id", { count: "exact", head: true }).eq("is_invited", true),
    supabase.from("rsvp_submissions").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("rsvp_submissions").select("id", { count: "exact", head: true }).eq("status", "declined"),
    supabase.from("rsvp_submissions").select("id", { count: "exact", head: true }).eq("status", "partial"),
    supabase.from("rsvp_submissions").select("id", { count: "exact", head: true }),
    supabase
      .from("rsvp_submissions")
      .select("id", { count: "exact", head: true })
      .not("dietary_restrictions", "is", null),
    supabase.from("gift_contributions").select("id", { count: "exact", head: true }).eq("payment_status", "approved"),
    supabase.from("gift_contributions").select("id", { count: "exact", head: true }).eq("payment_status", "pending"),
    supabase.from("private_messages").select("id", { count: "exact", head: true }),
  ]);

  const totalHouseholds = householdsCount.count ?? 0;
  const totalSubmissions = submissionsCount.count ?? 0;
  const pendingRsvp = Math.max(totalHouseholds - totalSubmissions, 0);

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", marginBottom: "var(--space-6)" }}>
        Visão geral
      </h1>

      <div className="admin-stat-grid">
        <AdminStatCard label="Famílias" value={totalHouseholds} />
        <AdminStatCard label="Convidados" value={guestsCount.count ?? 0} />
        <AdminStatCard label="RSVP confirmados" value={confirmedCount.count ?? 0} />
        <AdminStatCard label="RSVP recusados" value={declinedCount.count ?? 0} />
        <AdminStatCard label="RSVP parciais" value={partialCount.count ?? 0} />
        <AdminStatCard label="RSVP pendentes" value={pendingRsvp} />
        <AdminStatCard label="Com restrição alimentar" value={dietaryCount.count ?? 0} />
        <AdminStatCard label="Pagamentos aprovados" value={approvedPaymentsCount.count ?? 0} />
        <AdminStatCard label="Pagamentos pendentes" value={pendingPaymentsCount.count ?? 0} />
        <AdminStatCard label="Recados recebidos" value={messagesCount.count ?? 0} />
      </div>
    </div>
  );
}
