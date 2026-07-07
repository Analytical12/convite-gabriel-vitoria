import { redirect } from "next/navigation";
import { getAuthorizedAdminUser } from "@/lib/auth/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import "@/styles/admin.css";

// Every admin page reads live Supabase data and requires a session — never
// statically prerender any of it at build time.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthorizedAdminUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminShell userEmail={user.email ?? ""}>{children}</AdminShell>;
}
