import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import MessagesTable, { type MessageRow } from "@/components/admin/MessagesTable";

export default async function AdminMessagesPage() {
  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from("private_messages")
    .select("id, author_name, message, created_at, households(display_name)")
    .order("created_at", { ascending: false })
    .returns<
      Array<{
        id: string;
        author_name: string | null;
        message: string;
        created_at: string;
        households: { display_name: string } | null;
      }>
    >();

  const rows: MessageRow[] = (data ?? []).map((row) => ({
    id: row.id,
    householdName: row.households?.display_name ?? null,
    authorName: row.author_name,
    message: row.message,
    createdAt: row.created_at,
  }));

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", marginBottom: "var(--space-6)" }}>
        Recados
      </h1>
      <MessagesTable rows={rows} />
    </div>
  );
}
