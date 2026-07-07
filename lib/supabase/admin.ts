import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS — this is what lets the app
 * read/write household, guest, RSVP and gift data on behalf of a guest who
 * only proved themselves via the signed access cookie (never via Supabase
 * Auth). Must only ever be imported from server-only code: API routes and
 * Server Components, never from a "use client" file.
 */
export function createSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createSupabaseAdminClient() must never run in the browser.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
