import { ACCESS_COOKIE_NAME } from "@/lib/constants";

/**
 * Signed access cookie for the "code gate" in front of the public invitation.
 * Implemented with Web Crypto (HMAC-SHA256) instead of Node's `crypto` module
 * on purpose: this file is imported from both proxy.ts (Edge runtime)
 * and Node-runtime route handlers, and Web Crypto is the one API both share.
 */

export type AccessPayload = {
  householdId: string;
  code: string;
  exp: number; // unix seconds
};

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 120; // 120 days — the wedding is months away

function getSecret(): string {
  const secret = process.env.ACCESS_COOKIE_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ACCESS_COOKIE_SECRET is not set (or too short). Set it in .env before signing access cookies."
    );
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAccessCookie(
  payload: Omit<AccessPayload, "exp">
): Promise<{ value: string; maxAge: number }> {
  const secret = getSecret();
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE_SECONDS;
  const fullPayload: AccessPayload = { ...payload, exp };

  const payloadBytes = new TextEncoder().encode(JSON.stringify(fullPayload));
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);

  const value = `${toBase64Url(payloadBytes)}.${toBase64Url(new Uint8Array(signature))}`;
  return { value, maxAge: COOKIE_MAX_AGE_SECONDS };
}

export async function verifyAccessCookie(cookieValue: string | undefined): Promise<AccessPayload | null> {
  if (!cookieValue) return null;
  const [payloadPart, signaturePart] = cookieValue.split(".");
  if (!payloadPart || !signaturePart) return null;

  try {
    const secret = getSecret();
    const payloadBytes = fromBase64Url(payloadPart);
    const signatureBytes = fromBase64Url(signaturePart);
    const key = await getHmacKey(secret);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      payloadBytes as BufferSource
    );
    if (!isValid) return null;

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as AccessPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (typeof payload.householdId !== "string" || typeof payload.code !== "string") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const accessCookieOptions = {
  name: ACCESS_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
