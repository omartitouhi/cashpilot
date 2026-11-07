import type { SessionUser } from "@cashpilot/application";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "cashpilot_session";
const SEVEN_DAYS = 7 * 24 * 60 * 60; // en secondes

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET est manquant dans le fichier .env");
  return new TextEncoder().encode(secret);
}

/** Lit un jeton de session. Renvoie null s'il est absent, modifié ou expiré. */
export async function decodeSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as SessionUser; // fiable : le jeton est signé par nous
  } catch {
    return null;
  }
}

/** Ouvre la session : un cookie httpOnly, illisible en JavaScript côté navigateur. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export async function readSession(): Promise<SessionUser | null> {
  return decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
