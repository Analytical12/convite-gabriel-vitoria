import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifyAccessCookie } from "@/lib/auth/access-cookie";
import { isAllowedAdminEmail } from "@/lib/auth/admin-auth";
import { ACCESS_COOKIE_NAME, ADMIN_ROUTE_PREFIX, PUBLIC_GATED_PREFIXES } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_GATED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return handleGatedRoute(request);
  }

  if (pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
    return handleAdminRoute(request);
  }

  return NextResponse.next();
}

async function handleGatedRoute(request: NextRequest) {
  const cookieValue = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const payload = await verifyAccessCookie(cookieValue);

  if (!payload) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("erro", "acesso");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

async function handleAdminRoute(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const redirectToLogin = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    return redirectToLogin();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    return redirectToLogin();
  }

  return response;
}

export const config = {
  matcher: ["/convite/:path*", "/admin/:path*"],
};
