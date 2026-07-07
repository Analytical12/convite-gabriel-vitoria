import { createSupabaseServerClient } from "@/lib/supabase/server";

export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}

/**
 * Resolves the current Supabase Auth session and checks it against the
 * admin allowlist. Returns null if there's no session OR the session's
 * email isn't allowlisted — callers treat both cases the same way
 * (redirect to /login), so we don't leak which case it was.
 */
export async function getAuthorizedAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    return null;
  }

  return user;
}
