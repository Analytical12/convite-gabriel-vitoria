"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAllowedAdminEmail } from "@/lib/auth/admin-auth";

export type MagicLinkState = {
  status: "idle" | "sent" | "error";
  message: string;
};

export async function requestMagicLink(_prevState: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Informe um e-mail." };
  }

  // Checked before ever calling Supabase: a non-allowlisted email never
  // gets a magic link sent to it, not just a blocked /admin route later.
  if (!isAllowedAdminEmail(email)) {
    return { status: "error", message: "Este e-mail não tem acesso ao painel administrativo." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return { status: "error", message: "Configuração ausente (NEXT_PUBLIC_SITE_URL). Avise o administrador." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });

  if (error) {
    return { status: "error", message: "Não foi possível enviar o link agora. Tente novamente." };
  }

  return { status: "sent", message: "" };
}
