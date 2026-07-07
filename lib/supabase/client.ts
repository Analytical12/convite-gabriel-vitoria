"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Used only by the admin login page (magic link
 * sign-in) — the public site never talks to Supabase directly from the
 * client, it always goes through server route handlers.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set."
    );
  }

  return createBrowserClient(url, anonKey);
}
