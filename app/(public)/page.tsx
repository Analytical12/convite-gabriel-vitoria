import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessCookie } from "@/lib/auth/access-cookie";
import { ACCESS_COOKIE_NAME } from "@/lib/constants";
import AccessGate from "@/components/public/AccessGate";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const cookieStore = await cookies();
  const payload = await verifyAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (payload) {
    redirect("/convite");
  }

  const { erro } = await searchParams;
  const initialNotice = erro ? "Sua sessão expirou. Insira o código novamente." : undefined;

  return <AccessGate initialNotice={initialNotice} />;
}
