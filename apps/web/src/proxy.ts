import { NextResponse, type NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/session";

const PUBLIC_PAGES = ["/connexion", "/inscription"];

/**
 * Garde d'accès, exécutée avant chaque page :
 * - pas connecté → page de connexion
 * - déjà connecté sur connexion/inscription → tableau de bord
 * Les droits détaillés restent vérifiés dans les use cases.
 */
export async function proxy(request: NextRequest) {
  const user = await decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = PUBLIC_PAGES.includes(request.nextUrl.pathname);

  if (!user && !isPublic) return NextResponse.redirect(new URL("/connexion", request.url));
  if (user && isPublic) return NextResponse.redirect(new URL("/", request.url));
  return NextResponse.next();
}

export const config = {
  // Toutes les pages, sauf les fichiers techniques de Next.js.
  matcher: ["/((?!_next|favicon.ico).*)"],
};
